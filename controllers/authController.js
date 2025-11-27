const bd = require("../bd");
const fs = require("fs");
const path = require("path");
const auth = require("../auth");

async function criarDonoAutomatico() {
  await bd.query(`
    INSERT IGNORE INTO usuarios 
    (id, nome_usuario, cpf, nome_responsavel, curso, login, senha, tipo)
    VALUES
    (1, 'IF_LANCHES', '00000000000', 'Administrador', 'TDS', 'admin', 'root', 'dono')
  `);
}
criarDonoAutomatico();

function loginGET(req, res) {
  const html = fs.readFileSync(path.join(__dirname, "../index.html"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

async function loginPOST(req, res) {
  let body = "";
  req.on("data", chunk => body += chunk);

  req.on("end", async () => {
    const dados = new URLSearchParams(body);
    const usuario = dados.get("usuario");
    const senha = dados.get("senha");

    const [rows] = await bd.query(
      "SELECT * FROM usuarios WHERE login = ? AND senha = ?",
      [usuario, senha]
    );

    if (rows.length === 0) {
      res.writeHead(302, { Location: "/login?erro=1" });
      return res.end();
    }

    const user = rows[0];

    const token = auth.criarSessao({
      id: user.id,
      nome: user.nome_usuario,
      tipo: user.tipo
    });

    res.writeHead(302, {
      "Set-Cookie": [
        `sessao=${token}; HttpOnly; Path=/`,
        `tipoUsuario=${user.tipo}; Path=/`
      ],
      Location: "/home"
    });

    res.end();
  });
}

function cadastroGET(req, res) {
  const html = fs.readFileSync(path.join(__dirname, "../pages/cadastro.html"));
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

async function cadastroPOST(req, res) {
  let body = "";
  req.on("data", chunk => (body += chunk));

  req.on("end", async () => {
    const dados = new URLSearchParams(body);

    const cpf = dados.get("cpf");
    const nome = dados.get("nome");
    const nomerespo = dados.get("nomerespo");
    const login = dados.get("usuario");
    const senha = dados.get("senha");
    const curso = dados.get("curso");

    // 1) Criar usuário normalmente
    const [resultado] = await bd.query(
      "INSERT INTO usuarios (nome_usuario, cpf, nome_responsavel, curso, login, senha, tipo) VALUES (?, ?, ?, ?, ?, ?, 'aluno')",
      [nome, cpf, nomerespo, curso, login, senha]
    );

    const novoUsuarioId = resultado.insertId;

    await bd.query(
      "INSERT INTO clientes_financas (id_usuario, curso, valor_atual) VALUES (?, ?, 0.00)",
      [novoUsuarioId, curso]
    );

    console.log(`Conta financeira criada para usuário ID ${novoUsuarioId}`);

    res.writeHead(302, { Location: "/login" });
    res.end();
  });
}



async function perfilGET(req, res) {
  const cookies = req.headers.cookie || "";
  const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];

  if (!token) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }

  const sessao = auth.obterUsuarioPorToken(token);
  if (!sessao) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }


  const usuario = await obterUsuarioCompleto(sessao.id);

  const formatarCpf = cpf =>
    cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

  let pagina = fs.readFileSync(
    path.join(__dirname, "../pages/addsaldo.html"),
    "utf8"
  );

  pagina = pagina
    .replace(/\$\{usuario.nome\}/g, usuario.nome_usuario)
    .replace(/\$\{usuario.nomePrimeiro\}/g, usuario.nome_usuario.split(" ")[0])
    .replace(/\$\{usuario.cpf\}/g, formatarCpf(usuario.cpf))
    .replace(/\$\{usuario.responsavel\}/g, usuario.nome_responsavel)
    .replace(/\$\{usuario.curso\}/g, usuario.curso)
    .replace(/\$\{usuario.saldo\}/g, Number(usuario.saldo).toFixed(2));

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pagina);
}

async function perfilcomum(req, res) {
  const cookies = req.headers.cookie || "";
  const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];

  if (!token) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }

  const sessao = auth.obterUsuarioPorToken(token);
  if (!sessao) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }


  const usuario = await obterUsuarioCompleto(sessao.id);

  const formatarCpf = cpf =>
    cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

  let pagina = fs.readFileSync(
    path.join(__dirname, "../pages/perfil.html"),
    "utf8"
  );

  pagina = pagina
    .replace(/\$\{usuario.nome\}/g, usuario.nome_usuario)
    .replace(/\$\{usuario.nomePrimeiro\}/g, usuario.nome_usuario.split(" ")[0])
    .replace(/\$\{usuario.cpf\}/g, formatarCpf(usuario.cpf))
    .replace(/\$\{usuario.responsavel\}/g, usuario.nome_responsavel)
    .replace(/\$\{usuario.curso\}/g, usuario.curso)
    .replace(/\$\{usuario.saldo\}/g, Number(usuario.saldo).toFixed(2));

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(pagina);
}

async function saldoGET(req, res) {
  const cookies = req.headers.cookie || "";
  const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];

  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ erro: "Não autenticado" }));
  }

  const sessao = auth.obterUsuarioPorToken(token);
  if (!sessao) {
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ erro: "Sessão inválida" }));
  }


  const [[dados]] = await bd.query(
    "SELECT valor_atual AS saldo FROM clientes_financas WHERE id_usuario = ?",
    [sessao.id]
  );

  const saldo = dados?.saldo || 0;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ saldo }));
}

module.exports = { saldoGET };



async function adicionarSaldoPOST(req, res) {
  let body = "";
  req.on("data", chunk => body += chunk);

  req.on("end", async () => {
    try {
      const dados = JSON.parse(body);
      const { id_usuario, valor } = dados;

      if (!id_usuario || !valor) {
        res.writeHead(400);
        return res.end(JSON.stringify({ ok: false, erro: "Dados incompletos" }));
      }


      await bd.query(
        `UPDATE clientes_financas 
         SET valor_atual = valor_atual + ? 
         WHERE id_usuario = ?`,
        [valor, id_usuario]
      );


      await bd.query(
        `INSERT INTO financas_entradas (id_financas, valor_entrada, responsavel_pagamento)
         VALUES (?, ?, ?)`,
        [
          id_usuario,
          valor,
          "Dono do Sistema"
        ]
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));

    } catch (err) {
      console.log("Erro ao adicionar saldo:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ ok: false }));
    }
  });
}

async function obterUsuarioCompleto(id) {

  const [[user]] = await bd.query(
    "SELECT nome_usuario, cpf, nome_responsavel, curso FROM usuarios WHERE id = ?",
    [id]
  );

  const [[financa]] = await bd.query(
    "SELECT valor_atual FROM clientes_financas WHERE id_usuario = ?",
    [id]
  );

  return {
    ...user,
    saldo: financa ? financa.valor_atual : 0
  };
}

async function renderizarPagina(req, res, arquivoHTML) {
  const cookies = req.headers.cookie || "";
  const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];

  if (!token) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }

  const sessao = auth.obterUsuarioPorToken(token);
  if (!sessao) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }

  const usuario = await obterUsuarioCompleto(sessao.id);

  let html = fs.readFileSync(path.join(__dirname, "..", arquivoHTML), "utf8");


  html = html
    .replace(/\$\{usuario\.nome\}/g, usuario.nome_usuario)
    .replace(/\$\{usuario\.nomePrimeiro\}/g, usuario.nome_usuario.split(" ")[0])
    .replace(/\$\{usuario\.cpf\}/g, usuario.cpf)
    .replace(/\$\{usuario\.curso\}/g, usuario.curso)
    .replace(/\$\{usuario\.responsavel\}/g, usuario.nome_responsavel)
    .replace(/\$\{usuario\.saldo\}/g, Number(usuario.saldo).toFixed(2));

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

module.exports = {
  loginGET,
  loginPOST,
  cadastroGET,
  cadastroPOST,
  perfilGET,
  adicionarSaldoPOST,
  saldoGET,      
  renderizarPagina,
  perfilcomum
};


const fs = require("fs");
const path = require("path");
const bd = require("../bd");
const auth = require("../auth");

async function relatorioGET(req, res) {
  const cookies = req.headers.cookie || "";
  const token = cookies
    .split("; ")
    .find((c) => c.startsWith("sessao="))
    ?.split("=")[1];

  if (!token) {
    res.writeHead(302, { Location: "/login" });
    return res.end();
  }

  const sessao = auth.obterUsuarioPorToken(token);

  if (!sessao || sessao.tipo !== "dono") {
    res.writeHead(403);
    return res.end("Acesso negado");
  }

  const [registros] = await bd.query(
    "SELECT valor_saida, produto, responsavel_pagamento FROM financas_saidas ORDER BY id DESC"
  );

  let html = fs.readFileSync(
    path.join(__dirname, "..", "pages", "relatorios.html"),
    "utf8"
  );

  let lista = "";

  registros.forEach((r) => {
    lista += `
    <br>
      <p>Uma compra foi realizada por <strong>${
        r.responsavel_pagamento
      }</strong> no valor de <strong>R$ ${Number(r.valor_saida).toFixed(
      2
    )}</strong>. O produto foi <strong>${r.produto}</strong>.</p>
      <br>
    `;
  });

  html = html.replace("${lista-pedidos}", lista);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
}

module.exports = { relatorioGET };

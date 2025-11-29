const bd = require("../bd");

async function adicionarProdutoPOST(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    const dados = JSON.parse(body);

    try {
      await bd.query(
        "INSERT INTO produtos (nome, descricao, categoria, quantidade, preco) VALUES (?, ?, ?, ?, ?)",
        [
          dados.nome,
          dados.descricao,
          dados.categoria,
          dados.quantidade,
          dados.preco,
        ]
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.log("Erro ao salvar produto:", err);
      res.writeHead(500);
      res.end("Erro ao salvar produto");
    }
  });
}

async function listarProdutosGET(req, res) {
  const [rows] = await bd.query("SELECT * FROM produtos");
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(rows));
}

async function editarProdutoPOST(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    const dados = JSON.parse(body);

    try {
      await bd.query(
        `UPDATE produtos 
         SET nome=?, descricao=?, categoria=?, quantidade=?, preco=? 
         WHERE id=?`,
        [
          dados.nome,
          dados.descricao,
          dados.categoria,
          dados.quantidade,
          dados.preco,
          dados.id,
        ]
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.log("Erro ao atualizar produto:", err);
      res.writeHead(500);
      res.end("Erro ao atualizar produto");
    }
  });
}

async function excluirProdutoPOST(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    const { id } = JSON.parse(body);

    try {
      await bd.query("DELETE FROM produtos WHERE id = ?", [id]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (err) {
      console.log("Erro ao excluir produto:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ ok: false }));
    }
  });
}

module.exports = {
  adicionarProdutoPOST,
  listarProdutosGET,
  editarProdutoPOST,
  excluirProdutoPOST,
};

const fs = require("fs");
const path = require("path");

const { loginGET, loginPOST, cadastroGET, cadastroPOST, perfilGET, renderizarPagina, adicionarSaldoPOST, perfilcomum, } = require("./controllers/authController");
const { verificarAcesso } = require("./controllers/verificarAcesso");
const { adicionarProdutoPOST, listarProdutosGET, editarProdutoPOST,} = require("./controllers/produtosController");
const { buscarUsuarioPorNome } = require("./controllers/usuariosController");
const { comprarProdutoPOST } = require("./controllers/compraController");
const { relatorioGET } = require("./controllers/relatorioController");

function servirArquivo(res, filePath) {
  fs.readFile(path.join(__dirname, filePath), (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Arquivo não encontrado");
    }
    res.writeHead(200);
    res.end(data);
  });
}

function router(req, res) {
  const url = req.url;

  if (url.startsWith("/img/") || url.startsWith("/pages/style/")) { return servirArquivo(res, url); }

  if (req.method === "GET" && (url === "/" || url === "/login")) return loginGET(req, res);
  if (req.method === "POST" && url === "/login") return loginPOST(req, res);

  if (req.method === "GET" && url === "/cadastro") return cadastroGET(req, res);
  if (req.method === "POST" && url === "/cadastro") return cadastroPOST(req, res);

  if (req.method === "GET" && url === "/home") return renderizarPagina(req, res, "./pages/home.html");

  if (req.method === "GET" && url === "/cardapio") return renderizarPagina(req, res, "./pages/cardapio.html");

  if (req.method === "GET" && url === "/gerenciar") return verificarAcesso(req, res, () => { return renderizarPagina(req, res, "./pages/gerenciar.html");});
  if (req.method === "GET" && url === "/addproduto") return verificarAcesso(req, res, () => { return servirArquivo(res, "/pages/addproduto.html");});
  if (req.method === "POST" && url === "/usuario/addsaldo") return adicionarSaldoPOST(req, res);
  if (req.method === "GET" && url === "/addsaldo") return perfilGET(req, res);
  if (req.method === "GET" && url.startsWith("/usuario/buscar")) return buscarUsuarioPorNome(req, res);
  if (req.method === "GET" && url === "/usuario/curso-saldo") return cursoSaldoGET(req, res);
  if (req.method === "GET" && url === "/perfil") return perfilcomum(req, res);
  if (req.method === "GET" && url === "/lista/produtos") return listarProdutosGET(req, res);
  if (req.method === "POST" && url === "/lista/produtos") return adicionarProdutoPOST(req, res);
  if (req.method === "POST" && url === "/editar/produto") return editarProdutoPOST(req, res);
  if (req.method === "GET" && url === "/relatorio") return verificarAcesso(req, res, () => { return relatorioGET(req, res);});

  if (req.method === "POST" && url === "/comprar") return comprarProdutoPOST(req, res);



  res.writeHead(404, { "Content-Type": "text/html" });
  res.end("<h1>404 - Página não encontrada</h1>");
}

module.exports = router;

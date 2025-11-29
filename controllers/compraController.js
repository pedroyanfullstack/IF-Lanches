const bd = require("../bd");
const auth = require("../auth");

async function comprarProdutoPOST(req, res) {
    try {
        let body = "";

        req.on("data", c => body += c);
        req.on("end", async () => {
            const dados = JSON.parse(body);
            const { produto, preco } = dados;

            const cookies = req.headers.cookie || "";
            const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];
            const sessao = auth.obterUsuarioPorToken(token);

            if (!sessao) {
                res.writeHead(401, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ erro: "não autenticado" }));
            }

            const id_usuario = sessao.id;

            const [[fin]] = await bd.query(
                "SELECT valor_atual FROM clientes_financas WHERE id_usuario = ?",
                [id_usuario]
            );

            const saldo = Number(fin.valor_atual);

            if (saldo < preco) {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ autorizado: false }));
            }

            const novoSaldo = saldo - preco;

            await bd.query(
                "UPDATE clientes_financas SET valor_atual = ? WHERE id_usuario = ?",
                [novoSaldo, id_usuario]
            );

            const [[u]] = await bd.query(
                "SELECT nome_usuario FROM usuarios WHERE id = ?",
                [id_usuario]
            );

            await bd.query(
                "INSERT INTO financas_saidas (id_financas, valor_saida, responsavel_pagamento, produto) VALUES (?, ?, ?, ?)",
                [id_usuario, preco, u.nome_usuario, produto]
            );

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                autorizado: true,
                novoSaldo
            }));
        });

    } catch (err) {
        console.log("Erro compra:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ erro: true }));
    }
}

module.exports = { comprarProdutoPOST };

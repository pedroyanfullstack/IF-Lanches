const bd = require("../bd");
const url = require("url");

async function buscarUsuarioPorNome(req, res) {

    const queryObject = url.parse(req.url, true).query;
    const nome = queryObject.nome;

    if (!nome) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ erro: "Parâmetro 'nome' obrigatório" }));
    }

    try {
        const [rows] = await bd.query(
            "SELECT id, nome_usuario, cpf, nome_responsavel, curso FROM usuarios WHERE nome_usuario LIKE ? LIMIT 1",
            [`%${nome}%`]
        );

        if (!rows.length) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ erro: "Usuário não encontrado" }));
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(rows[0]));

    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        res.statusCode = 500;
        res.end(JSON.stringify({ erro: "Erro interno" }));
    }
}

module.exports = { buscarUsuarioPorNome };

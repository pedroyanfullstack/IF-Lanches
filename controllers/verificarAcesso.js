const auth = require('../auth');

function verificarAcesso(req, res, proximo) {

    const cookies = req.headers.cookie || "";
    const token = cookies.split("; ").find(c => c.startsWith("sessao="))?.split("=")[1];

    if (!token) {
        console.log("Nenhum token encontrado. Redirecionando para login.");
        res.writeHead(302, { Location: "/login" });
        return res.end();
    }

    const usuario = auth.obterUsuarioPorToken(token);

    if (!usuario) {
        console.log(`Token invalido ou expirado: ${token}. Redirecionando para login.`);
        res.writeHead(302, { Location: "/login" });
        return res.end();
    }

    console.log(`Usuario encontrado: ${usuario.nome} | Tipo: ${usuario.tipo}`);

    if (usuario.tipo !== "dono") {
        res.writeHead(302, { Location: "/home" });
        return res.end();
    }

    

    req.usuario = usuario; 
    proximo();
}

module.exports = { verificarAcesso };

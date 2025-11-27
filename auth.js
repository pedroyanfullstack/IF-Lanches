const crypto = require("crypto");
const sessoes = {};


function criarSessao(usuario) {
    const token = crypto.randomUUID();

    sessoes[token] = {
        id: usuario.id,
        nome: usuario.nome,
        tipo: usuario.tipo 
    };


    console.log("----------------------");
    console.log("----------------------");
    console.log(`Token: ${token}`);
    console.log(`usuario: ${usuario.nome}`);
    console.log(`tipo: ${usuario.tipo}`);
    console.log("----------------------");
    console.log("----------------------");

    return token;
}


function obterUsuarioPorToken(token) {
    const usuario = sessoes[token] || null;
    return usuario;
}


function sair(token) {
    delete sessoes[token];
}


function gerarCookieLogin(token) {
    return `sessao=${token}; HttpOnly; SameSite=Lax`;
}


function gerarCookieLogout() {
    return `sessao=; Max-Age=0; HttpOnly; SameSite=Lax`;
}

module.exports = {
    criarSessao,
    obterUsuarioPorToken,
    sair,
    gerarCookieLogin,
    gerarCookieLogout
};

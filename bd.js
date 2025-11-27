const mysql = require("mysql2");

const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "if_lanches"
}).promise();

module.exports = conexao;

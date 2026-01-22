/**
 * @fileoverview Configuração da conexão com o banco de dados MySQL usando Sequelize.
 * Define credenciais, opções de conexão e testa a conectividade.
 */

import Sequelize from "sequelize";

/**
 * Credenciais e configurações do banco de dados.
 * NOTA: Em produção, estas credenciais devem ser armazenadas em variáveis de ambiente.
 */
const DB_NAME = "empregai";      // Nome do banco de dados
const USER_NAME = "root";         // Usuário do MySQL
const PASSWORD = "";              // Senha do MySQL (vazia em desenvolvimento local)
const HOST = "localhost";         // Host do servidor MySQL

/**
 * Instância do Sequelize configurada para MySQL.
 * 
 * @type {Sequelize}
 * 
 * @description
 * Opções de configuração:
 * - dialect: Define o tipo de banco (MySQL)
 * - timezone: Ajusta para o fuso horário de Brasília (UTC-3)
 * - freezeTableName: Mantém o nome das tabelas como definido (não pluraliza)
 * - underscored: Usa snake_case para nomes de colunas gerados automaticamente
 */
const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  timezone: "-03:00",              // Fuso horário de Brasília
  define: {
    freezeTableName: true,         // Não pluraliza nomes de tabelas
    underscored: true,             // Usa snake_case (ex: user_id ao invés de userId)
  },
});

/**
 * Testa a conexão com o banco de dados.
 * Exibe mensagem de sucesso ou falha no console.
 */
sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((error) => {
    console.log("Falha na conexão: " + error);
  });

/**
 * Exporta a classe Sequelize e a instância configurada.
 * - Sequelize: Classe para definir tipos de dados nos models
 * - sequelize: Instância conectada para executar queries
 */
export default { Sequelize, sequelize };

import banco from "../config/banco.js";

/**
 * @fileoverview Modelo Sequelize para a entidade Usuario.
 * Representa os usuários base da plataforma (candidatos ou empresas).
 */

/**
 * Modelo de dados para Usuario.
 * Armazena informações básicas de autenticação e perfil dos usuários.
 * 
 * @typedef {Object} Usuario
 * @property {number} id - Identificador único do usuário (chave primária, auto-incremento)
 * @property {string} nome - Nome completo do usuário (obrigatório, máximo 100 caracteres)
 * @property {string} email - Email do usuário (obrigatório, único, máximo 150 caracteres)
 * @property {string} senha - Senha criptografada do usuário (obrigatório, máximo 250 caracteres)
 * @property {('candidato'|'empresa')} tipo - Tipo de usuário: 'candidato' ou 'empresa' (obrigatório)
 * @property {Date} createdAt - Data de criação do registro (gerado automaticamente)
 * @property {Date} updatedAt - Data da última atualização (gerado automaticamente)
 */
const Usuario = banco.sequelize.define("usuarios", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: banco.Sequelize.STRING(100),
    allowNull: false, // Campo obrigatório
  },
  email: {
    type: banco.Sequelize.STRING(150),
    allowNull: false, // Campo obrigatório
    unique: true, // Garante que não existam emails duplicados no sistema
  },
  senha: {
    type: banco.Sequelize.STRING(250),
    allowNull: false, // Campo obrigatório - deve ser armazenada criptografada (bcrypt)
  },
  tipo: {
    type: banco.Sequelize.ENUM("candidato", "empresa"),
    allowNull: false, // Campo obrigatório - define o perfil do usuário
  },
});

// Sincronização desabilitada - usar gerarBanco.js para criar tabelas
//Usuario.sync();
export default Usuario;

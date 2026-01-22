import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

/**
 * @fileoverview Modelo Sequelize para a entidade Empresa.
 * Representa uma empresa que publica vagas de emprego na plataforma.
 */

/**
 * Modelo de dados para Empresa.
 * Armazena informações corporativas de empresas recrutadoras.
 * 
 * @typedef {Object} Empresa
 * @property {number} id - Identificador único da empresa (chave primária, auto-incremento)
 * @property {string} nome_fantasia - Nome fantasia da empresa (máximo 150 caracteres)
 * @property {string} cnpj - CNPJ da empresa (obrigatório, máximo 20 caracteres)
 * @property {string} setor - Setor de atuação da empresa (máximo 100 caracteres)
 * @property {string} localizacao - Localização da sede da empresa (máximo 100 caracteres)
 * @property {number} usuario_id - Chave estrangeira referenciando o usuário associado
 * @property {Date} createdAt - Data de criação do registro (gerado automaticamente)
 * @property {Date} updatedAt - Data da última atualização (gerado automaticamente)
 */
const Empresa = banco.sequelize.define("empresas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_fantasia: banco.Sequelize.STRING(150),
  cnpj: {
    type: banco.Sequelize.STRING(20),
    allowNull: false, // Campo obrigatório
    validate: {
      notEmpty: true, // Validação: não permite string vazia
    }
  },
  setor: banco.Sequelize.STRING(100),
  localizacao: banco.Sequelize.STRING(100),
});

/**
 * Relacionamento: Empresa pertence a um Usuário (1:1)
 * - Chave estrangeira: usuario_id
 * - Deleção em cascata: se o usuário for deletado, a empresa também será
 * - Alias: 'usuario' para facilitar queries com include
 */
Empresa.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'usuario',
})

// Sincronização desabilitada - usar gerarBanco.js para criar tabelas
//Empresa.sync();
export default Empresa;

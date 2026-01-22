import banco from "../config/banco.js";
import Empresa from "./Empresa.js";

/**
 * @fileoverview Modelo Sequelize para a entidade Vaga.
 * Representa as vagas de emprego publicadas pelas empresas.
 */

/**
 * Modelo de dados para Vaga.
 * Armazena informações sobre vagas de emprego disponíveis na plataforma.
 * 
 * @typedef {Object} Vaga
 * @property {number} id - Identificador único da vaga (chave primária, auto-incremento)
 * @property {string} titulo - Título da vaga (máximo 150 caracteres)
 * @property {string} descricao - Descrição detalhada da vaga (texto longo)
 * @property {string} requisitos - Requisitos da vaga separados por vírgula (texto longo)
 * @property {string} tipo_contrato - Tipo de contrato (CLT, PJ, Estágio, etc., máximo 50 caracteres)
 * @property {('remoto'|'presencial'|'híbrido')} modalidade - Modalidade de trabalho
 * @property {string} localizacao - Localização da vaga (máximo 100 caracteres)
 * @property {number} empresa_id - Chave estrangeira referenciando a empresa que publicou a vaga
 * @property {Date} createdAt - Data de criação da vaga (gerado automaticamente)
 * @property {Date} updatedAt - Data da última atualização (gerado automaticamente)
 */
const Vaga = banco.sequelize.define("vagas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: banco.Sequelize.STRING(150),
  descricao: banco.Sequelize.TEXT,
  requisitos: banco.Sequelize.TEXT,
  tipo_contrato: banco.Sequelize.STRING(50),
  modalidade: banco.Sequelize.ENUM("remoto", "presencial", "híbrido"),
  localizacao: banco.Sequelize.STRING(100),
});

/**
 * Relacionamento: Vaga pertence a uma Empresa (N:1)
 * - Chave estrangeira: empresa_id
 * - Deleção em cascata: se a empresa for deletada, suas vagas também serão
 * - Alias: 'empresa' para facilitar queries com include
 */
Vaga.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'empresa',
})

// Sincronização ativa para este modelo
 Vaga.sync();
export default Vaga;

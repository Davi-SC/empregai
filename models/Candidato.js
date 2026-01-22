import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

/**
 * @fileoverview Modelo Sequelize para a entidade Candidato.
 * Representa um candidato procurando vagas de emprego na plataforma.
 */

/**
 * Modelo de dados para Candidato.
 * Armazena informações profissionais de candidatos a vagas.
 * 
 * @typedef {Object} Candidato
 * @property {number} id - Identificador único do candidato (chave primária, auto-incremento)
 * @property {string} area_atuacao - Área de atuação profissional do candidato (máximo 100 caracteres)
 * @property {string} experiencia - Descrição detalhada da experiência profissional (texto longo)
 * @property {string} habilidades - Lista de habilidades separadas por vírgula (texto longo)
 * @property {string} localizacao - Localização geográfica do candidato (máximo 100 caracteres)
 * @property {number} usuario_id - Chave estrangeira referenciando o usuário associado
 * @property {Date} createdAt - Data de criação do registro (gerado automaticamente)
 * @property {Date} updatedAt - Data da última atualização (gerado automaticamente)
 */
const Candidato = banco.sequelize.define("candidatos", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  area_atuacao: banco.Sequelize.STRING(100),
  experiencia: banco.Sequelize.TEXT,
  habilidades: banco.Sequelize.TEXT,
  localizacao: banco.Sequelize.STRING(100),
});

/**
 * Relacionamento: Candidato pertence a um Usuário (1:1)
 * - Chave estrangeira: usuario_id
 * - Deleção em cascata: se o usuário for deletado, o candidato também será
 * - Alias: 'usuario' para facilitar queries com include
 */
Candidato.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'usuario',
})

// Sincronização desabilitada - usar gerarBanco.js para criar tabelas
//Candidato.sync();
export default Candidato;

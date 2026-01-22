import banco from "../config/banco.js";
import Candidato from "./Candidato.js";
import Vaga from "./Vaga.js";

/**
 * @fileoverview Modelo Sequelize para a entidade Candidatura.
 * Representa a candidatura de um candidato a uma vaga (tabela de junção).
 */

/**
 * Modelo de dados para Candidatura.
 * Tabela de relacionamento muitos-para-muitos entre Candidatos e Vagas.
 * 
 * @typedef {Object} Candidatura
 * @property {number} id - Identificador único da candidatura (chave primária, auto-incremento)
 * @property {number} candidato_id - Chave estrangeira referenciando o candidato
 * @property {number} vaga_id - Chave estrangeira referenciando a vaga
 * @property {Date} data_candidatura - Data em que a candidatura foi realizada (padrão: data/hora atual)
 * @property {Date} createdAt - Data de criação do registro (gerado automaticamente)
 * @property {Date} updatedAt - Data da última atualização (gerado automaticamente)
 */
const Candidatura = banco.sequelize.define("candidaturas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  data_candidatura: {
    type: banco.Sequelize.DATE,
    defaultValue: banco.Sequelize.NOW,
  },
});

/**
 * Relacionamento: Candidatura pertence a um Candidato (N:1)
 * - Chave estrangeira: candidato_id
 * - Deleção em cascata: se o candidato for deletado, suas candidaturas também serão
 * - Alias: 'candidato'
 */
Candidatura.belongsTo(Candidato, {
  foreignKey: 'candidato_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'candidato',
})

/**
 * Relacionamento: Candidatura pertence a uma Vaga (N:1)
 * - Chave estrangeira: vaga_id
 * - Deleção em cascata: se a vaga for deletada, suas candidaturas também serão
 * - Alias: 'vaga'
 */
Candidatura.belongsTo(Vaga, {
  foreignKey: 'vaga_id',
  constraint: 'true',
  onDelete: 'CASCADE',
  as: 'vaga',
})

// Sincronização desabilitada - usar gerarBanco.js para criar tabelas
//Candidatura.sync();
export default Candidatura;

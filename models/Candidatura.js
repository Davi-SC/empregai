import banco from "../config/banco.js";
import Candidato from "./Candidato.js";
import Vaga from "./Vaga.js";

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

Candidatura.belongsTo(Candidato, {
  foreignKey: 'candidato_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'candidato',
})

Candidatura.belongsTo(Vaga, {
  foreignKey: 'vaga_id',
  constraint: 'true',
  onDelete: 'CASCADE',
  as: 'vaga',
})

// Candidatura.sync();
export default Candidatura;

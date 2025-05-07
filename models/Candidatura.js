import banco from "../config/banco.js";

const Candidatura = banco.sequelize.define("candidaturas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidatoId: {
    type: banco.Sequelize.INTEGER,
    allowNull: false,
  },
  vagaId: {
    type: banco.Sequelize.INTEGER,
    allowNull: false,
  },
  dataCandidatura: {
    type: banco.Sequelize.DATE,
    defaultValue: banco.Sequelize.NOW,
  },
});

Candidatura.sync();
export default Candidatura;

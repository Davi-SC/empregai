import banco from "../config/banco.js";

const Candidato = banco.sequelize.define("candidatos", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: banco.Sequelize.INTEGER,
    allowNull: false,
    unique: true,
  },
  areaAtuacao: banco.Sequelize.STRING(100),
  experiencia: banco.Sequelize.TEXT,
  habilidades: banco.Sequelize.TEXT,
  localizacao: banco.Sequelize.STRING(100),
});

Candidato.sync();
export default Candidato;

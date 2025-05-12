import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

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

Candidato.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'usuario',
})

// Candidato.sync();
export default Candidato;

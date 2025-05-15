import banco from "../config/banco.js";
import Empresa from "./Empresa.js";

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

Vaga.belongsTo(Empresa, {
  foreignKey: 'empresa_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'empresa',
})

// Vaga.sync();
export default Vaga;

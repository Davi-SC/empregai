import banco from "../config/banco.js";
import Empresa from "./Empresa.js";

const Vaga = banco.sequelize.define("vagas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: banco.Sequelize.STRING(150),
    allowNull: false,
  },
  descricao: {
    type: banco.Sequelize.TEXT,
    allowNull: false,
  },
  requisitos: banco.Sequelize.TEXT,
  tipo_contrato: {
    type: banco.Sequelize.ENUM("CLT", "PJ", "Estágio", "Freelancer"),
    allowNull: false,
  },
  modalidade: banco.Sequelize.ENUM("remoto", "presencial", "híbrido"),
  localizacao: banco.Sequelize.STRING(100),
});

Vaga.belongsTo(Empresa, {
  foreignKey: "empresa_id",
  constraint: true,
  onDelete: "CASCADE",
  as: "empresa",
});

export default Vaga;

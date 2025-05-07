import banco from "../config/banco.js";

const Vaga = banco.sequelize.define("vagas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  empresaId: {
    type: banco.Sequelize.INTEGER,
    allowNull: false,
  },
  titulo: banco.Sequelize.STRING(150),
  descricao: banco.Sequelize.TEXT,
  requisitos: banco.Sequelize.TEXT,
  tipoContrato: banco.Sequelize.STRING(50),
  modalidade: banco.Sequelize.ENUM("remoto", "presencial", "híbrido"),
  localizacao: banco.Sequelize.STRING(100),
});

Vaga.sync();
export default Vaga;

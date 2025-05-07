import banco from "../config/banco.js";

const Empresa = banco.sequelize.define("empresas", {
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
  nomeFantasia: banco.Sequelize.STRING(150),
  cnpj: banco.Sequelize.STRING(20),
  setor: banco.Sequelize.STRING(100),
  localizacao: banco.Sequelize.STRING(100),
});

Empresa.sync();
export default Empresa;

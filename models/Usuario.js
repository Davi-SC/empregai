import banco from "../config/banco.js";

const Usuario = banco.sequelize.define("usuarios", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: banco.Sequelize.STRING(100),
    allowNull: false,
  },
  email: {
    type: banco.Sequelize.STRING(150),
    allowNull: false,
    unique: true,
  },
  senha: {
    type: banco.Sequelize.STRING(250),
    allowNull: false,
  },
  tipo: {
    type: banco.Sequelize.ENUM("candidato", "empresa"),
    allowNull: false,
  },
});

// Usuario.sync();
export default Usuario;

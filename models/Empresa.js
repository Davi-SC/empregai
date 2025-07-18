// models/Empresa.js
import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

const Empresa = banco.sequelize.define("empresas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_fantasia: {
    type: banco.Sequelize.STRING(100),
    allowNull: false,
  },
  localizacao: banco.Sequelize.STRING(100),
  setor: banco.Sequelize.STRING(100),
  usuario_id: {
    type: banco.Sequelize.INTEGER,
    allowNull: false,
  },
});

Empresa.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'usuario',
});

export default Empresa;

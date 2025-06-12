import banco from "../config/banco.js";
import Usuario from "./Usuario.js";

const Empresa = banco.sequelize.define("empresas", {
  id: {
    type: banco.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome_fantasia: banco.Sequelize.STRING(150),
  cnpj: {
    type: banco.Sequelize.STRING(20),
    allowNull: false, // Não permite nulo
    validate: {
      notEmpty: true, // Não permite string vazia
    }
  },
  setor: banco.Sequelize.STRING(100),
  localizacao: banco.Sequelize.STRING(100),
});

Empresa.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  constraint: true,
  onDelete: 'CASCADE',
  as: 'usuario',
})

//Empresa.sync();
export default Empresa;

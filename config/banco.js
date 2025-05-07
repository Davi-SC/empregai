import Sequelize from "sequelize";

const DB_NAME = "empregai";
const USER_NAME = "root";
const PASSWORD = "";
const HOST = "localhost";

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  timezone: "-03:00",
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((error) => {
    console.log("Falha na conexão: " + error);
  });

export default { Sequelize, sequelize };

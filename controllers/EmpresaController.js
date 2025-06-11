import Empresa from "../models/Empresa.js";
import Usuario from "../models/Usuario.js";
import Candidato from "../models/Candidato.js";
import banco from "../config/banco.js";
import { QueryTypes } from "sequelize";

class EmpresaController {
  criarPerfil = async (req, res) => {
    try {
      const dados = req.body;
      dados.usuarioId = req.user.id;
      const perfil = await Empresa.create(dados);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Erro ao criar perfil da empresa:", error);
      res.status(500).send("Erro ao criar perfil.");
    }
  };

  verTodas = async (req, res) => {
    const empresas = await Empresa.findAll();
    res.render("admin/empresas", { empresas });
  };

  verCandidatos = async (req, res) => {
    const candidatos = await banco.sequelize.query('SELECT u.nome, c.* FROM usuarios u JOIN candidatos c ON u.id = c.usuario_id', {
      type: QueryTypes.SELECT
    })

    res.render("empresa/feed", {candidatos: candidatos})
  }

  verPerfil = async (req, res) => {
    const empresa = await banco.sequelize.query('SELECT u.nome, e.* FROM usuarios u JOIN empresas e ON u.id = e.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    res.render("empresa/perfil", {empresa: empresa[0]})
  }

  editar = async (req, res) => {

    const empresa = await banco.sequelize.query('SELECT u.nome, e.* FROM usuarios u JOIN empresas e ON u.id = e.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    res.render("empresa/editar", {empresa: empresa[0]})
  };

  salvar = async (req, res) => {

    Usuario.update({
      nome: req.body.nome,
      email: req.body.email,
    }, {
      where:{
        id: req.user.id
      }
    }).then(async () => {
      
      await Empresa.update({
        nome_fantasia: req.body.nome_fantasia,
        cnpj: req.body.cnpj,
        setor: req.body.setor,
        localizacao: req.body.localizacao
      }, {
        where:{
          id: req.body.id
        }
      }).then(() => {
        req.flash('success_msg', 'Dados editados com sucesso!')
        res.redirect('/')
      })
    })
  }
}

export default new EmpresaController();
import { QueryTypes } from "sequelize";
import Candidato from "../models/Candidato.js";
import Usuario from "../models/Usuario.js";
import banco from "../config/banco.js"

class CandidatoController {
  criarPerfil = async (req, res) => {
    try {
      const dados = req.body;
      dados.usuarioId = req.user.id;
      const perfil = await Candidato.create(dados);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Erro ao criar perfil do candidato:", error);
      res.status(500).send("Erro ao criar perfil.");
    }
  };

  verTodos = async (req, res) => {
    const candidatos = await Candidato.findAll();
    res.render("empresa/feed-candidatos", { candidatos });
  };

  verPerfil = async (req, res) => {
    
    const candidato = await banco.sequelize.query('SELECT u.nome, c.* FROM usuarios u JOIN candidatos c ON u.id = c.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    res.render("candidato/perfil", {candidato: candidato[0]})
  }

  editar = async (req, res) => {

    const usuario = await Usuario.findByPk(req.user.id)

    const candidato = await Candidato.findOne({
      where:{
        usuario_id: req.user.id
      }
    })

    res.render("candidato/editar", {usuario: usuario, candidato: candidato})
  };

  salvar = async (req, res) => {

    Usuario.update({
      nome: req.body.nome,
      email: req.body.email,
    }, {
      where:{
        id: req.user.id
      }
    }).then(() => {
      Candidato.update({
        area_atuacao: req.body.area_atuacao,
        experiencia: req.body.experiencia,
        habilidades: req.body.habilidades,
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

export default new CandidatoController();

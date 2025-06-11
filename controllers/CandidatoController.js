import { QueryTypes } from "sequelize";
import Candidato from "../models/Candidato.js";
import Usuario from "../models/Usuario.js";
import Vaga from "../models/Vaga.js";
import Empresa from "../models/Empresa.js";
import banco from "../config/banco.js";

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

  verVagas = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = 10
      const offset = (page - 1) * limit

      const {count, rows: vagas} = await Vaga.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [{
          model: Empresa,
          as: 'empresa',
          attributes: ['nome_fantasia']
        }]
      })

      const totalPages = Math.ceil(count / limit)

      const pages = []
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          number: 1,
          isCurrent: i === page
        })
      }

      console.log(vagas.dataValues)

      res.render("candidato/feed", {
        vagas: vagas,
        currentPage: page,
        totalPages: totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        body_class: 'feed-page'
      })
    } catch (error) {
      console.error("Erro ao buscar vagas: ", error)
      res.status(500).send("Erro ao carregar feed de vagas")
    }
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

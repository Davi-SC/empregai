import { Op, QueryTypes } from "sequelize";
import Candidato from "../models/Candidato.js";
import Usuario from "../models/Usuario.js";
import Vaga from "../models/Vaga.js";
import Empresa from "../models/Empresa.js";

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
      const {busca, modalidade, tipo_contrato} = req.query

      const limit = 10
      const offset = (page - 1) * limit

      const where = {}
      if (busca) {
        where[Op.or] = [
          { titulo: { [Op.like]: `%${busca}%`}},
          { descricao: {[Op.like]: `%${busca}%`}}
        ]
      }

      if (modalidade) {
        where.modalidade = modalidade
      }

      if (tipo_contrato) {
        where.tipo_contrato = tipo_contrato
      }

      const {count, rows: vagas} = await Vaga.findAndCountAll({
        where: where,
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

      const queryParams = new URLSearchParams(req.query)
      queryParams.delete('page')
      const queryString = queryParams.toString()

      res.render("candidato/feed", {
        vagas: vagas,
        currentPage: page,
        totalPages: totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        filtros: {busca, modalidade, tipo_contrato},
        queryString: queryString,
        body_class: 'feed-page',
        header: 'header-home'
      })
    } catch (error) {
      console.error("Erro ao buscar vagas: ", error)
      res.status(500).send("Erro ao carregar feed de vagas")
    }
  };

  verPerfil = async (req, res) => {
    try {
      const perfilId = req.params.id

      const candidato = await Candidato.findOne({
        where:{
          id: perfilId,
        },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        }]
      })

      if (!candidato) {
        return res.status(404).render('error/404', {message: 'Perfil do candidato não encontrado.'})
      }

      let isOwner = false
      if (req.user && req.user.id === candidato.usuario.id) {
        isOwner = true
      }

      const habilidadesArray = candidato.habilidades ? candidato.habilidades.split(',').map(h => h.trim()) : []

      res.render('candidato/perfil', {
        candidato: candidato.get({plain: true}),
        habilidadesArray: habilidadesArray,
        isOwner: isOwner,
        body_class: 'perfil-candidato-page'
      })
    } catch (error) {
      console.error("Erro ao visualizar perfil do candidato:", error)
      res.status(500).send("Ocorreu um erro no servidor.")
    }
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

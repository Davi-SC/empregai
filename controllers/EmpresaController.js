import Empresa from "../models/Empresa.js";
import Usuario from "../models/Usuario.js";
import Candidato from "../models/Candidato.js";
import banco from "../config/banco.js";
import { Op, QueryTypes, where } from "sequelize";

class EmpresaController {
  criarPerfil = async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.cnpj || dados.cnpj.trim() === "") {
      req.flash("error_msg", "CNPJ é obrigatório.");
      return res.redirect("/usuario/cadastrar"); 
    }
    dados.usuarioId = req.user.id;
    await Empresa.create(dados);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Erro ao criar perfil da empresa:", error);
    res.status(500).render("erro", { header: "header-home", mensagem: "Erro ao criar perfil." });
  }
};

  verTodas = async (req, res) => {
    const empresas = await Empresa.findAll();
    res.render("admin/empresas", { empresas, header: "header-home" });
  };

  verCandidatos = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const {busca, localizacao} = req.query

      const limit = 9
      const offset = (page - 1) * limit

      const whereCandidato = {}
      if (busca) {
        whereCandidato[Op.or] = [
          {'$usuario.nome$': {[Op.like]: `%${busca}%`}},
          {area_atuacao: {[Op.like]: `%${busca}%`}},
          {habilidades: {[Op.like]: `%${busca}%`}}
        ]
      }

      if (localizacao) {
        whereCandidato.localizacao = {[Op.like]: `%${localizacao}%`}
      }

      const {count, rows: candidatos} = await Candidato.findAndCountAll({
        where: whereCandidato,
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['nome']
        }],
        subQuery: false
      })

      const candidatosComHabilidades = candidatos.map(candidato => {
        const plainCandidato = candidato.get({plain: true})
        return {
          ...plainCandidato,
          habilidadesArray: plainCandidato.habilidades ? plainCandidato.habilidades.split(',').map(h => h.trim()) : []
        }
      })
      
      const totalPages = Math.ceil(count / limit)

      const pages = []
      for (let i=1; i <= totalPages; i++) {
        pages.push({
          number: i,
          isCurrent: i === page
        })
      }

      const queryParams = new URLSearchParams(req.query)
      queryParams.delete('page')
      const queryString = queryParams.toString()

      res.render("empresa/feed", {
        candidatos: candidatosComHabilidades,
        pages: pages,
        currentPage: page,
        totalPages: totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page - 1,
        nextPage: page + 1,
        filtros: {busca, localizacao},
        queryString: queryString,
        body_class: 'candidatos-feed-page'
      })
    } catch (error) {
      console.error("Erro ao buscar candidatos: ", error)
      res.status(500).send("Ocorreu um erro no servidor.")
    }
  }

  verPerfil = async (req, res) => {
    const empresa = await banco.sequelize.query('SELECT u.nome, e.* FROM usuarios u JOIN empresas e ON u.id = e.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    console.log(empresa[0]);
    res.render("empresa/perfil", {
      header: "header-home",
      empresa: empresa[0]})
  }

  editar = async (req, res) => {

    const empresa = await banco.sequelize.query('SELECT u.nome, e.* FROM usuarios u JOIN empresas e ON u.id = e.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    res.render("empresa/editar", {
      header: "header-home",
      empresa: empresa[0]
    })
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
import Empresa from "../models/Empresa.js";
import Usuario from "../models/Usuario.js";
import Candidato from "../models/Candidato.js";
import banco from "../config/banco.js";
import { Op, QueryTypes, where } from "sequelize";

/**
 * Controller responsável por gerenciar as operações relacionadas às empresas.
 * Inclui funcionalidades de criação de perfil, visualização de candidatos,
 * edição de perfil e busca de candidatos com filtros e paginação.
 */
class EmpresaController {
  /**
   * Cria um novo perfil para uma empresa.
   * Valida o CNPJ obrigatório antes da criação.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Dados do perfil da empresa
   * @param {string} req.body.cnpj - CNPJ da empresa (obrigatório)
   * @param {Object} req.user - Usuário autenticado
   * @param {number} req.user.id - ID do usuário autenticado
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para o dashboard ou retorna erro 500
   */
  criarPerfil = async (req, res) => {
  try {
    const dados = req.body;
    // Validação: CNPJ é obrigatório
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

  /**
   * Lista todas as empresas cadastradas (funcionalidade administrativa).
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página com listagem de todas as empresas
   */
  verTodas = async (req, res) => {
    const empresas = await Empresa.findAll();
    res.render("admin/empresas", { empresas, header: "header-home" });
  };

  /**
   * Exibe o feed de candidatos disponíveis com suporte a paginação e filtros.
   * Permite busca por nome, área de atuação, habilidades e localização.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.query - Parâmetros de query string
   * @param {number} [req.query.page=1] - Número da página atual
   * @param {string} [req.query.busca] - Termo de busca (nome, área de atuação ou habilidades)
   * @param {string} [req.query.localizacao] - Filtro de localização do candidato
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza o feed de candidatos ou retorna erro 500
   */
  verCandidatos = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const {busca, localizacao} = req.query

      const limit = 9
      const offset = (page - 1) * limit

      // Construção dinâmica dos filtros de busca
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

      // Busca paginada com filtros aplicados
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

      // Transforma a string de habilidades em array para melhor exibição
      const candidatosComHabilidades = candidatos.map(candidato => {
        const plainCandidato = candidato.get({plain: true})
        return {
          ...plainCandidato,
          habilidadesArray: plainCandidato.habilidades ? plainCandidato.habilidades.split(',').map(h => h.trim()) : []
        }
      })
      
      const totalPages = Math.ceil(count / limit)

      // Gera array de páginas para navegação
      const pages = []
      for (let i=1; i <= totalPages; i++) {
        pages.push({
          number: i,
          isCurrent: i === page
        })
      }

      // Preserva parâmetros de query para navegação entre páginas
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

  /**
   * Exibe o perfil da empresa autenticada.
   * Utiliza query SQL direta para combinar dados de usuário e empresa.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.user - Usuário autenticado (empresa)
   * @param {number} req.user.id - ID do usuário/empresa autenticada
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página de perfil da empresa
   */
  verPerfil = async (req, res) => {
    // Query SQL para buscar dados combinados de usuário e empresa
    const empresa = await banco.sequelize.query('SELECT u.nome, e.* FROM usuarios u JOIN empresas e ON u.id = e.usuario_id WHERE u.id = ?', {
      replacements: [req.user.id],
      type: QueryTypes.SELECT
    })

    console.log(empresa[0]);
    res.render("empresa/perfil", {
      header: "header-home",
      empresa: empresa[0]})
  }

  /**
   * Renderiza a página de edição do perfil da empresa autenticada.
   * Utiliza query SQL direta para combinar dados de usuário e empresa.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.user - Usuário autenticado (empresa)
   * @param {number} req.user.id - ID do usuário/empresa autenticada
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página de edição do perfil
   */
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

  /**
   * Salva as alterações do perfil da empresa e dados do usuário.
   * Atualiza as tabelas de usuário e empresa em sequência.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Dados enviados no formulário
   * @param {string} req.body.nome - Nome do usuário
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.nome_fantasia - Nome fantasia da empresa
   * @param {string} req.body.cnpj - CNPJ da empresa
   * @param {string} req.body.setor - Setor de atuação da empresa
   * @param {string} req.body.localizacao - Localização da empresa
   * @param {number} req.body.id - ID do perfil da empresa
   * @param {Object} req.user - Usuário autenticado
   * @param {number} req.user.id - ID do usuário autenticado
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para a home com mensagem de sucesso
   */
  salvar = async (req, res) => {

    // Primeiro atualiza os dados do usuário
    Usuario.update({
      nome: req.body.nome,
      email: req.body.email,
    }, {
      where:{
        id: req.user.id
      }
    }).then(async () => {
      
      // Depois atualiza os dados específicos da empresa
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
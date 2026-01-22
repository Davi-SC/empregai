import Empresa from "../models/Empresa.js";
import Vaga from "../models/Vaga.js";

/**
 * Controller responsável por gerenciar as operações relacionadas às vagas de emprego.
 * Inclui funcionalidades de criação, visualização, edição e listagem de vagas.
 */
class VagaController {

  /**
   * Exibe os detalhes completos de uma vaga específica.
   * Inclui informações da empresa que publicou a vaga.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - ID da vaga a ser visualizada
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página de detalhes ou retorna erro 404/500
   */
  verDetalheVaga = async (req, res) => {
    try {
      const vagaId = req.params.id

      // Busca a vaga com os dados da empresa associada
      const vaga = await Vaga.findByPk(vagaId, {
        include: [{
          model: Empresa,
          as: 'empresa',
          attributes: ['id', 'nome_fantasia', 'localizacao', 'setor']
        }]
      })

      if (!vaga) {
        return res.status(404).render('error/404', {message: 'Vaga não encontrada!'})
      }

      // Transforma a string de requisitos em um array para melhor exibição
      const requisitosArray = vaga.requisitos ? vaga.requisitos.split(',').map(r => r.trim()) : []

      res.render('vaga/detalhe', {
        vaga: vaga,
        requisitosArray: requisitosArray,
        body_class: 'detalhe-vaga-page'
      })
    } catch (error) {
      console.error("Erro ao buscar detalhe da vaga: ", error)
      res.status(500).send("Ocorreu um erro no servidor")
    }
  }

  /**
   * Cria uma nova vaga de emprego para a empresa autenticada.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Dados da vaga a ser criada
   * @param {string} req.body.titulo - Título da vaga
   * @param {string} req.body.descricao - Descrição detalhada da vaga
   * @param {string} req.body.requisitos - Requisitos da vaga (separados por vírgula)
   * @param {string} req.body.modalidade - Modalidade de trabalho (presencial, remoto, híbrido)
   * @param {string} req.body.tipo_contrato - Tipo de contrato (CLT, PJ, estágio, etc.)
   * @param {Object} req.user - Usuário autenticado (empresa)
   * @param {number} req.user.id - ID da empresa autenticada
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para listagem de vagas da empresa ou retorna erro 500
   */
  criar = async (req, res) => {
    try {
      const dados = req.body;
      dados.empresaId = req.user.id;
      await Vaga.create(dados);
      res.redirect("/empresa/vagas");
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
      res.status(500).send("Erro ao criar vaga.");
    }
  };

  /**
   * Exibe o feed de todas as vagas disponíveis.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página com o feed de vagas
   */
  verFeed = async (req, res) => {
    const vagas = await Vaga.findAll();
    res.render("candidato/feed-vagas", { vagas });
  };

  /**
   * Edita uma vaga existente.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.id - ID da vaga a ser editada
   * @param {Object} req.body - Dados atualizados da vaga
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para listagem de vagas da empresa
   */
  editar = async (req, res) => {
    const { id } = req.params;
    await Vaga.update(req.body, { where: { id } });
    res.redirect("/empresa/vagas");
  };
}

export default new VagaController();

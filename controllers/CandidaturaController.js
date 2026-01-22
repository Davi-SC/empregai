import Candidatura from "../models/Candidatura.js";

/**
 * Controller responsável por gerenciar as candidaturas de candidatos às vagas.
 * Permite que candidatos se candidatem a vagas e visualizem suas candidaturas.
 */
class CandidaturaController {
  /**
   * Cria uma nova candidatura de um candidato a uma vaga específica.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.params - Parâmetros da rota
   * @param {string} req.params.vagaId - ID da vaga para candidatura
   * @param {Object} req.user - Usuário autenticado (candidato)
   * @param {number} req.user.id - ID do candidato autenticado
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para o feed de vagas ou retorna erro 500
   */
  candidatar = async (req, res) => {
    try {
      const vagaId = req.params.vagaId;
      await Candidatura.create({
        candidatoId: req.user.id,
        vagaId,
      });
      res.redirect("/candidato/vagas");
    } catch (error) {
      console.error("Erro ao se candidatar:", error);
      res.status(500).send("Erro ao se candidatar.");
    }
  };

  /**
   * Lista todas as candidaturas realizadas pelo candidato autenticado.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.user - Usuário autenticado (candidato)
   * @param {number} req.user.id - ID do candidato autenticado
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Renderiza a página com a lista de candidaturas
   */
  minhasCandidaturas = async (req, res) => {
    const candidaturas = await Candidatura.findAll({
      where: { candidatoId: req.user.id },
    });
    res.render("candidato/minhas-candidaturas", { candidaturas });
  };
}

export default new CandidaturaController();

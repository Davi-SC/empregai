import Candidatura from "../models/Candidatura.js";

class CandidaturaController {
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

  minhasCandidaturas = async (req, res) => {
    const candidaturas = await Candidatura.findAll({
      where: { candidatoId: req.user.id },
    });
    res.render("candidato/minhas-candidaturas", { candidaturas });
  };
}

export default new CandidaturaController();

import Candidato from "../models/Candidato.js";

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

  editar = async (req, res) => {
    const { id } = req.params;
    await Candidato.update(req.body, { where: { id } });
    res.redirect("/dashboard");
  };
}

export default new CandidatoController();

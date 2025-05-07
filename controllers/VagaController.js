import Vaga from "../models/Vaga.js";

class VagaController {
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

  verFeed = async (req, res) => {
    const vagas = await Vaga.findAll();
    res.render("candidato/feed-vagas", { vagas });
  };

  editar = async (req, res) => {
    const { id } = req.params;
    await Vaga.update(req.body, { where: { id } });
    res.redirect("/empresa/vagas");
  };
}

export default new VagaController();

import Empresa from "../models/Empresa.js";
import Vaga from "../models/Vaga.js";

class VagaController {

  verDetalheVaga = async (req, res) => {
    try {
      const vagaId = req.params.id

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

      // transforma a string de requisitos em um array
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

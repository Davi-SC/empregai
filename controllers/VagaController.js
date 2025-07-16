import Empresa from "../models/Empresa.js";
import Vaga from "../models/Vaga.js";
import Candidatura from "../models/Candidatura.js"; // Importe o model de candidatura

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

  candidatar = async (req, res) => {
    try {
      const vagaId = req.params.id;
      const candidatoId = req.user.id; // Supondo que o id do candidato está na sessão

      // Verifica se já existe candidatura para essa vaga e candidato
      const candidaturaExistente = await Candidatura.findOne({
        where: { vaga_id: vagaId, candidato_id: candidatoId }
      });

      if (candidaturaExistente) {
        req.flash("error_msg", "Você já se candidatou para esta vaga.");
        return res.redirect(`/vaga/${vagaId}`);
      }

      // Insere nova candidatura
      await Candidatura.create({
        vaga_id: vagaId,
        candidato_id: candidatoId
      });

      req.flash("success_msg", "Candidatura realizada com sucesso!");
      res.redirect(`/vaga/${vagaId}`);
    } catch (error) {
      console.error("Erro ao processar candidatura:", error);
      req.flash("error_msg", "Ocorreu um erro ao processar sua candidatura.");
      res.redirect(`/vaga/${vagaId}`);
    }
  }
}

export default new VagaController();

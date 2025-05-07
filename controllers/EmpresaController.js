import Empresa from "../models/Empresa.js";

class EmpresaController {
  criarPerfil = async (req, res) => {
    try {
      const dados = req.body;
      dados.usuarioId = req.user.id;
      const perfil = await Empresa.create(dados);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Erro ao criar perfil da empresa:", error);
      res.status(500).send("Erro ao criar perfil.");
    }
  };

  verTodas = async (req, res) => {
    const empresas = await Empresa.findAll();
    res.render("admin/empresas", { empresas });
  };

  editar = async (req, res) => {
    const { id } = req.params;
    await Empresa.update(req.body, { where: { id } });
    res.redirect("/dashboard");
  };
}

export default new EmpresaController();

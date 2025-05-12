import Empresa from "../models/Empresa.js";
import Usuario from "../models/Usuario.js";

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

    const usuario = await Usuario.findByPk(req.user.id)

    const empresa = await Empresa.findOne({
      where:{
        usuario_id: req.user.id
      }
    })

    res.render("empresa/editar", {usuario: usuario, empresa: empresa})
  };

  salvar = async (req, res) => {

    Usuario.update({
      nome: req.body.nome,
      email: req.body.email,
    }, {
      where:{
        id: req.user.id
      }
    }).then(() => {
      Empresa.update({
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

import bcrypt from "bcryptjs/dist/bcrypt.js";
import Usuario from "../models/Usuario.js";
import Candidato from "../models/Candidato.js";
import Empresa from "../models/Empresa.js";
import passport from "passport";

class UsuarioController {
  login = (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/usuario/login",
      failureFlash: true,
    })(req, res, next);
  };

  logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send("Erro ao fazer logout.");
      res.redirect("/usuario/login");
    });
  };

  cadastrar = async (req, res) => {
    try {
      const usuarioExistente = await Usuario.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (usuarioExistente) {
        req.flash("error_msg", "Este email já foi cadastrado!");
        return res.redirect("/usuario/cadastrar");
      }

      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(req.body.senha, salt);

      const usuario = await Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
        tipo: req.body.tipo,
      });

      if (usuario.tipo === "candidato") {
        await Candidato.create({
          usuarioId: usuario.id,
          areaAtuacao: req.body.areaAtuacao || null,
          experiencia: req.body.experiencia || null,
          habilidades: req.body.habilidades || null,
          localizacao: req.body.localizacao || null,
        });
      } else if (usuario.tipo === "empresa") {
        await Empresa.create({
          usuarioId: usuario.id,
          nomeFantasia: req.body.nomeFantasia || null,
          cnpj: req.body.cnpj || null,
          setor: req.body.setor || null,
          localizacao: req.body.localizacaoEmpresa || null,
        });
      }

      req.flash("success_msg", "Cadastrado realizado com sucesso!");
      res.redirect("/usuario/login");
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      res.status(500).send("Erro ao cadastrar.");
    }
  };
}

export default new UsuarioController();

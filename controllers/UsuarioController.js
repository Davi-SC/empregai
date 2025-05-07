import Usuario from "../models/Usuario.js";
import passport from "passport";

class UsuarioController {
  login = (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
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

  registrar = async (req, res) => {
    try {
      const { nome, email, senha, tipo } = req.body;
      const novoUsuario = await Usuario.create({ nome, email, senha, tipo });
      res.redirect("/usuario/login");
    } catch (erro) {
      console.error("Erro ao registrar:", erro);
      res.status(500).send("Erro ao registrar.");
    }
  };
}

export default new UsuarioController();

import bcrypt from "bcryptjs/dist/bcrypt.js";
import Usuario from "../models/Usuario.js";
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
      
      const usuario = await Usuario.findOne({
        where:{
          email: req.body.email
        }
      })

      if(usuario) {
        req.flash('error_msg', 'Este email já foi cadastrado!')
        return res.redirect('/usuario/cadastrar')
      }

      const salt = await bcrypt.genSalt(10)
      const hashSenha = await bcrypt.hash(req.body.senha, salt)

      let novoUsuario = {
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
        tipo: req.body.tipo
      }

      await Usuario.create(novoUsuario).then(() => {
        req.flash('success_msg', 'Cadastrado realizado com sucesso!')
        res.redirect('/usuario/login')
      });
    } catch (erro) {
      console.error("Erro ao cadastrar:", erro);
      res.status(500).send("Erro ao cadastrar.");
    }
  };
}

export default new UsuarioController();

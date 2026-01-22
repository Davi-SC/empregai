import bcrypt from "bcryptjs/dist/bcrypt.js";
import Usuario from "../models/Usuario.js";
import Candidato from "../models/Candidato.js";
import Empresa from "../models/Empresa.js";
import passport from "passport";

/**
 * Controller responsável por gerenciar operações de autenticação e cadastro de usuários.
 * Gerencia login, logout e cadastro tanto de candidatos quanto de empresas.
 */
class UsuarioController {
  /**
   * Realiza o login de um usuário utilizando a estratégia local do Passport.
   * Redireciona para páginas diferentes dependendo do tipo de usuário (candidato ou empresa).
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Dados do formulário de login
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.senha - Senha do usuário
   * @param {Object} res - Objeto de resposta do Express
   * @param {Function} next - Função next do middleware Express
   * @returns {void} Redireciona para feed apropriado ou página de login com erro
   */
  login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        req.flash("error_msg", info.message || "Usuário ou senha inválidos.");
        return res.redirect("/usuario/login");
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        // Redireciona candidatos para o feed de vagas
        if (user.tipo === 'candidato') {
          return res.redirect('/candidato/feed');
        }
        
        // Redireciona empresas para o feed de candidatos
        if (user.tipo === 'empresa') {
          return res.redirect('/empresa/feed'); 
        }

        return res.redirect('/');
      });
    })(req, res, next);
  };

  /**
   * Realiza o logout do usuário autenticado.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} res - Objeto de resposta do Express
   * @returns {void} Redireciona para a página de login ou retorna erro 500
   */
  logout = (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send("Erro ao fazer logout.");
      res.redirect("/usuario/login");
    });
  };

  /**
   * Cadastra um novo usuário no sistema (candidato ou empresa).
   * Criptografa a senha usando bcrypt e cria automaticamente o perfil associado.
   * 
   * @param {Object} req - Objeto de requisição do Express
   * @param {Object} req.body - Dados do formulário de cadastro
   * @param {string} req.body.nome - Nome do usuário
   * @param {string} req.body.email - Email do usuário
   * @param {string} req.body.senha - Senha do usuário (será criptografada)
   * @param {string} req.body.tipo - Tipo de usuário ("candidato" ou "empresa")
   * @param {Object} res - Objeto de resposta do Express
   * @returns {Promise<void>} Redireciona para login com mensagem de sucesso ou erro
   */
  cadastrar = async (req, res) => {
    try {
      // Verifica se o email já está cadastrado
      const usuarioExistente = await Usuario.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (usuarioExistente) {
        req.flash("error_msg", "Este email já foi cadastrado!");
        return res.redirect("/usuario/cadastrar");
      }

      // Gera hash da senha usando bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashSenha = await bcrypt.hash(req.body.senha, salt);

      // Cria o usuário com senha criptografada
      const usuario = await Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: hashSenha,
        tipo: req.body.tipo,
      });

      // Cria automaticamente o perfil associado baseado no tipo de usuário
      if (usuario.tipo === "candidato") {
        await Candidato.create({
          usuario_id: usuario.id
        });
      } else if (usuario.tipo === "empresa") {
        await Empresa.create({
          usuario_id: usuario.id
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

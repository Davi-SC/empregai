/**
 * @fileoverview Configuração da autenticação com Passport.js.
 * Define a estratégia de autenticação local usando email e senha.
 */

import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

/**
 * Configura o Passport.js para autenticação de usuários.
 * Utiliza a estratégia local (email/senha) com bcrypt para validação.
 * 
 * @param {Object} passport - Instância do Passport.js
 * 
 * @description
 * Esta função configura três componentes principais:
 * 1. LocalStrategy: Define como validar as credenciais (email e senha)
 * 2. serializeUser: Define como serializar o usuário na sessão (salva apenas o ID)
 * 3. deserializeUser: Define como desserializar o usuário da sessão (busca completo por ID)
 */
export default function (passport) {
  /**
   * Estratégia de autenticação local.
   * Valida o email e senha do usuário contra o banco de dados.
   */
  passport.use(
    new LocalStrategy(
      { 
        usernameField: "email",    // Campo do formulário para o email
        passwordField: "senha"     // Campo do formulário para a senha
      },
      async function (email, senha, done) {
        try {
          // Busca o usuário pelo email fornecido
          const usuario = await Usuario.findOne({ where: { email: email } });

          if (!usuario) {
            return done(null, false, { message: "Usuário não encontrado." });
          }

          // Compara a senha fornecida com o hash armazenado no banco
          const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

          if (senhaCorreta) {
            return done(null, usuario); // Autenticação bem-sucedida
          } else {
            return done(null, false, { message: "Senha incorreta!" });
          }
        } catch (erro) {
          return done(erro);
        }
      }
    )
  );

  /**
   * Serializa o usuário para a sessão.
   * Armazena apenas o ID do usuário na sessão para economizar espaço.
   * 
   * @param {Object} usuario - Objeto do usuário autenticado
   * @param {Function} done - Callback do Passport
   */
  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  /**
   * Desserializa o usuário da sessão.
   * Busca os dados completos do usuário pelo ID armazenado na sessão.
   * 
   * @param {number} id - ID do usuário armazenado na sessão
   * @param {Function} done - Callback do Passport
   */
  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findByPk(id);
      done(null, usuario);
    } catch (erro) {
      done(erro, null);
    }
  });
}

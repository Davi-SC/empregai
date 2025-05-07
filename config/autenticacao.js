import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

export default function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "senha" },
      async function (email, senha, done) {
        try {
          const usuario = await Usuario.findOne({ where: { email: email } });

          if (!usuario) {
            return done(null, false, { message: "Usuário não encontrado." });
          }

          const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

          if (senhaCorreta) {
            return done(null, usuario);
          } else {
            return done(null, false, { message: "Senha incorreta!" });
          }
        } catch (erro) {
          return done(erro);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findByPk(id);
      done(null, usuario);
    } catch (erro) {
      done(erro, null);
    }
  });
}

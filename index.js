import express from "express";

const app = express();

import handlebars from "express-handlebars";
import Handlebars from "handlebars";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import auth from "./config/autenticacao.js";
auth(passport);

////////////////////////
// CONFIGURAÇÕES
////////////////////////
app.use(
  session({
    secret: "analiseedesenvolvimentodesistemas",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.usuario = req.user || null;
  next();
});

// CONFIGURAR TEMPLATE HANDLEBARS
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "principal",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    partialsDir: 'views/partials',
    helpers: {
      lt: function (a, b) {
        return a < b;
      },
      eq: function (a, b) {
        return a === b;
      }
    }
  })
);
app.set("view engine", "handlebars");

// CONFIGURAR BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ARQUIVOS ESTÁTICOS
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

////////////////////
// ROTAS
////////////////////
app.get("/", (req, res) => {
  res.render("home/home", {
    candidato: req.user?.tipo === "candidato",
    header: 'header-home'
  });
});

import usuario from "./routes/usuario.js";
app.use("/usuario", usuario);

import candidato from "./routes/candidato.js";
app.use("/candidato", candidato);

import empresa from "./routes/empresa.js";
app.use("/empresa", empresa);

import vaga from "./routes/vaga.js";
app.use("/vaga", vaga);

import candidatura from "./routes/candidatura.js";
app.use("/candidatura", candidatura);

////////////////////
// INICIAR SERVIDOR
////////////////////
app.listen(3200, () =>
  console.log("Servidor rodando em http://localhost:3200")
);

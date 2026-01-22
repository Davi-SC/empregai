/**
 * @fileoverview Arquivo principal da aplicação Empregai.
 * Configura e inicializa o servidor Express com todas as dependências,
 * middlewares, rotas e configurações necessárias.
 * 
 * @description
 * Este é o ponto de entrada da aplicação. Ele:
 * - Configura o Express e middlewares (sessão, autenticação, flash messages)
 * - Define o motor de template Handlebars
 * - Registra todas as rotas da aplicação
 * - Inicializa o servidor na porta 3200
 */

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
auth(passport); // Inicializa a configuração do Passport

////////////////////////
// CONFIGURAÇÕES
////////////////////////

/**
 * Configuração de sessão do Express.
 * Armazena informações do usuário entre requisições HTTP.
 */
app.use(
  session({
    secret: "analiseedesenvolvimentodesistemas", // Chave secreta para assinar a sessão
    resave: true,                                // Força a sessão a ser salva mesmo sem mudanças
    saveUninitialized: false,                    // Não cria sessão até que algo seja armazenado
  })
);

/**
 * Inicialização do Passport.js para autenticação.
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Configuração do connect-flash para mensagens flash.
 * Permite exibir mensagens de sucesso/erro após redirecionamentos.
 */
app.use(flash());

/**
 * Middleware global para disponibilizar mensagens flash e usuário em todas as views.
 * Executado em cada requisição antes de renderizar as views.
 */
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg"); // Mensagens de sucesso
  res.locals.error_msg = req.flash("error_msg");     // Mensagens de erro
  res.locals.error = req.flash("error");             // Erros gerais
  res.locals.usuario = req.user || null;             // Dados do usuário autenticado
  next();
});

/**
 * Configuração do Handlebars como motor de template.
 * 
 * Configurações:
 * - defaultLayout: Layout padrão usado em todas as views (principal.handlebars)
 * - partialsDir: Diretório para templates parciais (componentes reutilizáveis)
 * - helpers: Funções auxiliares disponíveis nos templates
 *   - lt: Compara se a < b (less than)
 *   - eq: Compara se a === b (equals)
 */
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "principal",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    partialsDir: "views/partials",
    helpers: {
      // Helper para comparação "menor que" nos templates
      lt: function (a, b) {
        return a < b;
      },
      // Helper para comparação "igual a" nos templates
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set("view engine", "handlebars");

/**
 * Configuração do Body Parser para processar dados de formulários.
 * - extended: false usa querystring library (mais simples)
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Permite receber dados JSON

/**
 * Configuração de arquivos estáticos (CSS, JS, imagens).
 * Serve arquivos da pasta 'public'.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

////////////////////
// ROTAS
////////////////////

/**
 * Rota da página inicial (home).
 * GET /
 * Renderiza diferentes versões baseado no tipo de usuário.
 */
app.get("/", (req, res) => {
  res.render("home/home", {
    candidato: req.user?.tipo === "candidato", // Flag para personalizar view para candidato
    header: "header-home",
  });
});

/**
 * Rotas de usuário (login, logout, cadastro).
 * Prefixo: /usuario
 */
import usuario from "./routes/usuario.js";
app.use("/usuario", usuario);

/**
 * Rotas de candidato (perfil, feed de vagas).
 * Prefixo: /candidato
 */
import candidato from "./routes/candidato.js";
app.use("/candidato", candidato);

/**
 * Rotas de empresa (perfil, feed de candidatos, vagas).
 * Prefixo: /empresa
 */
import empresa from "./routes/empresa.js";
app.use("/empresa", empresa);

/**
 * Rotas de vagas (criar, editar, visualizar).
 * Prefixo: /vaga
 */
import vaga from "./routes/vaga.js";
app.use("/vaga", vaga);

/**
 * Rotas de candidatura (se candidatar, minhas candidaturas).
 * Prefixo: /candidatura
 */
import candidatura from "./routes/candidatura.js";
app.use("/candidatura", candidatura);

/**
 * Rota da página de dúvidas/FAQ.
 * GET /duvidas
 */
app.get("/duvidas", (req, res) => {
  res.render("home/duvidas", {
    header: "header-home",
  });
});

////////////////////
// INICIAR SERVIDOR
////////////////////

/**
 * Inicia o servidor Express na porta 3200.
 * Servidor estará disponível em http://localhost:3200
 */
app.listen(3200, () =>
  console.log("Servidor rodando em http://localhost:3200")
);

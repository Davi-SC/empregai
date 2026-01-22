/**
 * @fileoverview Middlewares de autorização e controle de acesso.
 * Define funções middleware para proteger rotas e controlar acesso baseado em tipo de usuário.
 */

/**
 * Middleware que verifica se o usuário está autenticado.
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar ao próximo middleware
 * 
 * @description
 * Permite acesso à rota se o usuário estiver autenticado (independente do tipo).
 * Caso contrário, exibe mensagem de erro e redireciona para login.
 */
function logado(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Usuário autenticado - permite acesso
  }
  req.flash("error_msg", "Você não está logado!");
  res.redirect("/usuario/login");
}

/**
 * Middleware que verifica se o usuário está autenticado E é do tipo "candidato".
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar ao próximo middleware
 * 
 * @description
 * Permite acesso à rota apenas se:
 * 1. O usuário estiver autenticado
 * 2. O tipo do usuário for "candidato"
 * 
 * Usado para proteger rotas exclusivas de candidatos (ex: feed de vagas, candidaturas).
 */
function apenasCandidato(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === "candidato") {
    return next(); // Usuário autenticado como candidato - permite acesso
  }
  req.flash("error_msg", "Apenas candidatos têm acesso a esta área.");
  res.redirect("/");
}

/**
 * Middleware que verifica se o usuário está autenticado E é do tipo "empresa".
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @param {Object} res - Objeto de resposta do Express
 * @param {Function} next - Função para passar ao próximo middleware
 * 
 * @description
 * Permite acesso à rota apenas se:
 * 1. O usuário estiver autenticado
 * 2. O tipo do usuário for "empresa"
 * 
 * Usado para proteger rotas exclusivas de empresas (ex: publicar vagas, ver candidatos).
 */
function apenasEmpresa(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === "empresa") {
    return next(); // Usuário autenticado como empresa - permite acesso
  }
  req.flash("error_msg", "Apenas empresas têm acesso a esta área.");
  res.redirect("/");
}

export { logado, apenasCandidato, apenasEmpresa };
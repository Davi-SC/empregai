function logado(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Você não está logado!");
  res.redirect("/usuario/login");
}

function apenasCandidato(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === "candidato") {
    return next();
  }
  req.flash("error_msg", "Apenas candidatos têm acesso a esta área.");
  res.redirect("/");
}

function apenasEmpresa(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === "empresa") {
    return next();
  }
  req.flash("error_msg", "Apenas empresas têm acesso a esta área.");
  res.redirect("/");
}

export { logado, apenasCandidato, apenasEmpresa };
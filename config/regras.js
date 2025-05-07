function logado(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Você não está logado!");
  res.redirect("/usuario/login");
}

function apenasCandidato(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === 1) {
    return next();
  }
  req.flash("error_msg", "Apenas candidatos têm acesso a esta área.");
  res.redirect("/usuario/login");
}

function apenasEmpresa(req, res, next) {
  if (req.isAuthenticated() && req.user.tipo === 2) {
    return next();
  }
  req.flash("error_msg", "Apenas empresas têm acesso a esta área.");
  res.redirect("/usuario/login");
}

export { logado, apenasCandidato, apenasEmpresa };

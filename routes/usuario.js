import express from "express";
const router = express.Router();
import UsuarioController from "../controllers/UsuarioController.js";
import { logado } from "../config/regras.js";

router.get("/login", (req, res) => res.render("usuario/login", {
    header: 'header-login-cadastro'
}));
router.post("/login", UsuarioController.login);
router.get("/logout", UsuarioController.logout);
    router.get("/cadastrar", (req, res) => res.render("usuario/cadastrar", {
        header: 'header-login-cadastro'
    }));
router.post("/cadastrar", UsuarioController.cadastrar);

export default router;

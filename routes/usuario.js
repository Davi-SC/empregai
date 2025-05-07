import express from "express";
const router = express.Router();
import UsuarioController from "../controllers/UsuarioController.js";
import { logado } from "../config/regras.js";

router.get("/login", (req, res) => res.render("usuario/login"));
router.post("/login", UsuarioController.login);
router.get("/logout", UsuarioController.logout);
router.post("/registrar", UsuarioController.registrar);

export default router;

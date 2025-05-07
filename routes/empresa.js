import express from "express";
const router = express.Router();
import EmpresaController from "../controllers/EmpresaController.js";
import { logado } from "../config/regras.js";

router.get("/lista", logado, EmpresaController.verTodas);
router.post("/criar", logado, EmpresaController.criarPerfil);
router.post("/editar/:id", logado, EmpresaController.editar);

export default router;

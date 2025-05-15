import express from "express";
const router = express.Router();
import EmpresaController from "../controllers/EmpresaController.js";
import { apenasEmpresa } from "../config/regras.js";

router.get("/lista", apenasEmpresa, EmpresaController.verTodas);
router.post("/criar", apenasEmpresa, EmpresaController.criarPerfil);
router.get("/perfil", apenasEmpresa, EmpresaController.verPerfil);
router.get("/editar", apenasEmpresa, EmpresaController.editar);
router.post("/editar", apenasEmpresa, EmpresaController.salvar);

export default router;

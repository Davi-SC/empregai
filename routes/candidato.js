import express from "express";
const router = express.Router();
import CandidatoController from "../controllers/CandidatoController.js";
import { logado } from "../config/regras.js";

router.get("/feed", logado, CandidatoController.verTodos);
router.post("/criar", logado, CandidatoController.criarPerfil);
router.get("/editar", logado, CandidatoController.editar);
router.post("/editar", logado, CandidatoController.salvar);

export default router;

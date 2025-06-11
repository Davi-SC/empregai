import express from "express";
const router = express.Router();
import CandidatoController from "../controllers/CandidatoController.js";
import { apenasCandidato } from "../config/regras.js";

router.get("/feed", apenasCandidato, CandidatoController.verTodos);
router.get('/perfil', apenasCandidato, CandidatoController.verPerfil);
router.post("/criar", apenasCandidato, CandidatoController.criarPerfil);
router.get("/editar", apenasCandidato, CandidatoController.editar);
router.post("/editar", apenasCandidato, CandidatoController.salvar);

export default router;

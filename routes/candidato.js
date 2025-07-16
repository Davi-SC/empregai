import express from "express";
const router = express.Router();
import CandidatoController from "../controllers/CandidatoController.js";
import { apenasCandidato, logado } from "../config/regras.js";

router.get("/feed", apenasCandidato, CandidatoController.verVagas);
router.get('/perfil/:id', logado, CandidatoController.verPerfil);
router.post("/criar", apenasCandidato, CandidatoController.criarPerfil);
router.get("/editar", apenasCandidato, CandidatoController.editar);
router.post("/editar", apenasCandidato, CandidatoController.salvar);
router.get("/candidaturas", logado, CandidatoController.minhasCandidaturas);

export default router;

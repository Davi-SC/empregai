import express from "express";
const router = express.Router();
import CandidatoController from "../controllers/CandidatoController.js";
import { logado } from "../config/regras.js";

router.get("/feed", logado, CandidatoController.verTodos);
router.post("/criar", logado, CandidatoController.criarPerfil);
router.post("/editar/:id", logado, CandidatoController.editar);

export default router;

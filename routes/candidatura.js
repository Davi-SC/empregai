/**
 * @fileoverview Rotas relacionadas às candidaturas.
 * Define endpoints para candidatos se candidatarem a vagas e
 * visualizarem suas candidaturas.
 */

import express from "express";
const router = express.Router();
import CandidaturaController from "../controllers/CandidaturaController.js";
import { logado } from "../config/regras.js";

/**
 * POST /candidatura/candidatar/:vagaId
 * Registra uma nova candidatura do usuário autenticado para a vaga especificada.
 * Requer autenticação.
 * @param {string} vagaId - ID da vaga para se candidatar
 */
router.post("/candidatar/:vagaId", logado, CandidaturaController.candidatar);

/**
 * GET /candidatura/minhas
 * Lista todas as candidaturas realizadas pelo candidato autenticado.
 * Requer autenticação.
 */
router.get("/minhas", logado, CandidaturaController.minhasCandidaturas);

export default router;

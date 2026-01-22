/**
 * @fileoverview Rotas relacionadas aos candidatos.
 * Define endpoints para operações de candidatos como visualizar vagas,
 * criar e editar perfil.
 */

import express from "express";
const router = express.Router();
import CandidatoController from "../controllers/CandidatoController.js";
import { apenasCandidato, logado } from "../config/regras.js";

/**
 * GET /candidato/feed
 * Exibe o feed de vagas disponíveis para o candidato com filtros e paginação.
 * Requer autenticação como candidato.
 */
router.get("/feed", apenasCandidato, CandidatoController.verVagas);

/**
 * GET /candidato/perfil/:id
 * Visualiza o perfil de um candidato específico.
 * Requer autenticação (qualquer tipo de usuário).
 * @param {string} id - ID do candidato
 */
router.get('/perfil/:id', logado, CandidatoController.verPerfil);

/**
 * POST /candidato/criar
 * Cria o perfil inicial de um candidato.
 * Requer autenticação como candidato.
 */
router.post("/criar", apenasCandidato, CandidatoController.criarPerfil);

/**
 * GET /candidato/editar
 * Renderiza a página de edição do perfil do candidato autenticado.
 * Requer autenticação como candidato.
 */
router.get("/editar", apenasCandidato, CandidatoController.editar);

/**
 * POST /candidato/editar
 * Salva as alterações do perfil do candidato.
 * Requer autenticação como candidato.
 */
router.post("/editar", apenasCandidato, CandidatoController.salvar);

export default router;

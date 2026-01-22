/**
 * @fileoverview Rotas relacionadas às vagas de emprego.
 * Define endpoints para operações com vagas como visualização,
 * criação e edição.
 */

import express from "express";
const router = express.Router();
import VagaController from "../controllers/VagaController.js";
import { logado } from "../config/regras.js";

/**
 * GET /vaga/:id
 * Exibe os detalhes completos de uma vaga específica.
 * Requer autenticação.
 * @param {string} id - ID da vaga
 */
router.get("/:id", logado, VagaController.verDetalheVaga)

/**
 * GET /vaga/feed
 * Exibe o feed de todas as vagas disponíveis.
 * Requer autenticação.
 */
router.get("/feed", logado, VagaController.verFeed);

/**
 * POST /vaga/criar
 * Cria uma nova vaga de emprego.
 * Requer autenticação (empresa).
 */
router.post("/criar", logado, VagaController.criar);

/**
 * POST /vaga/editar/:id
 * Edita uma vaga existente.
 * Requer autenticação.
 * @param {string} id - ID da vaga a ser editada
 */
router.post("/editar/:id", logado, VagaController.editar);

export default router;

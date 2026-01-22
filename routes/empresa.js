/**
 * @fileoverview Rotas relacionadas às empresas.
 * Define endpoints para operações de empresas como visualizar candidatos,
 * criar e editar perfil.
 */

import express from "express";
const router = express.Router();
import EmpresaController from "../controllers/EmpresaController.js";
import { apenasEmpresa } from "../config/regras.js";

/**
 * GET /empresa/lista
 * Lista todas as empresas cadastradas (funcionalidade administrativa).
 * Requer autenticação como empresa.
 */
router.get("/lista", apenasEmpresa, EmpresaController.verTodas);

/**
 * GET /empresa/feed
 * Exibe o feed de candidatos disponíveis com filtros e paginação.
 * Requer autenticação como empresa.
 */
router.get("/feed", apenasEmpresa, EmpresaController.verCandidatos)

/**
 * POST /empresa/criar
 * Cria o perfil inicial de uma empresa.
 * Requer autenticação como empresa.
 */
router.post("/criar", apenasEmpresa, EmpresaController.criarPerfil);

/**
 * GET /empresa/perfil
 * Visualiza o perfil da empresa autenticada.
 * Requer autenticação como empresa.
 */
router.get("/perfil", apenasEmpresa, EmpresaController.verPerfil);

/**
 * GET /empresa/editar
 * Renderiza a página de edição do perfil da empresa autenticada.
 * Requer autenticação como empresa.
 */
router.get("/editar", apenasEmpresa, EmpresaController.editar);

/**
 * POST /empresa/editar
 * Salva as alterações do perfil da empresa.
 * Requer autenticação como empresa.
 */
router.post("/editar", apenasEmpresa, EmpresaController.salvar);

export default router;

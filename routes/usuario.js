/**
 * @fileoverview Rotas relacionadas aos usuários e autenticação.
 * Define endpoints para login, logout e cadastro de usuários.
 */

import express from "express";
const router = express.Router();
import UsuarioController from "../controllers/UsuarioController.js";
import { logado } from "../config/regras.js";

/**
 * GET /usuario/login
 * Renderiza a página de login.
 * Adiciona classe CSS específica ao header para páginas de autenticação.
 */
router.get("/login", (req, res) => res.render("usuario/login", {
    header: 'header-login-cadastro'
}));

/**
 * POST /usuario/login
 * Processa o login do usuário utilizando Passport.js.
 * Redireciona para o feed apropriado baseado no tipo de usuário.
 */
router.post("/login", UsuarioController.login);

/**
 * GET /usuario/logout
 * Realiza o logout do usuário autenticado.
 * Limpa a sessão e redireciona para a página de login.
 */
router.get("/logout", UsuarioController.logout);

/**
 * GET /usuario/cadastrar
 * Renderiza a página de cadastro de novos usuários.
 * Adiciona classe CSS específica ao header para páginas de autenticação.
 */
    router.get("/cadastrar", (req, res) => res.render("usuario/cadastrar", {
        header: 'header-login-cadastro'
    }));

/**
 * POST /usuario/cadastrar
 * Processa o cadastro de um novo usuário (candidato ou empresa).
 * Criptografa a senha e cria o perfil associado automaticamente.
 */
router.post("/cadastrar", UsuarioController.cadastrar);

export default router;

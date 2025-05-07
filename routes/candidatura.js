import express from "express";
const router = express.Router();
import CandidaturaController from "../controllers/CandidaturaController.js";
import { logado } from "../config/regras.js";

router.post("/candidatar/:vagaId", logado, CandidaturaController.candidatar);
router.get("/minhas", logado, CandidaturaController.minhasCandidaturas);

export default router;

import express from "express";
const router = express.Router();
import VagaController from "../controllers/VagaController.js";
import { logado } from "../config/regras.js";

router.get("/criar", logado, (req, res) => {
  res.render("vaga/criar");
});

router.get("/feed", logado, VagaController.verFeed);
router.post("/criar", logado, VagaController.criar);
router.post("/editar/:id", logado, VagaController.editar);
router.get("/:id", logado, VagaController.verDetalheVaga);

export default router;
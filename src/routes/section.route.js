import express from "express";
import SectionController from "../controllers/section.controller.js";

const sectionRouter = express.Router();
const sectionController = new SectionController();

// Define routes for Section operations
sectionRouter.get('/', (req, res) => sectionController.getAllSections(req, res));
sectionRouter.get('/:id', (req, res) => sectionController.getSectionById(req, res));
sectionRouter.post('/', (req, res) => sectionController.createSection(req, res));
sectionRouter.put('/:id', (req, res) => sectionController.updateASection(req, res));
sectionRouter.delete('/:id', (req, res) => sectionController.deleteSection(req, res));

export default sectionRouter;
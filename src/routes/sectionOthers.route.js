import express from "express";
import SectionController from "../controllers/section.controller.js";

const sectionOthersRouter = express.Router();
const sectionController = new SectionController();

// Define routes for Section Others operations
sectionOthersRouter.get('/teacher', (req, res) => sectionController.getSectionByTeacherId(req, res));
sectionOthersRouter.get('/school', (req, res) => sectionController.getSectionBySchool(req, res));
sectionOthersRouter.post('/sections', (req, res) => sectionController.addMultipleSections(req, res));


export default sectionOthersRouter;
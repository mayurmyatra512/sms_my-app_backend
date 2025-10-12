import express from "express";
import SubjectController from "../controllers/subject.controller.js";

const subjectRouter = express.Router();
const subjectController = new SubjectController();

// Define routes for subject operations
subjectRouter.get('/', (req, res) => subjectController.getAllSubject(req, res));
subjectRouter.get('/:id', (req, res) => subjectController.getSubjectById(req, res));
subjectRouter.post('/', (req, res) => subjectController.createSubject(req, res));
subjectRouter.put('/:id', (req, res) => subjectController.updateASubject(req, res));
subjectRouter.delete('/:id', (req, res) => subjectController.deleteSubject(req, res));

export default subjectRouter;
import express from "express";
import SubjectController from "../controllers/subject.controller.js";

const subjectOthersRouter = express.Router();
const subjectOthersController = new SubjectController();

// Define routes for subject Other operations
subjectOthersRouter.get('/searchByName', (req, res) => subjectOthersController.searchSubjectsByName(req, res));
subjectOthersRouter.get('/searchByCode', (req, res) => subjectOthersController.searchSubjectsByCode(req, res));
subjectOthersRouter.get('/searchByClass', (req, res) => subjectOthersController.searchSubjectsByClass(req, res));
subjectOthersRouter.post('/subjects', (req, res) => subjectOthersController.addMultipleSubjects(req, res));


export default subjectOthersRouter;
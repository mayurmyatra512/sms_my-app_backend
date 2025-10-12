import express from "express";
import ExamResultController from "../controllers/examResult.controller.js";


const examResultRouter = express.Router();
const examResultController = new ExamResultController();

// Define routes for exam result operations
examResultRouter.get('/', (req, res) => examResultController.getAllExamResults(req, res));
examResultRouter.get('/:id', (req, res) => examResultController.getExamResultById(req, res));
examResultRouter.post('/', (req, res) => examResultController.createExamResult(req, res));
examResultRouter.put('/:id', (req, res) => examResultController.updateExamResult(req, res));
examResultRouter.delete('/:id', (req, res) => examResultController.deleteExamResult(req, res));

export default examResultRouter;

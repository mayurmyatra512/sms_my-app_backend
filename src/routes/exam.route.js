import express from "express";
import ExamController from "../controllers/exam.controller.js";

const examRouter = express.Router();
const examController = new ExamController();

// Define routes for exam operations
examRouter.get('/', (req, res) => examController.getAllExams(req, res));
examRouter.get('/:id', (req, res) => examController.getExamById(req, res));
examRouter.post('/', (req, res) => examController.createExam(req, res));
examRouter.put('/:id', (req, res) => examController.updateExam(req, res));
examRouter.delete('/:id', (req, res) => examController.deleteExam(req, res));

export default examRouter;

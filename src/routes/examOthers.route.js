import express from "express";
import ExamController from "../controllers/exam.controller.js";

const examOthersRouter = express.Router();
const examController = new ExamController();

// Define routes for exam operations
examOthersRouter.get('/teacher/:teacherId', (req, res) => examController.getExamsByTeacherId(req, res));
examOthersRouter.get('/student/:studentId', (req, res) => examController.getExamsByStudentId(req, res));
examOthersRouter.get('/subject/:subjectId', (req, res) => examController.getExamsBySubjectId(req, res));
examOthersRouter.get('/date/:date', (req, res) => examController.getExamsByDate(req, res));


export default examOthersRouter;



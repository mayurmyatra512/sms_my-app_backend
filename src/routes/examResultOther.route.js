import express from "express";
import ExamResultController from "../controllers/examResult.controller.js";


const examResultOtherRouter = express.Router();
const examResultController = new ExamResultController();

// Define routes for exam result operations
examResultOtherRouter.get('/student/:studentId', (req, res) => examResultController.getExamResultsByStudentId(req, res));
examResultOtherRouter.get('/subject/:subjectId', (req, res) => examResultController.getExamResultsBySubjectId(req, res));
examResultOtherRouter.get('/date/:date', (req, res) => examResultController.getExamResultsByDate(req, res));
examResultOtherRouter.post("/results", (req, res) => examResultController.addMultipleStudentsExamResults(req, res));

export default examResultOtherRouter;
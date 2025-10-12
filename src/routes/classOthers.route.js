import express from "express";
import ClassController from "../controllers/class.controller.js";


const classOtherRouter = express.Router();
const classController = new ClassController();

// Define routes for class operations
classOtherRouter.get('/teacher/:teacherId', (req, res) => classController.getClassesByTeacherId(req, res));
classOtherRouter.get('/student/:studentId', (req, res) => classController.getClassesByStudentId(req, res));
classOtherRouter.get('/subject/:subjectId', (req, res) => classController.getClassesBySubjectId(req, res));
classOtherRouter.get('/date/:date', (req, res) => classController.getClassesByDate(req, res));
classOtherRouter.post('/classes/', (req, res) => classController.addMultipleClasses(req, res));

export default classOtherRouter;

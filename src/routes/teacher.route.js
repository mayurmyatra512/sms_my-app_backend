import express from "express";
import TeacherController from "../controllers/teacher.controller.js";

const teacherRouter = express.Router();
const teacherController = new TeacherController();

// Define routes for subject operations
teacherRouter.get('/', (req, res) => teacherController.getAllTeachers(req, res));
teacherRouter.get('/:id', (req, res) => teacherController.getTeacherById(req, res));
teacherRouter.post('/', (req, res) => teacherController.createTeacher(req, res));
teacherRouter.put('/:id', (req, res) => teacherController.updateATeacher(req, res));
teacherRouter.delete('/:id', (req, res) => teacherController.deleteTeacher(req, res));


export default teacherRouter;
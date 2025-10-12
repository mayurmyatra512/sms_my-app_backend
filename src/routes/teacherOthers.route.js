import express from "express";
import TeacherController from "../controllers/teacher.controller.js";

const teacherOthersRouter = express.Router();
const teacherController = new TeacherController();

//Define routes for teacher operations
teacherOthersRouter.get('/searchByName', (req, res) => teacherController.getTeacherByName(req, res));
teacherOthersRouter.get('/searchByEmpCode', (req, res) => teacherController.getTeacherByEmpCode(req, res));
teacherOthersRouter.get('/searchBySchool', (req, res) => teacherController.getTeacherBySchool(req, res));
teacherOthersRouter.get('/searchBySubject', (req, res) => teacherController.getTeacherBySubjects(req, res));
teacherOthersRouter.get('/searchByQualification', (req, res) => teacherController.getTeacherByQualification(req, res));
teacherOthersRouter.get('/searchByUserId/:userId', (req, res) => teacherController.getTeacherByUserId(req, res));
teacherOthersRouter.post('/teachers', (req, res) => teacherController.addMultipleTeachers(req, res));



export default teacherOthersRouter;
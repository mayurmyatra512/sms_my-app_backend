import express from "express";
import CoursesController from "../controllers/courses.controller.js";

const courseOthersRouter = express.Router();
const courseController = new CoursesController();

// Define routes for exam operations
courseOthersRouter.get('/subjects/:courseId', (req, res) => courseController.getAllCourses(req, res));

export default courseOthersRouter;

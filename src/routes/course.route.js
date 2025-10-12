import express from "express";
import CoursesController from "../controllers/courses.controller.js";

const courseRouter = express.Router();
const courseController = new CoursesController();

// Define routes for exam operations
courseRouter.get('/', (req, res) => courseController.getAllCourses(req, res));
courseRouter.get('/:id', (req, res) => courseController.getCourseById(req, res));
courseRouter.post('/', (req, res) => courseController.createCourses(req, res));
courseRouter.put('/:id', (req, res) => courseController.updateCourse(req, res));
courseRouter.delete('/:id', (req, res) => courseController.deleteCourse(req, res));

export default courseRouter;

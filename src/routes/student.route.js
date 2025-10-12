import express from 'express';
import StudentController from '../controllers/student.controller.js';

const studentController = new StudentController();
const studentRouter = express.Router();

// Define routes for student operations
studentRouter.get('/', (req, res) => studentController.getAllStudent(req, res));
studentRouter.get('/:id', (req, res) => studentController.getStudentById(req, res));
studentRouter.post('/', (req, res) => studentController.createStudent(req, res));
studentRouter.put('/:id', (req, res) => studentController.updateAStudent(req, res));
studentRouter.delete('/:id', (req, res) => studentController.deleteStudent(req, res));


export default studentRouter;

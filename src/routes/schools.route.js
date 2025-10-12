import express from 'express';
import SchoolsController from '../controllers/schools.controller.js';


const schoolsRouter = express.Router();
const schoolsController = new SchoolsController();

// Define routes for school operations
schoolsRouter.get('/', (req, res) => schoolsController.getAllSchools(req, res));
schoolsRouter.get('/:id', (req, res) => schoolsController.getSchoolById(req, res));
schoolsRouter.post('/', (req, res) => schoolsController.createSchool(req, res));
schoolsRouter.put('/:id', (req, res) => schoolsController.updateSchool(req, res));
schoolsRouter.delete('/:id', (req, res) => schoolsController.deleteSchool(req, res));



export default schoolsRouter;
import express from "express";
import ClassController from "../controllers/class.controller.js";


const classRouter = express.Router();
const classController = new ClassController();

// Define routes for class operations
classRouter.get('/', (req, res) => classController.getAllClasses(req, res));
classRouter.get('/:id', (req, res) => classController.getClassById(req, res));
classRouter.post('/', (req, res) => classController.createClass(req, res));
classRouter.put('/:id', (req, res) => classController.updateClass(req, res));
classRouter.delete('/:id', (req, res) => classController.deleteClass(req, res));


export default classRouter;


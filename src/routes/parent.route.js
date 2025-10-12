import express from 'express';
import ParentController from '../controllers/parent.controller.js';

const parentRouter = express.Router()
const parentController = new ParentController();

// Define routes for Parent operations
parentRouter.get('/', (req, res) => parentController.getAllParents(req, res));
parentRouter.get('/:id', (req, res) => parentController.getParentById(req, res));
parentRouter.post('/', (req, res) => parentController.createParent(req, res));
parentRouter.put('/:id', (req, res) => parentController.updateParent(req, res));
parentRouter.delete('/:id', (req, res) => parentController.deleteParent(req, res));



export default parentRouter;
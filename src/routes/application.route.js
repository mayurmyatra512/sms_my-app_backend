import express from 'express';
import ApplicationController from '../controllers/application.controller.js';

const applicationRouter = express.Router()
const applicationController = new ApplicationController();

// Define routes for Parent operations
applicationRouter.get('/', (req, res) => applicationController.getAllApplications(req, res));
applicationRouter.get('/:id', (req, res) => applicationController.getApplicationById(req, res));
applicationRouter.post('/', (req, res) => applicationController.createApplication(req, res));
applicationRouter.put('/:id', (req, res) => applicationController.updateApplication(req, res));
applicationRouter.delete('/:id', (req, res) => applicationController.deleteApplication(req, res));
applicationRouter.put('/:id/status', (req, res) => applicationController.updateApplicationStatus(req, res));
applicationRouter.post('/applications', (req, res) => applicationController.createMultipleApplications(req, res));





export default applicationRouter;
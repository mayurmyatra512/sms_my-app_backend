import express from 'express';
import FeeController from '../controllers/fee.controller.js';

const feeOtherRouter = express.Router();
const feeController = new FeeController();


// Define routes for fee operations
feeOtherRouter.get('/student/:studentId', (req, res) => feeController.getFeesByStudent(req, res));
feeOtherRouter.get('/class/:classId', (req, res) => feeController.getFeesByClass(req, res));
feeOtherRouter.get('/type/:feeType', (req, res) => feeController.getFeesByType(req, res));
feeOtherRouter.get('/status/:status', (req, res) => feeController.getFeesByStatus(req, res));
feeOtherRouter.get('/due', (req, res) => feeController.getDueFees(req, res));
feeOtherRouter.get('/reports/export', (req, res) => feeController.exportFeesToCSV(req, res));


export default feeOtherRouter;

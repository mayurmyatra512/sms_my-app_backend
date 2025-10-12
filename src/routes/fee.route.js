import express from "express";
import FeeController from "../controllers/fee.controller.js";

const feeRouter = express.Router();
const feeController = new FeeController();

// Define routes for fee operations
feeRouter.get('/', (req, res) => feeController.getAllFees(req, res));
feeRouter.get('/:id', (req, res) => feeController.getFeeById(req, res));
feeRouter.post('/', (req, res) => feeController.createFee(req, res));
feeRouter.put('/:id', (req, res) => feeController.updateFee(req, res));
feeRouter.delete('/:id', (req, res) => feeController.deleteFee(req, res));


export default feeRouter;
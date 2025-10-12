import express from "express";
import ExpenseController from "../controllers/expense.controller.js";

const expenseRouter = express.Router();
const expenseController = new ExpenseController();

// Define routes for fee operations
expenseRouter.get('/', (req, res) => expenseController.getAllExpenses(req, res));
expenseRouter.get('/:id', (req, res) => expenseController.getExpenseById(req, res));
expenseRouter.get('/user/', (req, res) => expenseController.getExpensesByUserId(req, res))
expenseRouter.post('/', (req, res) => expenseController.createExpense(req, res));
expenseRouter.put('/:id', (req, res) => expenseController.updateAExpense(req, res));
expenseRouter.patch('/:id/status', (req, res) => expenseController.updateExpenseStatus(req, res));
expenseRouter.delete('/:id', (req, res) => expenseController.deleteExpense(req, res));


export default expenseRouter;
// import { getUserIdByEmail } from "../config/helper";
import { getStaffIdByName } from "../config/helper.js";
import { getDataByToken, getUserByToken } from "../config/jwtops.js";
import ExpenseRepository from "../repositories/expenses.repository.js";

export default class ExpenseController {
    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    // Create a new Expense
     async createExpense(req, res) {
        try {
            const expenseData = req.body;
            const token = req.headers['authorization']
            // const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            expenseData.userId = await getUserByToken(token);
            const newExpense = await this.expenseRepository.createExpense(expenseData, decoded.schoolId, decoded.schoolName);
            if (!newExpense) {
                return res.status(400).json({ message: "Failed to create expense" });
            }
            res.status(201).json(newExpense);
        } catch (error) {
            console.error("Error creating expense:", error);
            res.status(500).json({ message: "Failed to create expense" });
        }
    }

    //Get All Expenses
     async getAllExpenses(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const expenses = await this.expenseRepository.getAllExpenses(decoded.schoolId, decoded.schoolName);
            res.status(200).json(expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            res.status(500).json({ message: "Failed to fetch expenses" });
        }
    }

    //Get a specific Expense
     async getExpenseById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const expenseData = await this.expenseRepository.getExpenseById(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!expenseData) {
                return res.status(404).json({ message: "expense not found" });
            }
            res.status(200).json(expenseData);
        } catch (error) {
            console.error("Error fetching expense:", error);
            res.status(500).json({ message: "Failed to fetch expense" });
        }
    }

    //Update an expense Record
     async updateAExpense(req, res) {
        try {
            const expenseData = req.body;
            const token = req.headers['authorization']
            // const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            expenseData.userId = await getUserByToken(token);
            const updatedExpense = await this.expenseRepository.updateAExpense(req.params.id, expenseData, decoded.schoolId, decoded.schoolName);
            if (!updatedExpense) {
                return res.status(404).json({ message: "expense not found" });
            }
            res.status(200).json(updatedExpense);
        } catch (error) {
            console.error("Error fetching expense:", error);
            res.status(500).json({ message: "Failed to fetch expense" });
        }
    }

    //Delete an Expense Record
     async deleteExpense(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedExpense = await this.expenseRepository.deleteExpense(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedExpense.status !== "success") {
                return res.status(404).json({ message: "expense not found" });
            }
            res.status(200).json({ message: "expense deleted successfully" });
        } catch (error) {
            console.error("Error fetching expense:", error);
            res.status(500).json({ message: "Failed to fetch expense" });
        }
    }

    // Get expenses by User
     async getExpensesByUserId(req, res) {
        try {
            const { name, role } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const userId = await getStaffIdByName(name, role);
            if (!userId) {
                return res.status(404).json({ message: "User not found" });
            }
            const expenses = await this.expenseRepository.getExpensesByUserId(userId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            res.status(500).json({ message: "Failed to fetch expenses" });
        }
    }

    async updateExpenseStatus(req, res) {
        try{
            const {status, approvedBy, approvedDate} = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedExpanse = await this.expenseRepository.updateExpenseStatus(req.params.id, status, approvedBy, approvedDate, decoded.schoolId, decoded.schoolName);
            if (!updatedExpanse) {
                return res.status(404).json({ message: "Expense not found" });
            }
            res.status(200).json(updatedExpanse);
        } catch (error) {
            console.error("Error updating expense status: ", error);
            res.status(500).json({ message: "Failed to update expense status" });
        }
    }
}


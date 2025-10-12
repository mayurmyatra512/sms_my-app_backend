import mongoose from "mongoose";
import expensesSchema from "../models/expenses.schema.js";
import { dbName } from "../config/tenantManager.js";
import { getDbConnection } from "../config/mongodbconnection.js";

export const getExpenseModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Expense`, expensesSchema, `expenses`);
    } catch (error) {
        console.error("Error getting expense model:", error);
        throw new Error("Failed to get expense model");
    }
}

export default class ExpenseRepository {
    // Create a new Expense record
     async createExpense(data, companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("expense model not found");
            // console.log("Expense Model = ", expenseModel);
            // Create a new expense instance
            const expenseInstance = new expenseModel(data);
            return await expenseInstance.save();
        } catch (error) {
            console.error("Error creating expense:", error);
            throw new Error("Failed to create expense");
        }
    }

    // Get all Expenses
     async getAllExpenses(companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("Expense model not found");
            return await expenseModel.find();
        } catch (error) {
            console.error("Error fetching expenses:", error);
            throw new Error("Failed to fetch expenses");
        }
    }
    // Get a Expense by ID
     async getAExpense(id, companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("Expense model not found");
            return await expenseModel.findById(id);
        } catch (error) {
            console.error("Error fetching Expense by ID:", error);
            throw new Error("Failed to fetch Expense");
        }
    }

    // Update a Expense by ID
     async updateAExpense(id, data, companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("Expense model not found");
            return await expenseModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Expense by ID:", error);
            throw new Error("Failed to update Expense");
        }
    }

    // Delete a Expense by ID
     async deleteAExpense(id, companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("expense model not found");
            return await expenseModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting expense by ID:", error);
            throw new Error("Failed to delete expense");
        }
    }

    // Get exams by user ID
     async getExpensesByUserId(userId, companyId, companyName) {
        try {
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("expense model not found");
            return await expenseModel.find({ userId: userId });
        } catch (error) {
            console.error("Error fetching expenses by teacher ID:", error);
            throw new Error("Failed to fetch expenses by teacher ID");
        }
    }

    // Update expense status
    async updateExpenseStatus(id, status, approvedBy, approvedDate, companyId, companyName){
        try {
            console.log("In updateExpenseStatus repo", { id, status, approvedBy, approvedDate });
            const expenseModel = await getExpenseModel(companyId, companyName);
            if (!expenseModel) throw new Error("expense model not found");
            return await expenseModel.findByIdAndUpdate(id, { status, approvedBy, approvedDate });
        } catch (error) {
            console.error("Error updating expenses status:", error);
            throw new Error("Failed to update expenses status");
        }
    }

      static async getRecentExpenses(schoolId, schoolName, limit = 5) {
        try {
            const expenseModel = await getExpenseModel(schoolId, schoolName);
            if (!expenseModel) throw new Error("expense model not found");
            
            const expenses = await expenseModel.find({ schoolId })
                .sort({ createdAt: -1 }) // latest first
                .limit(limit)
                .populate("categoryId", "name") // optional if you have categories
                .lean();

            return expenses.map(exp => ({
                _id: exp._id,
                title: exp.title || exp.description || "Expense",
                amount: exp.amount,
                category: exp.categoryId?.name || "General",
                createdAt: exp.createdAt,
                formattedDate: new Date(exp.createdAt).toLocaleDateString(),
            }));
        } catch (error) {
            console.error("Error fetching recent expenses:", error);
            return [];
        }
    }
}

import express from "express";
import DashboardController from "../controllers/dashboard.controller.js";

const dashboardRouter = express.Router();
const dashboardController = new DashboardController();

// Define routes for exam operations
dashboardRouter.get("/",(req, res) =>  dashboardController.getDashboardData(req, res));
dashboardRouter.get('/stats', (req, res) => dashboardController.getDashboardStats(req, res));
dashboardRouter.get('/student/:studentId', (req, res) => dashboardController.getStudentDashboard(req, res));

export default dashboardRouter;

import express from "express";
import UserController from "../controllers/user.controller.js";
import { authenticate } from "../config/authenticate.js";

const userOthersRouter = express.Router();
const userController = new UserController();

// Define routes for subject operations
userOthersRouter.get('/parent', authenticate, (req, res) => userController.getAllParents(req, res));
userOthersRouter.get('/teacher', authenticate, (req, res) => userController.getAllTeachers(req, res));
userOthersRouter.get('/student', authenticate, (req, res) => userController.getAllStudents(req, res));
userOthersRouter.get('/admin', authenticate, (req, res) => userController.getAllAdmins(req, res));
// userOthersRouter.get('/other', authenticate, (req, res) => userController.getUserById(req, res));

export default userOthersRouter;
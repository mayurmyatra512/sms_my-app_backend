import express from "express";
import UserController from "../controllers/user.controller.js";
import { authenticate } from "../config/authenticate.js";

const userRouter = express.Router();
const userController = new UserController();

// Define routes for subject operations
userRouter.get('/', authenticate, (req, res) => userController.getAllUsers(req, res));
userRouter.get('/:id', authenticate, (req, res) => userController.getUserById(req, res));
userRouter.post('/', (req, res) => userController.signup(req, res));
userRouter.post('/login', (req, res) => userController.loginUser(req, res));
userRouter.post('/logout', authenticate, (req, res) => userController.logoutUser(req, res));
userRouter.put('/:id', authenticate, (req, res) => userController.updateUser(req, res));
userRouter.delete('/:id', authenticate, (req, res) => userController.deleteUser(req, res));

export default userRouter;
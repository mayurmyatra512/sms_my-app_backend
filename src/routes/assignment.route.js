import express from "express";
import { AssignmentController } from "../controllers/assignment.controller.js";

const asssignmentRouter = express.Router();
const assignmentController = new AssignmentController();

// Routes
asssignmentRouter.post("/", assignmentController.create); // Create assignment
asssignmentRouter.get("/teacher/:teacherId", assignmentController.getByTeacher); // Get assignments by teacher
asssignmentRouter.get("/class/:classId/:sectionId", assignmentController.getByClass); // Get assignments by class
asssignmentRouter.put("/:id", assignmentController.update); // Update assignment
asssignmentRouter.put("/submission/:id", assignmentController.updateSubmission); // Update student's submission
asssignmentRouter.delete("/:id", assignmentController.delete); // Delete assignment

export default asssignmentRouter;

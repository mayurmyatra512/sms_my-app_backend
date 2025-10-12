import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller.js";

const departmentRouter = Router();

// Create a new Department
departmentRouter.post("/", DepartmentController.createDepartment);
departmentRouter.post("/depart", DepartmentController.addMultipleDepartments);

// Get all Departments
departmentRouter.get("/", DepartmentController.getAllDepartments);

// Get Department by ID
departmentRouter.get("/:id", DepartmentController.getDepartmentById);

// Update Department by ID
departmentRouter.put("/:id", DepartmentController.updateDepartment);

// Delete Department by ID
departmentRouter.delete("/:id", DepartmentController.deleteDepartment);

export default departmentRouter;

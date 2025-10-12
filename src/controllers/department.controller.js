import { getDataByToken } from "../config/jwtops.js";
import { DepartmentRepository } from "../repositories/department.repositories.js";

export class DepartmentController {
  static async createDepartment(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      // console.log(decoded);
      //   const { schoolId, schoolName } = req.user; // assuming middleware injects tenant info
      const department = await DepartmentRepository.createDepartment(
        decoded.schoolId,
        decoded.schoolName,
        req.body
      );
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(500).json({ error: "Failed to create department" });
    }
  }

  static async getAllDepartments(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      //  console.log(decoded)
      //   const { schoolId, schoolName } = req.user;
      const departments = await DepartmentRepository.getAllDepartments(
        decoded.schoolId,
        decoded.schoolName
      );
      res.status(200).json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ error: "Failed to fetch departments" });
    }
  }

  static async getDepartmentById(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      //   const { schoolId, schoolName } = req.user;
      const { id } = req.params;
      const department = await DepartmentRepository.getDepartmentById(
        decoded.schoolId,
        decoded.schoolName,
        id
      );
      if (!department)
        return res.status(404).json({ error: "Department not found" });
      res.status(200).json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      res.status(500).json({ error: "Failed to fetch department" });
    }
  }

  static async updateDepartment(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      //   const { schoolId, schoolName } = req.user;
      const { id } = req.params;
      const updatedDepartment = await DepartmentRepository.updateDepartment(
        decoded.schoolId,
        decoded.schoolName,
        id,
        req.body
      );
      if (!updatedDepartment)
        return res.status(404).json({ error: "Department not found" });
      res.status(200).json(updatedDepartment);
    } catch (error) {
      console.error("Error updating department:", error);
      res.status(500).json({ error: "Failed to update department" });
    }
  }

  static async deleteDepartment(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      //   const { schoolId, schoolName } = req.user;
      const { id } = req.params;
      const deleted = await DepartmentRepository.deleteDepartment(
        decoded.schoolId,
        decoded.schoolName,
        id
      );
      if (!deleted)
        return res.status(404).json({ error: "Department not found" });
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Error deleting department:", error);
      res.status(500).json({ error: "Failed to delete department" });
    }
  }

  // add Multiple Departments
  static async addMultipleDepartments(req, res) {
    try {
      const token = req.headers['authorization']
      const decoded = await getDataByToken(token);
      const departments = req.body.departments;
      console.log(departments);
      if (!Array.isArray(departments) || departments.length === 0) {
        return res.status(400).json({ message: "departments array is required" });
      }

      const savedDepartments = await DepartmentRepository.addDepartments(departments, decoded.schoolId, decoded.schoolName);
      return res.status(201).json({
        message: "departments added successfully",
        data: savedDepartments
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

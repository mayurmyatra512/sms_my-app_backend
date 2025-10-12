import { AssignmentRepository } from "../repositories/assignment.repository.js";
import { getDataByToken } from "../config/jwtops.js";

const assignmentRepo = new AssignmentRepository();

export class AssignmentController {

  // Create a new assignment
  async create(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const assignment = await assignmentRepo.createAssignment(req.body, decoded.schoolId, decoded.schoolName);
      res.status(201).json(assignment);
    } catch (err) {
      console.error("Error creating assignment:", err);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  }

  // Get all assignments by teacher
  async getByTeacher(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const { teacherId } = req.params;
      const assignments = await assignmentRepo.getAssignmentsByTeacher(teacherId, decoded.schoolId, decoded.schoolName);
      res.status(200).json(assignments);
    } catch (err) {
      console.error("Error fetching assignments by teacher:", err);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  }

  // Get assignments by class
  async getByClass(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const { classId, sectionId } = req.params;
      const assignments = await assignmentRepo.getAssignmentsByClass(classId, sectionId, decoded.schoolId, decoded.schoolName);
      res.status(200).json(assignments);
    } catch (err) {
      console.error("Error fetching assignments by class:", err);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  }

  // Update an assignment
  async update(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const { id } = req.params;
      const assignment = await assignmentRepo.updateAssignment(id, req.body, decoded.schoolId, decoded.schoolName);
      res.status(200).json(assignment);
    } catch (err) {
      console.error("Error updating assignment:", err);
      res.status(500).json({ message: "Failed to update assignment" });
    }
  }

  // Update student submission
  async updateSubmission(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const { id } = req.params; // assignmentId
      const { studentId, submittedDate, grade, remarks, status } = req.body;
      const assignment = await assignmentRepo.updateSubmission(id, studentId, { submittedDate, grade, remarks, status }, decoded.schoolId, decoded.schoolName);
      res.status(200).json(assignment);
    } catch (err) {
      console.error("Error updating submission:", err);
      res.status(500).json({ message: "Failed to update submission" });
    }
  }

  // Delete assignment
  async delete(req, res) {
    try {
         const token = req.headers['authorization']
        const decoded = await getDataByToken(token);
      const { id } = req.params;
      await assignmentRepo.deleteAssignment(id, decoded.schoolId, decoded.schoolName);
      res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (err) {
      console.error("Error deleting assignment:", err);
      res.status(500).json({ message: "Failed to delete assignment" });
    }
  }
}

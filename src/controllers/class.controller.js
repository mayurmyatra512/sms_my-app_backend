import { getDataByToken } from "../config/jwtops.js";
import ClassRepository from "../repositories/class.repository.js";

export default class ClassController {
    // Initialize the class repository
    constructor() {
        this.classRepository = new ClassRepository();
    }

    // Create a new class
     async createClass(req, res) {
        try {
            const classData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const newClass = await this.classRepository.createClass(classData, decoded.schoolId, decoded.schoolName);
            if (!newClass) {
                return res.status(400).json({ message: "Failed to create class" });
            }
            res.status(201).json(newClass);
        } catch (error) {
            console.error("Error creating class:", error);
            res.status(500).json({ message: "Failed to create class" });
        }
    }

    // Get all classes
     async getAllClasses(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classes = await this.classRepository.getAllClasss(decoded.schoolId, decoded.schoolName);
            res.status(200).json(classes);
        } catch (error) {
            console.error("Error fetching classes:", error);
            res.status(500).json({ message: "Failed to fetch classes" });
        }
    }

    // Get a specific class record by ID
     async getClassById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classData = await this.classRepository.getClassById(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!classData) {
                return res.status(404).json({ message: "class not found" });
            }
            res.status(200).json(classData);
        } catch (error) {
            console.error("Error fetching class by ID:", error);
            res.status(500).json({ message: "Failed to fetch class by ID" });
        }
    }

    // Update a class record
     async updateClass(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classData = req.body;
            const updatedClass = await this.classRepository.updateAClass(req.params.id, classData, decoded.schoolId, decoded.schoolName);
            if (!updatedClass) {
                return res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json(updatedClass);
        } catch (error) {
            console.error("Error updating Class:", error);
            res.status(500).json({ message: "Failed to update Class" });
        }
    }

    // Delete an class record
     async deleteClass(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedClass = await this.classRepository.deleteAClass(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedClass.status !== "success") {
                return res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ message: "Class deleted successfully" });
        } catch (error) {
            console.error("Error deleting Class:", error);
            res.status(500).json({ message: "Failed to delete Class" });
        }
    }
    // Get classes by teacher ID
     async getClassesByTeacherId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classes = await this.classRepository.getClassesByTeacherId(req.params.teacherId, decoded.schoolId, decoded.schoolName);
            if (!classes || classes.length === 0) {
                return res.status(404).json({ message: "No classes found for this teacher" });
            }
            res.status(200).json(classes);
        } catch (error) {
            console.error("Error fetching classes by teacher ID:", error);
            res.status(500).json({ message: "Failed to fetch classes by teacher ID" });
        }
    }
    // Get classes by student ID
     async getClassesByStudentId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classes = await this.classRepository.getClassesByStudentId(req.params.studentId, decoded.schoolId, decoded.schoolName);
            if (!classes || classes.length === 0) {
                return res.status(404).json({ message: "No classes found for this student" });
            }
            res.status(200).json(classes);
        } catch (error) {
            console.error("Error fetching classes by student ID:", error);
            res.status(500).json({ message: "Failed to fetch classes by student ID" });
        }
    }
    // Get classes by subject ID
     async getClassesBySubjectId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classes = await this.classRepository.getClassesBySubjectId(req.params.subjectId, decoded.schoolId, decoded.schoolName);
            if (!classes || classes.length === 0) {
                return res.status(404).json({ message: "No classes found for this subject" });
            }
            res.status(200).json(classes);
        } catch (error) {
            console.error("Error fetching classes by subject ID:", error);
            res.status(500).json({ message: "Failed to fetch classes by subject ID" });
        }
    }
    // Get classes by date
     async getClassesByDate(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classes = await this.classRepository.getClassesByDate(req.params.date, decoded.schoolId, decoded.schoolName);
            if (!classes || classes.length === 0) {
                return res.status(404).json({ message: "No classes found for this date" });
            }
            res.status(200).json(classes);
        } catch (error) {
            console.error("Error fetching classes by date:", error);
            res.status(500).json({ message: "Failed to fetch classes by date" });
        }
    }

        // add Multiple Classes
     async addMultipleClasses(req, res) {
    try {
        const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
      const classes = req.body.classes;

      if (!Array.isArray(classes) || classes.length === 0) {
        return res.status(400).json({ message: "classes array is required" });
      }

      const savedSubjects = await this.classRepository.addClasses(classes, decoded.schoolId, decoded.schoolName);
      return res.status(201).json({
        message: "classes added successfully",
        data: savedSubjects
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

}
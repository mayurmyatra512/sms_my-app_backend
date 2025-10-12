import ExamRepository from "../repositories/exam.repository.js";
import { getDataByToken } from "../config/jwtops.js";
import { getClassIdByName, getSubjectIdByName } from "../config/helper.js";

export default class ExamController {
    constructor() {
        this.examRepository = new ExamRepository();
    }

    //Create a  new Exam 
     async createExam(req, res) {
        try {
            const examData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token); 
            // examData.classId = await getClassIdByName(examData.className, decoded.schoolId, decoded.schoolName);
            // examData.subjectId = await getSubjectIdByName(examData.subject, decoded.schoolId, decoded.schoolName);
            const newExam = await this.examRepository.createExam(examData, decoded.schoolId, decoded.schoolName);
            if (!newExam) {
                return res.status(400).json({ message: "Failed to create Exam" });
            }
            // console.log(newExam);
            res.status(201).json(newExam);
        } catch (error) {
            console.error("Error creating exam:", error);
            res.status(500).json({ message: "Failed to create exam" });
        }
    }

    //Get All Exams
     async getAllExams(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const Exams = await this.examRepository.getAllExams(decoded.schoolId, decoded.schoolName);
            res.status(200).json(Exams);
        } catch (error) {
            console.error("Error fetching exams:", error);
            res.status(500).json({ message: "Failed to fetch exams" });
        }
    }


    //Get a specific Exam
     async getExamById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const examData = await this.examRepository.getExamById(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!examData) {
                return res.status(404).json({ message: "Exam not found" });
            }
            res.status(200).json(examData);
        } catch (error) {
            console.error("Error fetching exams:", error);
            res.status(500).json({ message: "Failed to fetch exams" });
        }
    }

    //Update an Exam Record
     async updateExam(req, res) {
        try {
            const examData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedExam = await this.examRepository.updateExam(req.params.id, examData, decoded.schoolId, decoded.schoolName);
            if (!updatedExam) {
                return res.status(404).json({ message: "Exam not found" });
            }
            res.status(200).json(updatedExam);
        } catch (error) {
            console.error("Error fetching exams:", error);
            res.status(500).json({ message: "Failed to fetch exams" });
        }
    }

    //Delete an Exam Record
     async deleteExam(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedExam = await this.examRepository.deleteExam(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedExam.status !== "success") {
                return res.status(404).json({ message: "Exam not found" });
            }
            res.status(200).json({ message: "Exam deleted successfully" });
        } catch (error) {
            console.error("Error fetching exams:", error);
            res.status(500).json({ message: "Failed to fetch exams" });
        }
    }
    // Get exams by teacher ID
     async getExamsByTeacherId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const exams = await this.examRepository.getExamsByTeacherId(req.params.teacherId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(exams);
        } catch (error) {
            console.error("Error fetching exams by teacher ID:", error);
            res.status(500).json({ message: "Failed to fetch exams by teacher ID" });
        }
    }
    // Get exams by student ID
     async getExamsByStudentId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const exams = await this.examRepository.getExamsByStudentId(req.params.studentId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(exams);
        } catch (error) {
            console.error("Error fetching exams by student ID:", error);
            res.status(500).json({ message: "Failed to fetch exams by student ID" });
        }
    }
    // Get exams by subject ID
     async getExamsBySubjectId(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const exams = await this.examRepository.getExamsBySubjectId(req.params.subjectId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(exams);
        } catch (error) {
            console.error("Error fetching exams by subject ID:", error);
            res.status(500).json({ message: "Failed to fetch exams by subject ID" });
        }
    }
    // Get exams by Date
     async getExamsByDate(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const exams = await this.examRepository.getExamsByDate(req.params.date, decoded.schoolId, decoded.schoolName);
            res.status(200).json(exams);
        } catch (error) {
            console.error("Error fetching exams by date:", error);
            res.status(500).json({ message: "Failed to fetch exams by date" });
        }
    }
}
import { getSubjectIdByCode, getSubjectIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import CoursesRepository from "../repositories/courses.repository.js";

export default class CoursesController {
    constructor(){
        this.coursesRepository = new CoursesRepository();
    }

    //Create a  new Courses
     async createCourses(req, res){
        try {
            const courseData = req.body;
            // console.log("Data = ", courseData)
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // courseData.examId = await getExamIdByName(courseData.examName, decoded.schoolId, decoded.schoolName);
            // courseData.studentId = await getStudentIdByName(courseData.studentName, decoded.schoolId, decoded.schoolName);
            courseData.subjectIds = await getSubjectIdByCode(courseData.subjects, decoded.schoolId, decoded.schoolName);
            // console.log("SubjectIds = ", courseData.subjectIds);
            courseData.schoolId = decoded.schoolId;

            const newCourse = await this.coursesRepository.createCourses(courseData, decoded.schoolId, decoded.schoolName);
            if (!newCourse) {
                return res.status(400).json({ message: "Failed to create Course" });
            }
            res.status(201).json(newCourse);        
        } catch (error) {
            console.error("Error creating Course:", error);
            res.status(500).json({ message: "Failed to create Course" });
        }
    }

    
    //Get All Courses
     async getAllCourses(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const courses = await this.coursesRepository.getAllCourses(decoded.schoolId, decoded.schoolName);
            // console.log("Courses = ", courses)
            res.status(200).json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ message: "Failed to fetch courses" });
        }
    }


    //Get a specific Courses
     async getCourseById(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const courseData = await this.coursesRepository.getACourse(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!courseData) {
                return res.status(404).json({ message: "course not found" });
            }
            res.status(200).json(courseData);
        } catch (error) {
            console.error("Error fetching course:", error);
            res.status(500).json({ message: "Failed to fetch course" });
        }
    }

    //Update an course Record
     async updateCourse(req, res){
        try {
            const courseData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedCourse = await this.coursesRepository.updateACourse(req.params.id, courseData, decoded.schoolId, decoded.schoolName);
            if (!updatedCourse) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(updatedCourse);
        } catch (error) {
            console.error("Error fetching Course :", error);
            res.status(500).json({ message: "Failed to fetch Course " });
        }
    }

    //Delete an Course Record
     async deleteCourse(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedCourse = await this.coursesRepository.deleteACourse(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedCourse.status !== "success") {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            console.error("Error fetching Course :", error);
            res.status(500).json({ message: "Failed to fetch Course " });
        }
    }

    // Get subjects by course ID
     async getSubjectsByCourses(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const courseId = req.params.courseId;
            const courses = await this.coursesRepository.getSubjectsByCourses(courseId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(courses);
        } catch (error) {
            console.error("Error fetching courses by student ID:", error);
            res.status(500).json({ message: "Failed to fetch courses by student ID" });
        }
    }
}
import { getExamIdByName, getStudentIdByName, getSubjectIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import ExamResultRepository from "../repositories/examResult.repository.js";

export default class ExamResultController {
    constructor() {
        this.examResultRepository = new ExamResultRepository();
    }

    //Create a  new Exam Result
    async createExamResult(req, res) {
        try {
            const examResultData = req.body;
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const newExamResult = await this.examResultRepository.createExamResult(
                examResultData,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!newExamResult) {
                return res.status(400).json({ message: "Failed to create Exam Result" });
            }

            res.status(201).json(newExamResult);
        } catch (error) {
            console.error("Error creating exam result:", error);
            res.status(500).json({ message: "Failed to create exam result" });
        }
    }


    //Get All Exam Results
    async getAllExamResults(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const examResults = await this.examResultRepository.getAllExamResults(
                decoded.schoolId,
                decoded.schoolName
            );
            res.status(200).json(examResults);
        } catch (error) {
            console.error("Error fetching exam Results:", error);
            res.status(500).json({ message: "Failed to fetch exam Results" });
        }
    }


    //Get a specific Exam Result
    async getExamResultById(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const examResultData = await this.examResultRepository.getAExamResult(
                req.params.id,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!examResultData) {
                return res.status(404).json({ message: "Exam Result not found" });
            }
            res.status(200).json(examResultData);
        } catch (error) {
            console.error("Error fetching exam Result:", error);
            res.status(500).json({ message: "Failed to fetch exam Result" });
        }
    }

    //Update an Exam Result Record
    async updateExamResult(req, res) {
        try {
            const examResultData = req.body;
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const updatedExamResult = await this.examResultRepository.updateAExamResult(
                req.params.id,
                examResultData,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!updatedExamResult) {
                return res.status(404).json({ message: "Exam Result not found" });
            }

            res.status(200).json(updatedExamResult);
        } catch (error) {
            console.error("Error fetching exam Results:", error);
            res.status(500).json({ message: "Failed to fetch exam Results" });
        }
    }

    //Delete an Exam Result Record
    async deleteExamResult(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const deletedExamResult = await this.examResultRepository.deleteAExamResult(
                req.params.id,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!deletedExamResult) {
                return res.status(404).json({ message: "Exam Result not found" });
            }

            res.status(200).json({ message: "Exam Result deleted successfully" });
        } catch (error) {
            console.error("Error fetching exam Results:", error);
            res.status(500).json({ message: "Failed to fetch exam Results" });
        }
    }

    // Get Exam Results by Student ID
    async getExamResultsByStudentId(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const studentId = req.params.studentId;

            const examResults = await this.examResultRepository.getExamResultsByStudentId(
                studentId,
                decoded.schoolId,
                decoded.schoolName
            );
            if (!examResults || examResults.length === 0) {
                return res.status(404).json({ message: "No exam results found for this student" });
            }

            // Initialize accumulators
            let totalObtainedMarks = 0;
            let totalMaxMarks = 0;
            let totalSubjects = 0;

            examResults.forEach((exam) => {
                console.log("Exam = ", exam)
                exam.subjects.forEach((subj) => {
                    console.log("Subject = ", subj)
                    totalObtainedMarks += subj.marksObtained || 0;
                    totalMaxMarks += subj.totalMarks || subj.maxMarks || 100; // fallback if field names vary
                    totalSubjects += 1;
                });
            });

            console.log("Response in Controller = ", { totalObtainedMarks, totalMaxMarks, totalSubjects })
            // Calculate GPA (4.0 scale)
            let gpa = 0;
            if (totalMaxMarks > 0) {
                gpa = (totalObtainedMarks / totalMaxMarks) * 4;
                if (gpa > 4) gpa = 4; // cap at 4
            }

            // Calculate percentage too, if needed
            const percentage =
                totalMaxMarks > 0 ? (totalObtainedMarks / totalMaxMarks) * 100 : 0;

            console.log("Response = ", {
                studentId,
                classId: examResults[0].classId,
                examCount: examResults.length,
                totalSubjects,
                totalObtainedMarks,
                totalMaxMarks,
                percentage: percentage.toFixed(2),
                gpa: gpa.toFixed(2),
                exams: examResults,
            })

            // Build response
            const response = {
                studentId,
                classId: examResults[0].classId,
                examCount: examResults.length,
                totalSubjects,
                totalObtainedMarks,
                totalMaxMarks,
                percentage: percentage.toFixed(2),
                gpa: gpa.toFixed(2),
                exams: examResults,
            };
            res.status(200).json(response);
        } catch (error) {
            console.error("Error fetching exam results by student ID:", error);
            res.status(500).json({ message: "Failed to fetch exam results by student ID" });
        }
    }
    // Get Exam Results by Subject ID
    async getExamResultsBySubjectId(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const subjectId = req.params.subjectId;
            const examResults = await this.examResultRepository.getExamResultsBySubjectId(
                subjectId,
                decoded.schoolId,
                decoded.schoolName
            );

            res.status(200).json(examResults);
        } catch (error) {
            console.error("Error fetching exam results by subject ID:", error);
            res.status(500).json({ message: "Failed to fetch exam results by subject ID" });
        }
    }
    // Get Exam Results by Date
    async getExamResultsByDate(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const date = req.params.date;
            const examResults = await this.examResultRepository.getExamResultsByDate(
                date,
                decoded.schoolId,
                decoded.schoolName
            );

            res.status(200).json(examResults);
        } catch (error) {
            console.error("Error fetching exam results by date:", error);
            res.status(500).json({ message: "Failed to fetch exam results by date" });
        }
    }

    //async add multiple exam results
    // async addMultipleStudentsExamResults(req, res) {
    //     try {
    //         const token = req.headers['authorization'];
    //         const decoded = await getDataByToken(token);

    //         const examResults = req.body.examResults;

    //         if (!Array.isArray(teachers) || teachers.length === 0) {
    //             return res.status(400).json({ message: "teachers array is required" });
    //         }

    //         const savedTeachers = [];

    //         for (const formData of teachers) {
    //             // 1. Prepare user data
    //             const userTeacherData = {
    //                 firstName: formData.firstName,
    //                 lastName: formData.lastName,
    //                 fullName: formData.firstName + " " + formData.lastName,
    //                 email: formData.email,
    //                 password: formData.password || "password123", // hash this in real app
    //                 phone: formData.phone,
    //                 role: "teacher",
    //                 gender: formData.gender,
    //                 dob: formData.dateOfBirth,
    //                 address: formData.address,
    //                 schoolId: decoded.schoolId,
    //                 medicalInfo: formData.medicalInfo || "",
    //                 additionalNotes: formData.additionalNotes || "",
    //                 profileModel: "Teacher"
    //             };

    //             // 2. Create User
    //             const newUser = await this.userRepository.createUser(userTeacherData, decoded.schoolId, decoded.schoolName);

    //             // 3. Prepare Teacher data
    //             const teacherData = {
    //                 userId: newUser._id,
    //                 employeeCode: formData.employeeCode,
    //                 designation: formData.designation,
    //                 department: formData.department,
    //                 experience: formData.experience,
    //                 qualification: formData.qualification,
    //                 joiningDate: formData.joiningDate,
    //                 salary: formData.salary,
    //                 subjects: formData.subjects,
    //                 classId: formData.classId,
    //                 sectionId: formData.sectionId,
    //                 emergencyContactName: formData.emergencyContactName,
    //                 emergencyContactNumber: formData.emergencyContactNumber,
    //                 emergencyContactRelation: formData.emergencyContactRelation,
    //                 status: formData.status || "active",
    //                 schoolId: decoded.schoolId
    //             };

    //             // 4. Create Teacher entry
    //             const newTeacher = await this.teacherRepository.createTeacher(teacherData, decoded.schoolId, decoded.schoolName);


    //             // 5. Create StaffSalary entry
    //             const staffSalaryData = {
    //                 staffId: newTeacher._id,
    //                 basicSalary: formData.salary || 0,
    //                 allowances: 0,
    //                 deductions: 0,
    //                 netSalary: formData.salary || 0,
    //                 status: "pending",
    //                 schoolId: decoded.schoolId
    //             };

    //             const newStaffSalary = await this.staffSalaryRepository.createStaffSalary(staffSalaryData, decoded.schoolId, decoded.schoolName);

    //             // 6. Add references to savedTeachers
    //             savedTeachers.push({
    //                 ...newTeacher.toObject(),
    //                 userId: newUser._id,
    //                 staffSalaryId: newStaffSalary._id
    //             });
    //         }

    //         return res.status(201).json({
    //             message: "Teachers added successfully",
    //             data: savedTeachers
    //         });
    //     } catch (error) {
    //         console.error("Error adding teachers:", error);
    //         return res.status(500).json({ message: error.message });
    //     }
    // }


    // Add multiple exam results at once (bulk insert)
    async addMultipleStudentsExamResults(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            const examResults = req.body.examResults;

            if (!Array.isArray(examResults) || examResults.length === 0) {
                return res.status(400).json({ message: "examResults array is required" });
            }

            // const ExamResultModel = await getExamResultModel(decoded.schoolId, decoded.schoolName);
            // const savedResults = await ExamResultModel.insertMany(examResults);
            const savedResults = await this.examResultRepository.addResults(examResults, decoded.schoolId, decoded.schoolName);
            return res.status(201).json({
                message: "Exam Results added successfully",
                data: savedResults,
            });
        } catch (error) {
            console.error("Error adding multiple exam results:", error);
            return res.status(500).json({ message: error.message });
        }
    }
}
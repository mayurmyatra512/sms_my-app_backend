import { getClassIdByName, getSchoolIdByName, getSectionIdByName, getSubjectIdByName, getTeacherAveragePerformance, getTotalStudentsByTeacher, getTotalStudentsByPerformance } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import { getAssignmentModel } from "../repositories/assignment.repository.js";
import StaffSalaryRepository from "../repositories/staffSalary.repository.js";
import { getStudentModel } from "../repositories/student.repository.js";
import TeacherRepository from "../repositories/teacher.repository.js";
import UserRepository from "../repositories/users.repository.js";


export default class TeacherController {
    constructor() {
        this.teacherRepository = new TeacherRepository();
        this.staffSalaryRepository = new StaffSalaryRepository();
        this.userRepository = new UserRepository();
    }

    //Create a  new Teacher
    async createTeacher(req, res) {
        try {
            const teacherData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            teacherData.schoolId = decoded.schoolId;
            // console.log({ teacherData, decoded });
            // await Promise.all(teacherData.subjects.map(async (subjectName) => {
            //     const subjectId = await getSubjectIdByName(subjectName.name, decoded.schoolId, decoded.schoolName);
            //     teacherData.subjects.push(subjectId);
            // }));

            // await Promise.all(teacherData.classId.map(async (className) => {
            //     const classId = await getClassIdByName(className.name, decoded.schoolId, decoded.schoolName);
            //     teacherData.classId.push(classId);
            // }));

            // await Promise.all(teacherData.sectionId.map(async (sectionName) => {
            //     const sectionId = await getSectionIdByName(sectionName.name, decoded.schoolId, decoded.schoolName);
            //     teacherData.sectionId.push(sectionId);
            // }));

            const newTeacher = await this.teacherRepository.createTeacher(teacherData, decoded.schoolId, decoded.schoolName);
            if (!newTeacher) {
                return res.status(400).json({ message: "Failed to create Teacher" });
            }
            const staffSalaryData = {
                staffId: newTeacher._id
            }

            const newStaffSalary = await this.staffSalaryRepository.createStaffSalary(staffSalaryData, decoded.schoolId, decoded.schoolName);

            res.status(201).json(newTeacher);
        } catch (error) {
            console.error("Error creating Teacher:", error);
            res.status(500).json({ message: "Failed to create Teacher" });
        }
    }

    //Get All Teacher
    async getAllTeachers(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const teachers = await this.teacherRepository.getAllTeachers(decoded.schoolId, decoded.schoolName);
            const Student = await getStudentModel(decoded.schoolId, decoded.schoolName)
            let teachersData = [];
            // console.log("Teacher = ", teachers);

            for (const teacher of teachers) {
                const subjectIds = Array.isArray(teacher.subjectId)
                    ? teacher.subjectId.map(sub => (sub._id ? sub._id : sub))
                    : [];

                const classIds = Array.isArray(teacher.classId)
                    ? teacher.classId.map(cls => (cls._id ? cls._id : cls))
                    : [];


                const sectionIds = Array.isArray(teacher.sectionId)
                    ? teacher.sectionId.map(sec => (sec._id ? sec._id : sec))
                    : [];

                // 🔹 Find total students directly from Student collection
                const totalStudents = await Student.countDocuments({
                    schoolId: decoded.schoolId,
                    classId: { $in: classIds },
                    sectionId: { $in: sectionIds },
                    status: "active"
                });


                const avgPerf = await getTeacherAveragePerformance(teacher._id, decoded.schoolId, decoded.schoolName);



                const performanceBreakdown = {
                    excellent: await getTotalStudentsByPerformance(
                        teacher._id,
                        "excellent",
                        classIds,
                        decoded.schoolId,
                        decoded.schoolName
                    ),
                    good: await getTotalStudentsByPerformance(
                        teacher._id,
                        "good",
                        classIds,
                        decoded.schoolId,
                        decoded.schoolName
                    ),
                    average: await getTotalStudentsByPerformance(
                        teacher._id,
                        "average",
                        classIds,
                        decoded.schoolId,
                        decoded.schoolName
                    ),
                    needsImprovement: await getTotalStudentsByPerformance(
                        teacher._id,
                        "needsImprovement",
                        classIds,
                        decoded.schoolId,
                        decoded.schoolName
                    ),
                };

                teachersData.push({
                    ...teacher.toObject ? teacher.toObject() : teacher,
                    subjects: subjectIds,
                    classes: classIds,
                    sections: sectionIds,
                    totalStudents,
                    averagePerformance: avgPerf,
                    performanceBreakdown
                });
            }
            // 🔹 Find max average performance
            let topPerformers = [];
            if (teachersData.length > 0) {
                const maxPerf = Math.max(
                    ...teachersData.map((t) => t.averagePerformance || 0)
                );

                // collect all teachers who have the max score
                topPerformers = teachersData
                    .filter((t) => (t.averagePerformance || 0) === maxPerf)
                    .map((t) => t.userId.fullName); // store only names
                // console.log(topPerformers)
            }

            // console.log("teachersData = ",totalStudents)


            // 🔹 Attach topPerformers to response
            res.status(200).json({
                teachers: teachersData,
                topPerformers,
            });
        } catch (error) {
            console.error("Error fetching Teachers:", error);
            res.status(500).json({ message: "Failed to fetch Teachers" });
        }
    }

    //Get a specific Teacher
    async getTeacherById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const teacherData = await this.teacherRepository.getATeacher(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!teacherData) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json(teacherData);
        } catch (error) {
            console.error("Error fetching Teacher:", error);
            res.status(500).json({ message: "Failed to fetch Teacher" });
        }
    }

    //Update an Teacher Record
    async updateATeacher(req, res) {
        try {
            const TeacherData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedTeacher = await this.teacherRepository.updateATeacher(req.params.id, TeacherData, decoded.schoolId, decoded.schoolName);
            if (!updatedTeacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json(updatedTeacher);
        } catch (error) {
            console.error("Error updating Teacher:", error);
            res.status(500).json({ message: "Failed to update Teacher" });
        }
    }

    //Delete an Teacher Record
    async deleteTeacher(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedTeacher = await this.teacherRepository.deleteATeacher(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedTeacher.status !== "success") {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json({ message: "Teacher deleted successfully" });
        } catch (error) {
            console.error("Error deleting Teacher:", error);
            res.status(500).json({ message: "Failed to delete Teacher" });
        }
    }

    // Search Teacher By Name
    async getTeacherByName(req, res) {
        try {
            const { name } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const userId = await getUserIdByName(name, decoded.schoolId, decoded.schoolName);
            if (!userId) {
                return res.status(400).json({ message: "Name is required" });
            }
            const teachers = await this.teacherRepository.getTeacherByName(userId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(teachers);
        } catch (error) {
            console.error("Error fetching Teacher by Name:", error);
            res.status(500).json({ message: "Failed to fetch Teacher By Name" });
        }
    }
    // Search Teacher By EmpCode
    async getTeacherByEmpCode(req, res) {
        try {
            const { empCode } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!empCode) {
                return res.status(400).json({ message: "Emp Code is required" });
            }
            const teachers = await this.teacherRepository.getTeacherByEmpCode(empCode, decoded.schoolId, decoded.schoolName);
            res.status(200).json(teachers);
        } catch (error) {
            console.error("Error fetching Teacher by Emp Code:", error);
            res.status(500).json({ message: "Failed to fetch Teacher by Emp Code" });
        }
    }
    // Search Teacher By School
    async getTeacherBySchool(req, res) {
        try {
            const { school } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!school) {
                return res.status(400).json({ message: "School is required" });
            }
            const schoolId = await getSchoolIdByName(school)
            if (!schoolId) {
                return res.status(400).json({ message: "School Id is required" });
            }
            const teachers = await this.teacherRepository.getTeacherBySchool(schoolId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(teachers);
        } catch (error) {
            console.error("Error fetching Teacher by School:", error);
            res.status(500).json({ message: "Failed to fetch Teacher by School" });
        }
    }
    // Search Teacher By Subjects
    async getTeacherBySubjects(req, res) {
        try {
            const { subjectIds, matchAll } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // subjectIds: ["64ff2...", "65aa3..."]
            // matchAll: true/false
            if (!subjectIds || !Array.isArray(subjectIds) || subjectIds.length === 0) {
                return res.status(400).json({ message: "Subject IDs are required" });
            }
            const teachers = await this.teacherRepository.getTeacherBySubjects(subjectIds, matchAll, decoded.schoolId, decoded.schoolName);

            res.status(200).json({
                success: true,
                count: teachers.length,
                teachers,
            });
        } catch (error) {
            console.error("Error fetching Teacher by Subjects:", error);
            res.status(500).json({ message: "Failed to fetch Teacher by Subjects" });
        }
    }
    // Search Teacher By Qualification
    async getTeacherByQualification(req, res) {
        try {
            const { qualifications } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!qualifications) {
                return res.status(400).json({ message: "Emp Code is required" });
            }
            const teachers = await this.teacherRepository.getTeacherByQualification(qualifications, decoded.schoolId, decoded.schoolName);
            res.status(200).json(teachers);
        } catch (error) {
            console.error("Error fetching Teacher by Qualifications:", error);
            res.status(500).json({ message: "Failed to fetch Teacher by Qualifications" });
        }
    }

    // add Multiple Teachers
    async addMultipleTeachers(req, res) {
        try {
            const token = req.headers['authorization'];
            const decoded = await getDataByToken(token);

            const teachers = req.body.teachers;

            if (!Array.isArray(teachers) || teachers.length === 0) {
                return res.status(400).json({ message: "teachers array is required" });
            }

            const savedTeachers = [];

            for (const formData of teachers) {
                // 1. Prepare user data
                const userTeacherData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fullName: formData.firstName + " " + formData.lastName,
                    email: formData.email,
                    password: formData.password || "password123", // hash this in real app
                    phone: formData.phone,
                    role: "teacher",
                    gender: formData.gender,
                    dob: formData.dateOfBirth,
                    address: formData.address,
                    schoolId: decoded.schoolId,
                    medicalInfo: formData.medicalInfo || "",
                    additionalNotes: formData.additionalNotes || "",
                    profileModel: "Teacher"
                };

                // 2. Create User
                const newUser = await this.userRepository.createUser(userTeacherData, decoded.schoolId, decoded.schoolName);

                // 3. Prepare Teacher data
                const teacherData = {
                    userId: newUser._id,
                    employeeCode: formData.employeeCode,
                    designation: formData.designation,
                    department: formData.department,
                    experience: formData.experience,
                    qualification: formData.qualification,
                    joiningDate: formData.joiningDate,
                    salary: formData.salary,
                    subjectId: formData.subjects,
                    classId: formData.classId,
                    sectionId: formData.sectionId,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactNumber: formData.emergencyContactNumber,
                    emergencyContactRelation: formData.emergencyContactRelation,
                    status: formData.status || "active",
                    schoolId: decoded.schoolId
                };

                // 4. Create Teacher entry
                const newTeacher = await this.teacherRepository.createTeacher(teacherData, decoded.schoolId, decoded.schoolName);


                // 5. Create StaffSalary entry
                const staffSalaryData = {
                    staffId: newTeacher._id,
                    basicSalary: formData.salary || 0,
                    allowances: 0,
                    deductions: 0,
                    netSalary: formData.salary || 0,
                    status: "pending",
                    schoolId: decoded.schoolId
                };

                const newStaffSalary = await this.staffSalaryRepository.createStaffSalary(staffSalaryData, decoded.schoolId, decoded.schoolName);

                // 6. Add references to savedTeachers
                savedTeachers.push({
                    ...newTeacher.toObject(),
                    userId: newUser._id,
                    staffSalaryId: newStaffSalary._id
                });
            }

            return res.status(201).json({
                message: "Teachers added successfully",
                data: savedTeachers
            });
        } catch (error) {
            console.error("Error adding teachers:", error);
            return res.status(500).json({ message: error.message });
        }
    }

    async getTeacherByUserId(req, res) {
        //  try {
        //             const { userId } = req.params;
        //             const token = req.headers['authorization']
        //             const decoded = await getDataByToken(token);
        //             if (!userId) {
        //                 return res.status(400).json({ message: "userId is required" });
        //             }
        //             const teachers = await this.teacherRepository.getTeacherByUserId(userId, decoded.schoolId, decoded.schoolName);
        //             res.status(200).json(teachers);
        //         } catch (error) {
        //             console.error("Error fetching Teacher by userId:", error);
        //             res.status(500).json({ message: "Failed to fetch Teacher by userId" });
        //         }
        //     }
        try {
            const { userId } = req.params;
            const token = req.headers['authorization'];
            const decoded = await getDataByToken(token);

            if (!userId) {
                return res.status(400).json({ message: "userId is required" });
            }

            // Fetch teacher info
            const teacher = await this.teacherRepository.getTeacherByUserId(
                userId,
                decoded.schoolId,
                decoded.schoolName
            );

            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            // Get all classes assigned to teacher
            const classIds = teacher.classId.map(c => c._id);

            // Get all sections assigned to teacher
            const sectionIds = teacher.sectionId.map(s => s._id);

            // Fetch all students in these classes & sections
            const Student = await getStudentModel(
                decoded.schoolId,
                decoded.schoolName
            );
            const students = await Student.find({
                classId: { $in: classIds },
                sectionId: { $in: sectionIds },
                status: "active",
            });

            // Total students
            const totalStudents = students.length;

            // Fetch assignments for these classes & sections & teacher subjects
            const subjectIds = teacher.subjectId.map(s => s._id);
            const Assignment = await getAssignmentModel(
                decoded.schoolId,
                decoded.schoolName
            );
            const assignments = await Assignment.find({
                classId: { $in: classIds },
                sectionId: { $in: sectionIds },
                subjectId: { $in: subjectIds }
            });

            // Pending grades = assignments not graded yet
            const pendingGrades = assignments.filter(a => !a.graded).length;

            // Compute average grades per class
            const classPerformance = await Promise.all(
                classIds.map(async (clsId) => {
                    const studentsInClass = students.filter(s => s.classId.toString() === clsId.toString());
                    const assignmentsInClass = assignments.filter(a => a.classId.toString() === clsId.toString());

                    let avgGrade = 0;
                    if (assignmentsInClass.length > 0) {
                        const gradedAssignments = assignmentsInClass.filter(a => a.graded);
                        const totalGrades = gradedAssignments.reduce((sum, a) => sum + a.grade, 0);
                        avgGrade = gradedAssignments.length > 0 ? totalGrades / gradedAssignments.length : 0;
                    }

                    return {
                        classId: clsId,
                        className: teacher.classId.find(c => c._id.toString() === clsId.toString())?.name,
                        totalStudents: studentsInClass.length,
                        avgGrade: Math.round(avgGrade),
                    };
                })
            );

            // Return enriched teacher data
            const response = {
                ...teacher.toObject(),
                totalStudents,
                pendingGrades,
                avgClassGrade: classPerformance.length > 0
                    ? Math.round(classPerformance.reduce((sum, cls) => sum + cls.avgGrade, 0) / classPerformance.length)
                    : 0,
                classPerformance
            };

            res.status(200).json(response);

        } catch (error) {
            console.error("Error fetching Teacher by userId:", error);
            res.status(500).json({ message: "Failed to fetch Teacher by userId" });
        }
    }
}
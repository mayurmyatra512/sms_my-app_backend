import { getClassIdByName, getParentIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import AttendanceRepository from "../repositories/attendance.repository.js";
import ParentRepository from "../repositories/parent.repository.js";
import StudentRepository from "../repositories/student.repository.js";
import UserRepository from "../repositories/users.repository.js";


export default class StudentController {
    constructor() {
        this.studentRepository = new StudentRepository();
        this.userRepository = new UserRepository();
        this.parentRepository = new ParentRepository();
        this.attendanceRepository = new AttendanceRepository();
    }

    //Create a  new Student
    async createStudent(req, res) {
        try {
            const studentData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // console.log("Student Data: ", studentData);
            const userStudentData = {
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                fullName: studentData.firstName + " " + studentData.lastName,
                email: studentData.email,
                phone: studentData.phon,
                role: "student",
                profileModel: "Student",
                password: studentData.password,
                address: studentData.address,
                dob: studentData.dateOfBirth,
                gender: studentData.gender,
                schoolId: decoded.schoolId,
                medicalInfo: studentData.medicalInfo,
                additionalNotes: studentData.additionalNotes,
            }
            const user = await this.userRepository.createUser(userStudentData);
            if (!user) {
                return res.status(400).json({ message: "Failed to create User for Student" });
            }
            const parentUserData = {
                firstName: studentData.parentDetails.fatherFirstName,
                lastName: studentData.parentDetails.fatherLastName,
                fullName: studentData.parentDetails.fatherFirstName + " " + studentData.parentDetails.fatherLastName,
                email: studentData.parentDetails.parentEmail,
                phone: studentData.parentDetails.fatherPhone,
                role: "parent",
                profileModel: "Parent",
                password: studentData.parentDetails.parentPassword,
                address: studentData.parmenantAddress || studentData.address,
                gender: studentData.parentDetails.gender,
                schoolId: decoded.schoolId,
            }

            const parent = await this.userRepository.createUser(parentUserData);
            if (!parent) {
                return res.status(400).json({ message: "Failed to create User for Parent" });
            }

            const parentData = {
                userId: parent._id,
                motherName: studentData.parentDetails.motherName,
                motherOccupation: studentData.parentDetails.motherOccupation,
                fatherOccupation: studentData.parentDetails.occupation,
                alternatePhone: studentData.parentDetails.motherPhone,
                gardianFirstName: studentData.parentDetails.gardianFirstName,
                gardianLastName: studentData.parentDetails.gardianLastName,
                fullName: studentData.parentDetails.gardianFirstName + " " + studentData.parentDetails.gardianLastName,
                gardianRelation: studentData.parentDetails.gardianRelation,
                emergencyContact: studentData.parentDetails.emergencyContact,
                schoolId: decoded.schoolId,
            }

            const newParent = await this.parentRepository.createParent(parentData, decoded.schoolId, decoded.schoolName);
            if (!newParent) {
                return res.status(400).json({ message: "Failed to create Parent for Student" });
            }
            // console.log("New Parent created: ", newParent);
            // console.log("New User created for Student: ", user);
            // console.log("New User created for Parent: ", parent);
            // console.log(newParent._id);
            // console.log(studentData);
            const student = {
                userId: user._id,
                parentId: newParent._id,
                rollNumber: studentData.rollNumber,
                studentCode: "STU" + studentData.rollNumber,
                admissionNumber: studentData.admitionNumber,
                classId: studentData.class,
                sectionId: studentData.section,
                schoolId: decoded.schoolId,
                bloodGroup: studentData.bloodGroup,
                dateOfAdmission: studentData.admissionDate,
                address: studentData.address,
                phoneNumber: studentData.phone,
            }
            if (!studentData || Object.keys(studentData).length === 0) {
                return res.status(400).json({ message: "Student data is required" });
            }
            // console.log("Student before save= ", student);
            // studentData.classId = await getClassIdByName(studentData.className, decoded.schoolId, decoded.schoolName);
            // studentData.schoolId = await getSchoolIdByName(studentData.schoolName, decoded.schoolId, decoded.schoolName);
            const newStudent = await this.studentRepository.createStudent(student, decoded.schoolId, decoded.schoolName);
            if (!newStudent) {
                return res.status(400).json({ message: "Failed to create Student" });
            }
            // console.log("New Student added is ", newStudent);
            // const attendance = {
            //     studentId: newStudent._id,
            //     classId: studentData.class,
            //     sectionId: studentData.section,
            // }

            // const newStudentAttendance = await this.attendanceRepository.createAttendance(attendance, decoded.schoolId, decoded.schoolName);

            const attendance = {
                date: new Date(), // ✅ today's date
                classId: studentData.class,
                sectionId: studentData.section,
                records: [
                    {
                        studentId: newStudent._id,
                        status: "present", // or default status
                        remarks: ""
                    }
                ]
            };

            const newStudentAttendance = await this.attendanceRepository.createOrUpdateAttendance(
                attendance,
                decoded.schoolId,
                decoded.schoolName
            );

            // console.log("New Student Attendance = ", newStudentAttendance);
            res.status(201).json(newStudent);
        } catch (error) {
            console.error("Error creating Student:", error);
            res.status(500).json({ message: "Failed to create Student" });
        }
    }

    //Get All Student
    async getAllStudent(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const students = await this.studentRepository.getAllStudents(decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching Students:", error);
            res.status(500).json({ message: "Failed to fetch Students" });
        }
    }

    //Get a specific Student
    async getStudentById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const studentData = await this.studentRepository.getAStudent(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!studentData) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json(studentData);
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        }
    }

    //Update an Student Record
    async updateAStudent(req, res) {
        try {
            const studentData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedStudent = await this.studentRepository.updateAStudent(req.params.id, studentData, decoded.schoolId, decoded.schoolName);
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json(updatedStudent);
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        }
    }

    //Delete an Student Record
    async deleteStudent(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedStudent = await this.studentRepository.deleteAStudent(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedStudent.status !== "success") {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        }
    }

    // Get students by class
    async getStudentsByClass(req, res) {
        try {
            const { className } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classId = await getClassIdByName(className, decoded.schoolId, decoded.schoolName);
            if (!classId) {
                return res.status(404).json({ message: "Class not found" });
            }
            const students = await this.studentRepository.getStudentsByClass(classId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by class:", error);
            res.status(500).json({ message: "Failed to fetch students by class" });
        }
    }
    // Get students by section
    async getStudentsBySection(req, res) {
        try {
            const { sectionName } = req.params;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const sectionId = await getSectionIdByName(sectionName, decoded.schoolId, decoded.schoolName);
            if (!sectionId) {
                return res.status(404).json({ message: "Section not found" });
            }
            const students = await this.studentRepository.getStudentsBySection(sectionId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by section:", error);
            res.status(500).json({ message: "Failed to fetch students by section" });
        }
    }
    // Search students by name
    async getStudentsByName(req, res) {
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
            const students = await this.studentRepository.getStudentsByName(userId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by Name:", error);
            res.status(500).json({ message: "Failed to fetch students by Name" });
        }
    }
    // Search students by roll number
    async getStudentsByRollNumber(req, res) {
        try {
            const { rollNumber } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!rollNumber) {
                return res.status(400).json({ message: "rollNumber is required" });
            }
            const students = await this.studentRepository.getStudentsByRollNumber(rollNumber, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by RollNumber:", error);
            res.status(500).json({ message: "Failed to fetch students by RollNumber" });
        }
    }
    // Search students by class and section
    async getStudentsByClassAndSection(req, res) {
        try {
            const { className, sectionName } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const classId = await getClassIdByName(className, decoded.schoolId, decoded.schoolName);
            const sectionId = await getSectionIdByName(sectionName, decoded.schoolId, decoded.schoolName);
            if (!classId || !sectionId) {
                return res.status(400).json({ message: "Class ID and Section ID are required" });
            }
            const students = await this.studentRepository.getStudentsByClassAndSection(classId, sectionId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by Class and Section:", error);
            res.status(500).json({ message: "Failed to fetch students by Class and Section" });
        }
    }
    // Search students by Admission Number
    async getStudentsByAdmissionNumber(req, res) {
        try {
            const { admissionNumber } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!admissionNumber) {
                return res.status(400).json({ message: "Admission Number is required" });
            }
            const students = await this.studentRepository.getStudentsByAdmissionNumber(admissionNumber, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by Admission Number:", error);
            res.status(500).json({ message: "Failed to fetch students by Admission Number" });
        }
    }
    // Search students by Status
    async getStudentsByStatus(req, res) {
        try {
            const { status } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!status) {
                return res.status(400).json({ message: "Status is required" });
            }
            const students = await this.studentRepository.getStudentsByStatus(status, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by Status:", error);
            res.status(500).json({ message: "Failed to fetch students by Status" });
        }
    }
    // Search students by Gender
    async getStudentsByGender(req, res) {
        try {
            const { gender } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!gender) {
                return res.status(400).json({ message: "gender is required" });
            }
            const students = await this.studentRepository.getStudentsByGender(gender, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by gender:", error);
            res.status(500).json({ message: "Failed to fetch students by gender" });
        }
    }
    // Search students by Date Of Birth
    async getStudentsByDateOfBirth(req, res) {
        try {
            const { dateOfBirth } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!dateOfBirth) {
                return res.status(400).json({ message: "dateOfBirth is required" });
            }
            const students = await this.studentRepository.getStudentsByDateOfBirth(dateOfBirth, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by dateOfBirth:", error);
            res.status(500).json({ message: "Failed to fetch students by dateOfBirth" });
        }
    }
    // Search students by Parent
    async getStudentsByParent(req, res) {
        try {
            const { parentName } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const parent = await getParentIdByName(parentName, decoded.schoolId, decoded.schoolName);
            if (!parent) {
                return res.status(400).json({ message: "parent is required" });
            }
            const students = await this.studentRepository.getStudentsByParent(parent, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by parent:", error);
            res.status(500).json({ message: "Failed to fetch students by parent" });
        }
    }
    // Search students by School
    async getStudentsBySchool(req, res) {
        try {
            const { schoolName } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const school = await getSchoolIdByName(schoolName, decoded.schoolId, decoded.schoolName);
            if (!school) {
                return res.status(400).json({ message: "school is required" });
            }
            const students = await this.studentRepository.getStudentsBySchool(school, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by school:", error);
            res.status(500).json({ message: "Failed to fetch students by school" });
        }
    }
    // Search students by Blood Group
    async getStudentsByBloodGroup(req, res) {
        try {
            const { bloodGroup } = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!bloodGroup) {
                return res.status(400).json({ message: "blood Group is required" });
            }
            const students = await this.studentRepository.getStudentsByBloodGroup(bloodGroup, decoded.schoolId, decoded.schoolName);
            res.status(200).json(students);
        } catch (error) {
            console.error("Error fetching students by blood Group:", error);
            res.status(500).json({ message: "Failed to fetch students by blood Group" });
        }
    }

    // add Multiple Sudents
    async addMultipleStudents(req, res) {
        try {
            const token = req.headers['authorization'];
            const decoded = await getDataByToken(token);

            const students = req.body.students;

            if (!Array.isArray(students) || students.length === 0) {
                return res.status(400).json({ message: "students array is required" });
            }

            const savedStudents = [];

            for (const formData of students) {

                // 1. Prepare user data

                const userStudentData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    fullName: formData.firstName + " " + formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    role: "student",
                    profileModel: "Student",
                    password: formData.password,
                    address: formData.address,
                    dob: formData.dateOfBirth,
                    gender: formData.gender,
                    schoolId: decoded.schoolId,
                    medicalInfo: formData.parentDetailsmedicalInfo,
                    additionalNotes: formData.parentDetails.additionalNotes,
                }
                
                // const userTeacherData = {
                //     firstName: formData.firstName,
                //     lastName: formData.lastName,
                //     fullName: formData.firstName + " " + formData.lastName,
                //     email: formData.email,
                //     password: formData.password || "password123", // hash this in real app
                //     phone: formData.phone,
                //     role: "teacher",
                //     gender: formData.gender,
                //     dob: formData.dateOfBirth,
                //     address: formData.address,
                //     schoolId: decoded.schoolId,
                //     medicalInfo: formData.medicalInfo || "",
                //     additionalNotes: formData.additionalNotes || "",
                //     profileModel: "Teacher"
                // };

                // 2. Create Studentdate User
                // const newUser = await this.userRepository.createUser(userStudentData, decoded.schoolId, decoded.schoolName);
                
                const studentUser = await this.userRepository.createUser(userStudentData);
                if (!studentUser) {
                    return res.status(400).json({ message: "Failed to create User for Student" });
                }
                // 3. Create parentData User

                const parentUserData = {
                firstName: formData.parentDetails.fatherFirstName,
                lastName: formData.parentDetails.fatherLastName,
                fullName: formData.parentDetails.fatherFirstName + " " + formData.parentDetails.fatherLastName,
                email: formData.parentDetails.parentEmail,
                phone: formData.parentDetails.fatherPhone,
                role: "parent",
                profileModel: "Parent",
                password: formData.parentDetails.parentPassword,
                address: formData.parmenantAddress || formData.address,
                gender: "male",
                schoolId: decoded.schoolId,
            }

            const parentUser = await this.userRepository.createUser(parentUserData);
            if (!parentUser) {
                return res.status(400).json({ message: "Failed to create User for Parent" });
            }

                // 3. Prepare Parent data

                const parentData = {
                userId: parentUser._id,
                motherName: formData.parentDetails.motherName,
                motherOccupation: formData.parentDetails.motherOccupation,
                fatherOccupation: formData.parentDetails.fatherOccupation,
                alternatePhone: formData.parentDetails.motherPhone,
                gardianFirstName: formData.parentDetails.gardianFirstName,
                gardianLastName: formData.parentDetails.gardianLastName,
                fullName: formData.parentDetails.gardianFirstName + " " + formData.parentDetails.gardianLastName,
                gardianRelation: formData.parentDetails.gardianRelation,
                emergencyContact: formData.parentDetails.gardianPhone,
                schoolId: decoded.schoolId,
            }

            const newParent = await this.parentRepository.createParent(parentData, decoded.schoolId, decoded.schoolName);
            if (!newParent) {
                return res.status(400).json({ message: "Failed to create Parent for Student" });
            }

                // const teacherData = {
                //     userId: newUser._id,
                //     employeeCode: formData.employeeCode,
                //     designation: formData.designation,
                //     department: formData.department,
                //     experience: formData.experience,
                //     qualification: formData.qualification,
                //     joiningDate: formData.joiningDate,
                //     salary: formData.salary,
                //     subjects: formData.subjects,
                //     classId: formData.classId,
                //     sectionId: formData.sectionId,
                //     emergencyContactName: formData.emergencyContactName,
                //     emergencyContactNumber: formData.emergencyContactNumber,
                //     emergencyContactRelation: formData.emergencyContactRelation,
                //     status: formData.status || "active",
                //     schoolId: decoded.schoolId
                // };

                // 4. Create Teacher entry
                // const newTeacher = await this.teacherRepository.createTeacher(teacherData, decoded.schoolId, decoded.schoolName);

                // 5. Create StaffSalary entry
                
                const student = {
                userId: studentUser._id,
                parentId: newParent._id,
                rollNumber: formData.rollNumber,
                studentCode: "STU" + formData.rollNumber || formData.studentCode,
                admissionNumber: formData.admitionNumber,
                classId: formData.class,
                sectionId: formData.section,
                schoolId: decoded.schoolId,
                bloodGroup: formData.bloodGroup,
                dateOfAdmission: formData.admissionDate,
                address: formData.address,
                phoneNumber: formData.phone,
            }
            if (!formData || Object.keys(formData).length === 0) {
                return res.status(400).json({ message: "Student data is required" });
            }
            console.log("Student before save= ", student);
            // formData.classId = await getClassIdByName(formData.className, decoded.schoolId, decoded.schoolName);
            // formData.schoolId = await getSchoolIdByName(formData.schoolName, decoded.schoolId, decoded.schoolName);
            const newStudent = await this.studentRepository.createStudent(student, decoded.schoolId, decoded.schoolName);
            if (!newStudent) {
                return res.status(400).json({ message: "Failed to create Student" });
            }


                // const staffSalaryData = {
                //     staffId: newTeacher._id,
                //     basicSalary: formData.salary || 0,
                //     allowances: 0,
                //     deductions: 0,
                //     netSalary: formData.salary || 0,
                //     status: "pending",
                //     schoolId: decoded.schoolId
                // };

                // const newStaffSalary = await this.staffSalaryRepository.createStaffSalary(staffSalaryData, decoded.schoolId, decoded.schoolName);
                

            const attendance = {
                date: new Date(), // ✅ today's date
                classId: formData.class,
                sectionId: formData.section,
                records: [
                    {
                        studentId: newStudent._id,
                        status: "present", // or default status
                        remarks: ""
                    }
                ]
            };

            const newStudentAttendance = await this.attendanceRepository.createOrUpdateAttendance(
                attendance,
                decoded.schoolId,
                decoded.schoolName
            );
                // 6. Add references to savedStudents
                savedStudents.push({
                    ...newParent.toObject(),
                    ...newStudent.toObject(),
                    studentUser: studentUser._id,
                    parentUser: parentUser._id,
                    newStudentAttendance: newStudentAttendance._id
                });
            }

            return res.status(201).json({
                message: "students added successfully",
                data: savedStudents
            });
        } catch (error) {
            console.error("Error adding students:", error);
            return res.status(500).json({ message: error.message });
        }
    }

    // ..Get Student by UserId
    async getStudentByUserId(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const studentData = await this.studentRepository.getStudentByUserId(req.params.userId, decoded.schoolId, decoded.schoolName);
            if (!studentData) {
                return res.status(404).json({ message: "Student not found" });
            }
            console.log("studentData = ",studentData)
            res.status(200).json(studentData);
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        }
    }

     // ..Get Children by ParentId
    async getChildrenByParentId(req, res){
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const childrenData = await this.studentRepository.getChildrenByParentId(req.params.parentId, decoded.schoolId, decoded.schoolName);
            if (!childrenData) {
                return res.status(404).json({ message: "Children not found" });
            }
            console.log("childrenData = ",childrenData)

            res.status(200).json(childrenData);
        } catch (error) {
            console.error("Error fetching Children:", error);
            res.status(500).json({ message: "Failed to fetch Children" });
        }
    }
}
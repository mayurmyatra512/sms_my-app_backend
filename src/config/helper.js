import { getStudentModel } from "../repositories/student.repository.js";
import { getTeacherModel } from "../repositories/teacher.repository.js";
import { getClassModel } from "../repositories/class.repository.js";
import { ObjectId } from "mongodb";

export const getStudentIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        const StudentModel = await getStudentModel(companyId, companyName);
        const studentId = await StudentModel.findOne({ name: name }).select('_id');
        if (!studentId) {
            throw new Error("Student not found");
        }
        return studentId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getStudentIdByFullName = async (fullName, companyId, companyName) => {
    try {
        // Your logic here
        const StudentModel = await getStudentModel(companyId, companyName);
        const userId = await UserModel.findOne({ fullName: fullName }).select('_id');
        console.log("UserId = ",userId);
        const studentId = await StudentModel.findOne({userId: userId}).select('_id');
        if (!studentId) {
            throw new Error("Student not found");
        }
        return studentId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getTeacherIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        const TeacherModel = await getTeacherModel(companyId, companyName);
        const teacherId = await TeacherModel.findOne({ name: name }).select('_id');
        if (!teacherId) {
            throw new Error("Teacher not found");
        }
        return teacherId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getSubjectIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        console.log("name = ", name)
        const SubjectModel = await getSubjectModel(companyId, companyName);
        const subjectId = await SubjectModel.findOne({ name: name }).select('_id');
        if (!subjectId) {
            throw new Error("Subject not found");
        }
        return subjectId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getSubjectIdByCode = async (codes, companyId, companyName) => {
    try {
        console.log("Code = ", codes);
        if (!codes) {
            throw new Error("No subject codes provided");
        }

        const SubjectModel = await getSubjectModel(companyId, companyName);

        // If multiple codes (comma separated)
        if (codes.includes(",")) {
            const codeArr = codes
                .split(",")
                .map(c => c)
                .filter(Boolean);

            const subjects = await SubjectModel.find({ code: { $in: codeArr } }).select("_id code");

            if (!subjects.length) {
                throw new Error("No subjects found for provided codes");
            }

            // return array of subjectIds
            return subjects.map(s => s._id);
        } else {
            // Single subject
            const subject = await SubjectModel.findOne({ code: codes }).select("_id");
            if (!subject) {
                throw new Error(`Subject not found for code: ${codes}`);
            }
            return subject._id;
        }
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getClassIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        console.log("Class name = ", name, companyId, companyName)
        const ClassModel = await getClassModel(companyId, companyName);
        console.log(name, companyId, companyName)
        const classId = await ClassModel.findOne({ name: name }).select('_id');
        if (!classId) {
            throw new Error("Class not found");
        }
        console.log("ClassID = ", classId)
        return classId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getExamIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        const ExamModel = await getExamModel(companyId, companyName);
        const examId = await ExamModel.findOne({ name: name }).select('_id');
        if (!examId) {
            throw new Error("Exam not found");
        }
        return examId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}
export const getSectionIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        const sectionModel = await getSectionModel(companyId, companyName);
        const sectionId = await sectionModel.findOne({ name: name }).select('_id');
        if (!sectionId) {
            throw new Error("Exam not found");
        }
        return sectionId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getCourseIdByName = async (name, companyId, companyName) => {
    try {
        // Your logic here
        const courseModel = await getCoursesModel(companyId, companyName);
        const courseId = await courseModel.findOne({ name: name }).select('_id');
        if (!courseId) {
            throw new Error("Exam not found");
        }
        return courseId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getSubjectIdByCourse = async (code, companyId, companyName) => {
    try {
        // Your logic here
        const SubjectModel = await getSubjectModel(companyId, companyName);
        const subjectId = await SubjectModel.findOne({ code: code }).select('_id');
        if (!subjectId) {
            throw new Error("Subject Code not found");
        }
        return subjectId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}



import mongoose from "mongoose";
import schoolSchema from "../models/schools.schema.js";
import userSchema from "../models/user.schema.js";
import { getSubjectModel } from "../repositories/subject.repository.js";
import { getExamModel } from "../repositories/exam.repository.js";
import { getSectionModel } from "../repositories/section.repository.js";
import { getCoursesModel } from "../repositories/courses.repository.js";
import { getExamResultModel } from "../repositories/examResult.repository.js";
import Counter from "../models/counter.schema.js";

export const SchoolModel = mongoose.model("School", schoolSchema, "schools");
export const UserModel = mongoose.model("User", userSchema, "users");

export const getSchoolIdByName = async (name) => {
    try {
        console.log("School name = ", name)
        const schoolId = await SchoolModel.findOne({ name: name }).select('_id');
        if (!schoolId) {
            throw new Error("School not found");
        }
        return schoolId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getUserIdByEmail = async (email) => {
    try {
        const userId = await UserModel.findOne({ email: email }).select('_id');
        if (!userId) {
            throw new Error("User not found");
        }
        return userId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getParentIdByName = async (name, role) => {
    try {
        const parentId = await UserModel.findOne({ name: name, role: role }).select('_id');
        if (!parentId) {
            throw new Error("Parent not found");
        }
        return parentId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getStaffIdByName = async (name, role) => {
    try {
        const staffId = await UserModel.findOne({ name: name, role: role }).select('_id');
        if (!staffId) {
            throw new Error("Staff not found");
        }
        return staffId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getUserIdByName = async (name, companyId, companyName) => {
    try {
        // const UserModel = await getUserModel(companyId, companyName);
        const userId = await UserModel.findOne({ fullName: name }).select('_id');
        if (!userId) {
            throw new Error("User not found");
        }
        return userId;
    } catch (error) {
        console.error("Error in helper function:", error);
        throw error;
    }
}

export const getTotalStudentsByTeacher = async (teacherId, subjectId, classId, companyId, companyName) => {
    try {

        const Teacher = await getTeacherModel(companyId, companyName);
        const Subject = await getSubjectModel(companyId, companyName);
        const Student = await getStudentModel(companyId, companyName);
        // Step 1: Find teacher
        const teacher = await Teacher.findById(teacherId).populate("subjectId").populate("classId");
        //  console.log({teacherId, subjectId, classId, companyId, companyName})
        if (!teacher) {
            throw new Error("Teacher not found");
        }

        // Step 2: Check if teacher actually teaches this subject & class
        if (!teacher.subjectId.some(sub => sub._id.toString() === subjectId.toString())) {
            throw new Error("This teacher does not teach the given subject");
        }
        if (!teacher.classId.some(cls => cls._id.toString() === classId.toString())) {
            throw new Error("This teacher is not assigned to the given class");
        }

        // Step 3: Count students in that class
        const totalStudents = await Student.countDocuments({
            classId: classId,
            status: "active"
        });

        return totalStudents;
    } catch (err) {
        console.error("Error finding students by teacher:", err);
        throw err;
    }
};

export const getTeacherAveragePerformance = async (teacherId, companyId, companyName) => {
    try {

        const ExamResult = await getExamResultModel(companyId, companyName);
        // Find all exam results for this teacher
        const results = await ExamResult.find({ "subjects.teacherId": teacherId });

        if (!results.length) return 0;

        let totalObtained = 0;
        let totalMarks = 0;

        // Aggregate marks from all subjects taught by teacher
        results.forEach((exam) => {
            exam.subjects.forEach((sub) => {
                if (sub.teacherId.toString() === teacherId.toString()) {
                    totalObtained += sub.marksObtained;
                    totalMarks += sub.totalMarks;
                }
            });
        });

        if (totalMarks === 0) return 0;

        // Return percentage performance
        return (totalObtained / totalMarks) * 100;
    } catch (err) {
        console.error("Error calculating teacher average performance:", err);
        throw err;
    }
};

export const getTotalStudentsByPerformance = async(
    teacherId,
    performanceKey,
    classIds,
    schoolId,
    schoolName
) => {
    // Map performance categories to grades
    const performanceMap = {
        excellent: ["A+", "A"],
        good: ["B+", "B"],
        average: ["C"],
        needsImprovement: ["D", "F"],
    };

    const grades = performanceMap[performanceKey] || [];

    if (!classIds || classIds.length === 0 || grades.length === 0) return 0;

    // Get ExamResults model dynamically per school
    const ExamResult = await getExamResultModel(schoolId, schoolName);

    // Count unique students for the teacher and performance category
    const results = await ExamResult.aggregate([
        { $unwind: "$subjects" },
        {
            $match: {
                "subjects.teacherId": new ObjectId(teacherId),
                classId: { $in: classIds.map((id) => new ObjectId(id)) },
                "subjects.grade": { $in: grades },
            },
        },
        {
            $group: {
                _id: "$studentId", // unique student
            },
        },
        { $count: "total" },
    ]);

    return results[0]?.total || 0;
}


//  +=================================== Create RecieptNumber =++++++++++++++++++++++++++++++++++++ 

async function getNextSequence(tenantId, counterName) {
  const counter = await Counter.findOneAndUpdate(
    { tenantId, name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}

export const generateReceiptNumber = async (schoolCode, tenantId) => {
  const seq = await getNextSequence(tenantId, "receipt");

  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const sequence = String(seq).padStart(4, "0");

  return `REC-${datePart}-${sequence}`;
}
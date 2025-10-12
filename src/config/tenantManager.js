import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

import attendanceSchema from "../models/attendance.schema.js";
import classSchema from "../models/class.schema.js";
import examSchema from "../models/exam.schema.js";
import examResultSchema from "../models/examResult.schema.js";
import feeSchema from "../models/feeModel.schema.js";
import staffSalarySchema from "../models/staffSalary.schema.js";
import studentSchema from "../models/student.schema.js";
import subjectSchema from "../models/subject.schema.js";
import teacherSchema from "../models/teacher.schema.js";
import userSchema from "../models/user.schema.js";
import timetableSchema from "../models/timetable.schema.js";
import schoolSchema from "../models/schools.schema.js";
import sectionSchema from "../models/section.schema.js";
import parentSchema from "../models/parent.schema.js";
import applicationSchema from "../models/application.schema.js";
import studentFeesSchema from "../models/studFees.schema.js";
import departmentSchema from "../models/departments.schema.js";
// Dynamically create a database for a school and register its schemas
import { getDbConnection } from "./mongodbconnection.js";
import AssignmentSchema from "../models/assignment.schema.js";

export function registerMasterSchemas() {
    // Only create User and School models in the master DB
    mongoose.model("User", userSchema, "users");
    mongoose.model("School", schoolSchema, "schools");
}

// Register all schemas for a school database
export function registerSchoolSchemas(dbConnection) {
    try {
     dbConnection.model("Attendance", attendanceSchema, "attendances");
    dbConnection.model("Class", classSchema, "classes");
    dbConnection.model("Exam", examSchema, "exams");
    dbConnection.model("ExamResult", examResultSchema, "examresults");
    dbConnection.model("Fee", feeSchema, "fees");

    dbConnection.model("StudentFee", studentFeesSchema, "studentFees");
    dbConnection.model("StaffSalary", staffSalarySchema, "staffSalaries");
    dbConnection.model("Student", studentSchema, "students");
    dbConnection.model("Subject", subjectSchema, "subjects");
    dbConnection.model("Section", sectionSchema, "sections");
    dbConnection.model("Teacher", teacherSchema, "teachers");
    dbConnection.model("Timetable", timetableSchema, "timetables"); 
    dbConnection.model("Expense", examResultSchema, "expenses"); 
    dbConnection.model("Parent", parentSchema, "parents");
    dbConnection.model("Application", applicationSchema, "applications");
    dbConnection.model("Department", departmentSchema, "departments");
    dbConnection.model("Assignment", AssignmentSchema, "assignments");

    } catch (error) {
        console.log("registerSchoolSchemas = ",error)
    }

}




export async function dbName(schoolName, id) {
    // console.log(`Using SchoolId: ${id}, SchoolName: ${schoolName}`);
    let school = schoolName ? schoolName.toLowerCase().replace(/\s+/g, "").slice(0, 10)  : "school";
    return `${school}_${id}`;
}

// Ensure the school database is created and schemas are registered
export async function createSchoolDatabase(schoolData) {
    try {
        // console.log("SchoolData = ",schoolData);
        // console.log("Name = ",schoolData.name);

        if (!schoolData.name) {
            throw new Error("Invalid school data provided");
        }
        const db = await dbName(schoolData.name, schoolData._id || uuidv4());
        const dbConnection = getDbConnection(db);
        // console.log("DB = ", db)
        // console.log("DB Connection = ", dbConnection)

        const resp = registerSchoolSchemas(dbConnection);
        // Optionally, you can create a dummy document to ensure collections are created
        await dbConnection.model("Class").create({ name: "InitClass" });
        // Remove the dummy document if needed
        await dbConnection.model("Class").deleteOne({ name: "InitClass" });
        return resp;
    } catch (error) {
        console.log("Error in create Database = ", error)
        return error
    }

}
import mongoose from "mongoose";
import classSchema from "../models/class.schema.js";
import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import teacherSchema from "../models/teacher.schema.js";

// const ClassModel = mongoose.model("Class", classSchema, "classs");

// get a class Database Model
export const getClassModel = async (companyId, companyName) => {
    try {
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Teacher", teacherSchema, "teachers");
        return schoolDb.model(`Class`, classSchema, `classes`);
    } catch (error) {
        console.error("Error getting class model:", error);
        throw new Error("Failed to get class model");
    }
}

export default class ClassRepository {
    // Create a new Class record
    async createClass(data, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            // Create a new class instance
            const classInstance = new ClassModel(data);
            return await classInstance.save();
        } catch (error) {
            console.error("Error creating Class:", error);
            throw new Error("Failed to create Class");
        }
    }

    // Get all Classs
    async getAllClasss(companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.find();
        } catch (error) {
            console.error("Error fetching Classs:", error);
            throw new Error("Failed to fetch Classs");
        }
    }

    // Get a Class by ID
    async getAClass(id, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.findById(id);
        } catch (error) {
            console.error("Error fetching Class by ID:", error);
            throw new Error("Failed to fetch Class");
        }
    }

    // Update a Class by ID
    async updateAClass(id, data, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating Class by ID:", error);
            throw new Error("Failed to update Class");
        }
    }
    // Delete a Class by ID
    async deleteAClass(id, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting Class by ID:", error);
            throw new Error("Failed to delete Class");
        }
    }
    // Get classes by teacher ID
    async getClassesByTeacherId(teacherId, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.find({ teacherId: teacherId });
        } catch (error) {
            console.error("Error fetching classes by teacher ID:", error);
            throw new Error("Failed to fetch classes by teacher ID");
        }
    }
    // Get classes by student ID
    async getClassesByStudentId(studentId, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.find({ studentId: studentId });
        } catch (error) {
            console.error("Error fetching classes by student ID:", error);
            throw new Error("Failed to fetch classes by student ID");
        }
    }
    // Get classes by subject ID
    async getClassesBySubjectId(subjectId, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.find({ subjectId: subjectId });
        } catch (error) {
            console.error("Error fetching classes by subject ID:", error);
            throw new Error("Failed to fetch classes by subject ID");
        }
    }
    // Get classes by date
    async getClassesByDate(date, companyId, companyName) {
        try {
            const ClassModel = await getClassModel(companyId, companyName);
            if (!ClassModel) throw new Error("Class model not found");
            return await ClassModel.find({ date: date });
        } catch (error) {
            console.error("Error fetching classes by date:", error);
            throw new Error("Failed to fetch classes by date");
        }

    }

     //add Classes
        async addClasses(classes, companyId, companyName) {
            try {
                // insertMany handles bulk insert
                const ClassModel = await getClassModel(companyId, companyName);
                if (!ClassModel) throw new Error("Subject model not found");
                const savedSubjects = await ClassModel.insertMany(classes, { ordered: false });
                return savedSubjects;
            } catch (error) {
                throw new Error("Error adding classes: " + error.message);
            }
        }

    // update a Section
     // ✅ Add a new section into existing class
  async addSection(classId, newSection, companyId, companyName) {
    try {
        const ClassModel = await getClassModel(companyId, companyName);
                if (!ClassModel) throw new Error("Subject model not found");
      const updatedClass = await ClassModel.findByIdAndUpdate(
        classId,
        { $addToSet: { section: newSection } }, // avoids duplicates
        { new: true }
      );
      return updatedClass;
    } catch (error) {
      throw new Error("Error adding section: " + error.message);
    }
  }

   // ✅ Remove a section from class
  async removeSection(classId, sectionName, companyId, companyName) {
    try {
         const ClassModel = await getClassModel(companyId, companyName);
                if (!ClassModel) throw new Error("Subject model not found");
      const updatedClass = await ClassModel.findByIdAndUpdate(
        classId,
        { $pull: { section: sectionName } },
        { new: true }
      );
      return updatedClass;
    } catch (error) {
      throw new Error("Error removing section: " + error.message);
    }
  }

   // ✅ Replace all sections with a new list
  async updateSections(classId, newSections, companyId, companyName) {
    try {
         const ClassModel = await getClassModel(companyId, companyName);
                if (!ClassModel) throw new Error("Subject model not found");
      const updatedClass = await ClassModel.findByIdAndUpdate(
        classId,
        { section: newSections },
        { new: true }
      );
      return updatedClass;
    } catch (error) {
      throw new Error("Error updating sections: " + error.message);
    }
  }
}
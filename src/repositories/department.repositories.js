import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import departmentSchema from "../models/departments.schema.js";

// Dynamically get Department model from tenant DB
export const getDepartmentModel = async (companyId, companyName) => {
  try {
    // console.log("Name = ", companyName, "Id = ", companyId);
    const db = await dbName(companyName, companyId)
    const departmentDb = getDbConnection(db);
    if (!departmentDb) {
      console.error("Failed to connect to school database");
      throw new Error("Failed to connect to school database");
    }
    // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
    return departmentDb.model(`Departments`, departmentSchema, `departments`);
  } catch (error) {
    console.error("Error getting departments model:", error);
    throw new Error("Failed to get departments model");
  }
};


export class DepartmentRepository {
  static async createDepartment(companyId, companyName, data) {
    const DepartmentModel = await getDepartmentModel(companyId, companyName);
    return await DepartmentModel.create(data);
  }

  static async getAllDepartments(companyId, companyName) {
    const DepartmentModel = await getDepartmentModel(companyId, companyName);
    return await DepartmentModel.find().lean();
  }

  static async getDepartmentById(companyId, companyName, deptId) {
    const DepartmentModel = await getDepartmentModel(companyId, companyName);
    return await DepartmentModel.findById(deptId).lean();
  }

  static async updateDepartment(companyId, companyName, deptId, updateData) {
    const DepartmentModel = await getDepartmentModel(companyId, companyName);
    return await DepartmentModel.findByIdAndUpdate(deptId, updateData, {
      new: true,
    });
  }

  static async deleteDepartment(companyId, companyName, deptId) {
    const DepartmentModel = await getDepartmentModel(companyId, companyName);
    return await DepartmentModel.findByIdAndDelete(deptId);
  }

  //add Departments
  static async addDepartments(departments, companyId, companyName) {
    try {
      // insertMany handles bulk insert
      const DepartmentModel = await getDepartmentModel(companyId, companyName);
      if (!DepartmentModel) throw new Error("Department model not found");
      const savedDepartments = await DepartmentModel.insertMany(departments, { ordered: false });
      return savedDepartments;
    } catch (error) {
      throw new Error("Error adding departments: " + error.message);
    }
  }
}

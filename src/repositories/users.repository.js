import mongoose, { get } from "mongoose";
import userSchema from "../models/user.schema.js";
import { comparePassword } from "../config/jwtops.js";

const UserModel = mongoose.model("User", userSchema, "users");

export default class UserRepository {
    // Create a new user
     async createUser(data){
        try {
            const user = new UserModel(data);
            // user.schoolId = await getSchoolIdByName(data.schoolName);
            return await user.save();
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");          
        }
    }

     async loginUser(credentials){
        try {
            const user = await UserModel.findOne({ email: credentials.email });
            if (!user) throw new Error("User not found");
            console.log(user);
            const isMatch = await comparePassword(credentials.password, user.password);
            if (!isMatch) throw new Error("Invalid password");
            
            return user;
        } catch (error) {
            console.error("Error logging in user:", error);
            throw new Error("Failed to log in user");
        }
    }

    // Get all users
     async getAllUsers(){
        try {
            return await UserModel.find();
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users");
        }
    }

    // Get a user by ID
     async getAUser(id){
        try {
            return await UserModel.findById(id);
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error("Failed to fetch user");
        }
    }

     // Update a user by ID
     async updateAUser(id, data){
        try {
            return await UserModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error("Error updating user by ID:", error);
            throw new Error("Failed to update user");
        }
    }
    // Delete a user by ID
     async deleteAUser(id){
        try {
            return await UserModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error deleting user by ID:", error);
            throw new Error("Failed to delete user");
        }
    }
    // Get All Teachers
     async getAllTeachers(schoolId, schoolName){
        try {
            return await UserModel.find({ role: "teacher", schoolId: schoolId });
        } catch (error) {
            console.error("Error fetching teachers:", error);
            throw new Error("Failed to fetch teachers");
        }
    }
    // Get All Students
     async getAllStudents(schoolId, schoolName){
        try {
            return await UserModel.find({ role: "student", schoolId: schoolId });
        } catch (error) {
            console.error("Error fetching students:", error);
            throw new Error("Failed to fetch students");
        }
    }
    // Get All Parents
    async getAllParents(schoolId, schoolName){
        try {
            return await UserModel.find({ role: "parent", schoolId: schoolId });
        } catch (error) {
            console.error("Error fetching parents:", error);
            throw new Error("Failed to fetch parents");
        }
    }
    // Get All Admins
    async getAllAdmins(schoolId, schoolName){
        try {
            return await UserModel.find({ role: "admin", schoolId: schoolId });
        } catch (error) {
            console.error("Error fetching admins:", error);
            throw new Error("Failed to fetch admins");
        }
    }
}
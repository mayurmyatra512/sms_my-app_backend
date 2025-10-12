import { getSchoolIdByName } from "../config/helper.js";
import { generateToken, getDataByToken } from "../config/jwtops.js";
import SchoolRepository from "../repositories/schools.repository.js";
import UserRepository from "../repositories/users.repository.js";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
        this.schoolRepository = new SchoolRepository();
    }

    // Create a new User
     async signup(req, res) {
        try {
            const userData = req.body;
            console.log("User Data = ", userData);
            userData.schoolId = await getSchoolIdByName(userData.schoolName);
            const newUser = await this.userRepository.createUser(userData);
            if (!newUser) {
                return res.status(400).json({ message: "Failed to create User" });
            }
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error creating User:", error);
            res.status(500).json({ message: "Failed to create User" });
        }
    }

    //Get All Users
     async getAllUsers(req, res) {
        try {
            const users = await this.userRepository.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error in Get all Users:", error);
            res.status(500).json({ message: "Failed to Get All Users" });
        }
    }

    //Get a specific User
     async getUserById(req, res) {
        try {
            const user = await this.userRepository.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("Error in Get a User:", error);
            res.status(500).json({ message: "Failed to Get a User" });
        }
    }

    //Update a User Record
     async updateUser(req, res) {
        try {
            const userData = req.body;
            userData.schoolId = await getSchoolIdByName(userData.schoolName, req.params.companyId, req.params.companyName);
            if (!userData.schoolId) {
                return res.status(400).json({ message: "Invalid school name" });
            }
            const updatedUser = await this.userRepository.updateUser(req.params.id, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Error in Update a User:", error);
            res.status(500).json({ message: "Failed to Update a User" });
        }
    }

    //Delete a User Record
     async deleteUser(req, res) {
        try {
            const deletedUser = await this.userRepository.deleteUser(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error in Delete a User:", error);
            res.status(500).json({ message: "Failed to Delete a User" });
        }
    }

    // Login User
     async loginUser(req, res) {
        try {
            const credentials = req.body;
            console.log(credentials);
            const user = await this.userRepository.loginUser(credentials);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const school = await this.schoolRepository.getSchoolById(user.schoolId);
            // Optionally, you can generate a token here and return it
            const token = generateToken(user, school);
            if (!token) {
                return res.status(500).json({ message: "Failed to generate token" });
            }
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                // secure: true, // Uncomment if using HTTPS
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(200).json({ school, user, token });
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({ message: "Failed to log in user" });
        }
    }

    // Logout User
     async logoutUser(req, res) {
        try {
            res.clearCookie('token');
            res.status(200).json({ message: "User logged out successfully" });
        } catch (error) {
            console.error("Error logging out user:", error);
            res.status(500).json({ message: "Failed to log out user" });
        }
    }

        //Get All Teachers
     async getAllTeachers(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const users = await this.userRepository.getAllTeachers(decoded.schoolId, decoded.schoolName);
            res.status(200).json(users);
        } catch (error) {
            console.error("Error in Get all Teachers:", error);
            res.status(500).json({ message: "Failed to Get All Teachers" });
        }
    }

      //Get All Students
     async getAllStudents(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const users = await this.userRepository.getAllStudents(decoded.schoolId, decoded.schoolName);
            res.status(200).json(users);
        } catch (error) {
            console.error("Error in Get all Students:", error);
            res.status(500).json({ message: "Failed to Get All Students" });
        }
    }
          //Get All Parents
     async getAllParents(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const users = await this.userRepository.getAllParents(decoded.schoolId, decoded.schoolName);
            res.status(200).json(users);
        } catch (error) {
            console.error("Error in Get all Parents:", error);
            res.status(500).json({ message: "Failed to Get All Parents" });
        }
    }
    //Get All Admins
     async getAllAdmins(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const users = await this.userRepository.getAllAdmins(decoded.schoolId, decoded.schoolName);
            res.status(200).json(users);
        } catch (error) {
            console.error("Error in Get all Admins:", error);
            res.status(500).json({ message: "Failed to Get All Admins" });
        }
    }
}
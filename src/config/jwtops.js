import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user, school)=> {
  // const fullname = user.firstName + ' ' + user.lastName;
  console.log("User = ", user);
  console.log("School = ", school);
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.fullname, schoolName: school.name, schoolCode: school.code, schoolId: school._id}, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  return token;
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const getUserByToken = async (token)=> {
    const decoded = await getDataByToken(token);
    return mongoose.model("User").findById(decoded.id).exec();
};

export const getDataByToken = async (token) => {
  const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
        throw new Error("Invalid token");
    }
    console.log(decoded);
    return decoded;
}

// export const getTokenFromHeader = async (req) => {
//   try {
//     const authHeader = req.headers['authorization']
//     if (!authHeader) return null;

//   } catch (error) {
    
//   }
// }




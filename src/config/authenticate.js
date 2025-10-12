import { verifyToken } from "./jwtops.js";

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1];
    // console.log("Token in authenticate = ", token)
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    req.userId = decoded.id;
    req.schoolName = decoded.schoolName;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

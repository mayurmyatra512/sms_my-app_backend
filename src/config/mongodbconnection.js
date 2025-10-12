

import mongoose from "mongoose";
import { registerMasterSchemas } from "./tenantManager.js";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Helper to ensure URI does not have a trailing database name
function buildMongoUri(baseUri, dbName) {
    // Remove any trailing database name from URI
    const uri = baseUri.replace(/\/[A-Za-z0-9_-]+$/, "/");
    return uri.endsWith("/") ? uri + dbName : uri + "/" + dbName;
}

// Connect to the master database
const connectToMongoDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB || "masterdb";
        uri = buildMongoUri(uri, dbName);
        // console.log("MongoDB URI used for connection:", uri);
        // console.log(`Connecting to MongoDB master database: ${dbName} at ${uri}`);
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        // console.log(`Connected to MongoDB master database: ${dbName}`);
        registerMasterSchemas();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

// Get a connection to a different database on the same cluster

export const getDbConnection = (dbName) => {
    return mongoose.connection.useDb(dbName, { useCache: true });
};

// Dynamically create and register schemas for a school database
// import { registerSchoolSchemas } from "./tenantManager.js";
// export async function createSchoolDatabase(schoolName) {
//     const dbConnection = getDbConnection(schoolName);
//     registerSchoolSchemas(dbConnection);
//     // Optionally, create a dummy document to ensure collections are created
//     await dbConnection.model("Class").create({ name: "InitClass" });
//     await dbConnection.model("Class").deleteOne({ name: "InitClass" });
//     return dbConnection;
// }

export default connectToMongoDB;
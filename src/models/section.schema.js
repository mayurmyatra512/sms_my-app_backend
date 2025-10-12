import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    secTeacherId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    name: { 
        type: String, 
        required: true,
    },
    classId: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", // reference to Class collection
        model:"Class",
        required: true,
      },
      name: {
        type: String, // class name stored alongside
        required: true,
      },
    },
    capacity:{
        type:Number
    },
    schoolId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "School" 
    }
});

export default sectionSchema;
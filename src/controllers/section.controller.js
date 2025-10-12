import { getClassIdByName, getSchoolIdByName, getStaffIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import ClassRepository from "../repositories/class.repository.js";
import SectionRepository from "../repositories/section.repository.js";

export default class SectionController {
    constructor() {
        this.sectionRepository = new SectionRepository();
        this.classRepository = new ClassRepository();
    }
    //Create a  new Section
     async createSection(req, res) {
        try {
            const sectionData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // sectionData.secTeacherId = await getClassIdByName(sectionData.class, decoded.schoolId, decoded.schoolName);
            const cls = await this.classRepository.getAClass(sectionData.class, decoded.schoolId, decoded.schoolName);
            
            sectionData.classId = {
                _id: sectionData.class,
                name: cls.name
            }
            sectionData.schoolId = decoded.schoolId;
            const addSection = await this.sectionRepository.createSection(sectionData, decoded.schoolId, decoded.schoolName);
            const newSection = await this.classRepository.addSection(cls._id, sectionData.name, decoded.schoolId, decoded.schoolName);
            if (!newSection) {
                return res.status(400).json({ message: "Failed to create Section" });
            }
            // console.log(newSection);
            res.status(201).json(addSection);
        } catch (error) {
            console.error("Error creating Section:", error);
            res.status(500).json({ message: "Failed to create Section" });
        }
    }

    //Get All Section
     async getAllSections(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const sections = await this.sectionRepository.getAllSections(decoded.schoolId, decoded.schoolName);

            console.log("Section Rooms = ", sections);
            res.status(200).json(sections);
        } catch (error) {
            console.error("Error fetching sections:", error);
            res.status(500).json({ message: "Failed to fetch sections" });
        }
    }

    //Get a specific Section
     async getSectionById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const sectionData = await this.sectionRepository.getASection(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!sectionData) {
                return res.status(404).json({ message: "Section not found" });
            }
            res.status(200).json(sectionData);
        } catch (error) {
            console.error("Error fetching Section:", error);
            res.status(500).json({ message: "Failed to fetch Section" });
        }
    }

    //Update an Section Record
     async updateASection(req, res) {
        try {
            const sectionData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
             const cls = await this.classRepository.getAClass(sectionData.class, decoded.schoolId, decoded.schoolName);
             
             sectionData.classId = cls._id;
             const updated = await this.sectionRepository.updateASection(req.params.id, sectionData, decoded.schoolId, decoded.schoolName);
            const updatedSection = await this.classRepository.updateSections(cls._id, sectionData.name, decoded.schoolId, decoded.schoolName);
            if (!updatedSection) {
                return res.status(404).json({ message: "section not found" });
            }
            res.status(200).json(updated);
        } catch (error) {
            console.error("Error fetching section:", error);
            res.status(500).json({ message: "Failed to fetch section" });
        }
    }

    //Delete an Section Record
     async deleteSection(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const {sectionName, classId} = req.data;
            const deleted = await this.sectionRepository.deleteASection(req.params.id, decoded.schoolId, decoded.schoolName);
            const deletedSection = await this.classRepository.removeSection(classId, sectionName, decoded.schoolId, decoded.schoolName);
            // console.log("resp = ",deletedSection)
            if (!deletedSection) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        }
    }
    //Search Section By Teacher ID
     async getSectionByTeacherId(req, res){
        try {
            const teacher = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const teacherId = await getStaffIdByName(teacher, role = "teacher") 
            const section = await this.sectionRepository.getSectionByTeacherId(teacherId, decoded.schoolId, decoded.schoolName);
            if (section.status !== "success") {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        } 
    }
    //Search Section By School
     async getSectionBySchool(req, res){
        try {
            const schoolName = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const schoolId = await getSchoolIdByName(schoolName);
            const section = await this.sectionRepository.getSectionBySchool(schoolId, decoded.schoolId, decoded.schoolName);
            if (section.status !== "success") {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("Error fetching Student:", error);
            res.status(500).json({ message: "Failed to fetch Student" });
        } 
    }
    // add Multiple Sections
     async addMultipleSections(req, res) {
    try {
        const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
      const sections = req.body.sections;

      if (!Array.isArray(sections) || sections.length === 0) {
        return res.status(400).json({ message: "sections array is required" });
      }

      const savedSections = await this.sectionRepository.addSections(sections, decoded.schoolId, decoded.schoolName);
      return res.status(201).json({
        message: "sections added successfully",
        data: savedSections
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
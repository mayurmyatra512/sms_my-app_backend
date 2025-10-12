import { getClassIdByName } from "../config/helper.js";
import { getDataByToken } from "../config/jwtops.js";
import { getExamResultModel } from "../repositories/examResult.repository.js";
import SubjectRepository from "../repositories/subject.repository.js";
import TeacherRepository from "../repositories/teacher.repository.js";

export default class SubjectController {
    constructor() {
        this.subjectRepository = new SubjectRepository();
        this.teacherRepository = new TeacherRepository();
    }

    //Create a  new Subject
    async createSubject(req, res) {
        try {
            // console.log("req = ", req.body);
            const subjectData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            // if(subjectData.className) {
            //     subjectData.classId = await getClassIdByName(subjectData.className, decoded.schoolId, decoded.schoolName);
            // }
            // console.log("subject Data = ",subjectData)

            const newSubject = await this.subjectRepository.createSubject(subjectData, decoded.schoolId, decoded.schoolName);
            if (!newSubject) {
                return res.status(400).json({ message: "Failed to create Subject" });
            }
            res.status(201).json(newSubject);
        } catch (error) {
            console.error("Error creating Subject:", error);
            res.status(500).json({ message: "Failed to create Subject" });
        }
    }

    //Get All Subject
    async getAllSubject(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);

            let subjects = await this.subjectRepository.getAllSubjects(decoded.schoolId, decoded.schoolName);

            const ExamResult = await getExamResultModel(
                decoded.schoolId,
                decoded.schoolName
            )
            // 🔹 Get all teachers for this school (with their subjects populated)
            const teachers = await this.teacherRepository.getAllTeachers(
                decoded.schoolId,
                decoded.schoolName
            );

            // 🔹 Fetch exam results for this school (to calculate subject analytics)
            const examResults = await ExamResult.find({
                classId: { $in: subjects.map((s) => s.classId) },
            }).lean();

            // Assign difficulty level before sending
            const difficulties = ["Easy", "Medium", "Hard"];
            const gradeBuckets = ["A+", "A", "B+", "B", "C", "D", "F"];

            subjects = subjects.map((subject) => {
                // Example logic: choose difficulty based on level or randomly
                let difficulty;

                if (subject.level?.includes("Grade 1") || subject.level?.includes("Grade 2")) {
                    difficulty = "Easy";
                } else if (subject.level?.includes("Grade 3") || subject.level?.includes("Grade 6")) {
                    difficulty = "Medium";
                } else {
                    // For higher grades, randomize Hard/Medium
                    difficulty = Math.random() > 0.5 ? "Hard" : "Medium";
                }

                // 🔹 Find teachers teaching this subject
                const subjectTeachers = teachers
                    .filter((teacher) =>
                        teacher.subjectId?.some(
                            (subj) => subj._id.toString() === subject._id.toString()
                        )
                    )
                    .map((t) => t.userId?.fullName);

                // 🔹 Collect all exam records for this subject
                const subjectExams = examResults.flatMap((exam) => exam.subjects.filter(
                    (sub) => sub.subjectId.toString() === subject._id.toString()
                )
                );

                let totalStudents = subjectExams.length;
                let totalMarksObtained = 0;
                let totalMarks = 0;
                let highestScore = 0;
                let lowestScore = Infinity;
                let passed = 0;

                // Initialize grade distribution
                let gradeDistribution = gradeBuckets.reduce((acc, g) => {
                    acc[g] = 0;
                    return acc;
                }, {});

                subjectExams.forEach((s) => {
                    totalMarksObtained += s.marksObtained;
                    totalMarks += s.totalMarks;

                    if (s.marksObtained > highestScore) highestScore = s.marksObtained;
                    if (s.marksObtained < lowestScore) lowestScore = s.marksObtained;

                    // Example pass logic: >= 40% marks
                    if (s.marksObtained / s.totalMarks >= 0.4) {
                        passed++;
                    }

                    // Grade distribution
                    if (gradeBuckets.includes(s.grade)) {
                        gradeDistribution[s.grade] += 1;
                    }

                });
                // console.log("totalStudents = ", totalStudents);
                // console.log("totalMarksObtained = ", totalMarksObtained);




                const averagePerformance =
                    totalStudents > 0 ? totalMarksObtained / totalStudents : 0;
                const passRate = totalStudents > 0 ? (passed / totalStudents) * 100 : 0;

                // Trend calculation (basic: last 2 exams comparison)
                let trendValue = 0;
                const groupedByExam = {};
                examResults.forEach((exam) => {
                    const subj = exam.subjects.find(
                        (s) => s.subjectId.toString() === subject._id.toString()
                    );
                    if (subj) {
                        groupedByExam[exam._id] =
                            (groupedByExam[exam._id] || 0) + subj.marksObtained;
                    }
                });
                const examScores = Object.values(groupedByExam);
                if (examScores.length >= 2) {
                    const last = examScores[examScores.length - 1];
                    const prev = examScores[examScores.length - 2];
                    trendValue = last - prev; // ↑ positive means improving
                }

                // console.log("Subject Teachers = ", subjectTeachers.subjectId);

                return {
                    ...(subject.toObject ? subject.toObject() : subject),
                    difficulty,
                    teachers: subjectTeachers,
                    totalStudents,
                    averagePerformance,
                    passRate,
                    highestScore: totalStudents > 0 ? highestScore : 0,
                    lowestScore: totalStudents > 0 ? lowestScore : 0,
                    trendValue,
                    gradeDistribution,
                };
            });



            res.status(200).json(subjects);
        } catch (error) {
            console.error("Error fetching Subjects:", error);
            res.status(500).json({ message: "Failed to fetch Subjects" });
        }
    }

    //Get a specific Subject
    async getSubjectById(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const subjectData = await this.subjectRepository.getASubject(req.params.id, decoded.schoolId, decoded.schoolName);
            if (!subjectData) {
                return res.status(404).json({ message: "Subject not found" });
            }
            res.status(200).json(subjectData);
        } catch (error) {
            console.error("Error fetching Subject:", error);
            res.status(500).json({ message: "Failed to fetch Subject" });
        }
    }

    //Update an Subject Record
    async updateASubject(req, res) {
        try {
            const subjectData = req.body;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const updatedSubject = await this.subjectRepository.updateASubject(req.params.id, subjectData, decoded.schoolId, decoded.schoolName);
            if (!updatedSubject) {
                return res.status(404).json({ message: "Subject not found" });
            }
            res.status(200).json(updatedSubject);
        } catch (error) {
            console.error("Error fetching Subject:", error);
            res.status(500).json({ message: "Failed to fetch Subject" });
        }
    }

    //Delete an Subject Record
    async deleteSubject(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const deletedSubject = await this.subjectRepository.deleteASubject(req.params.id, decoded.schoolId, decoded.schoolName);
            if (deletedSubject.status !== "success") {
                return res.status(404).json({ message: "Subject not found" });
            }
            res.status(200).json({ message: "Subject deleted successfully" });
        } catch (error) {
            console.error("Error fetching Subject:", error);
            res.status(500).json({ message: "Failed to fetch Subject" });
        }
    }
    //Search Subjects by Name
    async searchSubjectsByName(req, res) {
        try {
            const { name } = req.query;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!name) {
                return res.status(400).json({ message: "Name is required" });
            }
            const subjects = await this.subjectRepository.searchSubjectsByName(name, decoded.schoolId, decoded.schoolName);
            res.status(200).json(subjects);
        } catch (error) {
            console.error("Error searching Subjects by Name:", error);
            res.status(500).json({ message: "Failed to search Subjects" });
        }
    }
    //Search Subjects by Code
    async searchSubjectsByCode(req, res) {
        try {
            const { code } = req.query;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!code) {
                return res.status(400).json({ message: "Code is required" });
            }
            const subjects = await this.subjectRepository.searchSubjectsByCode(code, decoded.schoolId, decoded.schoolName);
            res.status(200).json(subjects);
        } catch (error) {
            console.error("Error searching Subjects by Code:", error);
            res.status(500).json({ message: "Failed to search Subjects" });
        }
    }
    //Search Subjects by Class
    async searchSubjectsByClass(req, res) {
        try {
            const { className } = req.query;
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            if (!className) {
                return res.status(400).json({ message: "class is required" });
            }
            const classId = await getClassIdByName(className, decoded.schoolId, decoded.schoolName);
            const subjects = await this.subjectRepository.searchSubjectsByClass(classId, decoded.schoolId, decoded.schoolName);
            res.status(200).json(subjects);
        } catch (error) {
            console.error("Error searching Subjects by class:", error);
            res.status(500).json({ message: "Failed to search Subjects" });
        }
    }

    // add Multiple Subjects
    async addMultipleSubjects(req, res) {
        try {
            const token = req.headers['authorization']
            const decoded = await getDataByToken(token);
            const subjects = req.body.subjects;

            if (!Array.isArray(subjects) || subjects.length === 0) {
                return res.status(400).json({ message: "Subjects array is required" });
            }
            const savedSubjects = await this.subjectRepository.addSubjects(subjects, decoded.schoolId, decoded.schoolName);
            return res.status(201).json({
                message: "Subjects added successfully",
                data: savedSubjects
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

import StudentRepository, { getStudentModel } from "../repositories/student.repository.js";
import TeacherRepository, { getTeacherModel } from "../repositories/teacher.repository.js";
import StaffSalaryRepository from "../repositories/staffSalary.repository.js";
import AttendanceRepository, { getAttendanceModel } from "../repositories/attendance.repository.js";
import FeeRepository, { getFeeModel } from "../repositories/fee.repository.js";
import { getDataByToken } from "../config/jwtops.js";
import ExpenseRepository, { getExpenseModel } from "../repositories/expenses.repository.js";
import { getClassModel } from "../repositories/class.repository.js";
import { getDepartmentModel } from "../repositories/department.repositories.js";
import { getAssignmentModel } from "../repositories/assignment.repository.js";
// import ExpenseRepository from "../repositories/ExpenseRepository.js";


export default class DashboardController {
    async getDashboardStats(req, res) {
        const token = req.headers["authorization"];
        const decoded = await getDataByToken(token);
        try {
            // const schoolId = req.user?.schoolId || req.query.schoolId;

            // === 1️⃣ Total Students ===
            const totalStudents = await StudentRepository.countStudents(decoded.schoolId,
                decoded.schoolName);

            // === 2️⃣ Active Staff ===
            const activeStaff = await TeacherRepository.countActiveTeachers(decoded.schoolId,
                decoded.schoolName);

            // === 3️⃣ Monthly Revenue ===
            const monthlyRevenue = await FeeRepository.getMonthlyRevenue(decoded.schoolId,
                decoded.schoolName);

            // === 4️⃣ Attendance Rate ===
            const attendanceRate = await AttendanceRepository.getAverageAttendanceRate(decoded.schoolId,
                decoded.schoolName);

            // === 5️⃣ Recent Activities ===
            const recentActivities = await DashboardController.getRecentActivities(decoded.schoolId,
                decoded.schoolName);

            // === Combine stats ===
            const stats = {
                totalStudents,
                monthlyRevenue,
                attendanceRate,
                activeStaff,
                recentActivities
            };

            return res.status(200).json({
                success: true,
                message: "Dashboard data fetched successfully",
                data: stats,
            });
        } catch (error) {
            console.error("Dashboard Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch dashboard data",
                error: error.message,
            });
        }
    }

    // ✅ Recent activity logic (from multiple modules)
    static async getRecentActivities(schoolId, schoolName) {
        const recentPayments = await FeeRepository.getRecentPayments(schoolId, schoolName);
        const recentStudents = await StudentRepository.getRecentStudents(schoolId, schoolName);
        const recentExpenses = await ExpenseRepository.getRecentExpenses(schoolId, schoolName);

        // Merge and sort by createdAt (latest first)
        const merged = [
            ...recentPayments.map(p => ({
                action: "Fee payment received",
                student: p.studentName,
                time: p.createdAt,
            })),
            ...recentStudents.map(s => ({
                action: "New student enrolled",
                student: s.fullName,
                time: s.createdAt,
            })),
            ...recentExpenses.map(e => ({
                action: "Expense added",
                student: e.title,
                time: e.createdAt,
            })),
        ];

        // Sort by time descending
        return merged.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    }

    // Get dashboard data
    async getDashboardData(req, res) {
        const token = req.headers["authorization"];
        const decoded = await getDataByToken(token);
        try {
            const Student = await getStudentModel(decoded.schoolId, decoded.schoolName);
            const Teacher = await getTeacherModel(decoded.schoolId, decoded.schoolName);
            const ClassModel = await getClassModel(decoded.schoolId, decoded.schoolName);
            const FeePayment = await getFeeModel(decoded.schoolId, decoded.schoolName);
            const Department = await getDepartmentModel(decoded.schoolId, decoded.schoolName);
            const Attendance = await getAttendanceModel(decoded.schoolId, decoded.schoolName);
            const Expense = await getExpenseModel(decoded.schoolId, decoded.schoolName);
            // 1️⃣  Basic Stats
            const [studentCount, teacherCount, classCount, totalRevenue] = await Promise.all([
                Student.countDocuments(),
                Teacher.countDocuments(),
                ClassModel.countDocuments(),
                FeePayment.aggregate([
                    { $group: { _id: null, total: { $sum: "$amountPaid" } } },
                ]),
            ]);

            console.log("teacherCount = ", teacherCount);
            // 2️⃣  Departments

            const departments = await Department.find().lean();

            // 3️⃣  Alerts (auto-generated based on thresholds)
            const lowAttendanceClasses = await Attendance.aggregate([
                { $group: { _id: "$classId", avgAttendance: { $avg: "$percentage" } } },
                { $match: { avgAttendance: { $lt: 80 } } },
            ]);
            const alerts = [];
            if (lowAttendanceClasses.length > 0) {
                alerts.push({
                    type: "critical",
                    message: `Low attendance detected in ${lowAttendanceClasses.length} class(es)`,
                    action: "Review Required",
                });
            }

            const expenses = await Expense.aggregate([
                { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
            ]);

            if (expenses.length > 0 && totalRevenue[0]?.total) {
                const variance = ((expenses[0].totalExpenses / totalRevenue[0].total) * 100).toFixed(2);
                if (variance > 80) {
                    alerts.push({
                        type: "warning",
                        message: "Budget variance detected",
                        action: "Investigate",
                    });
                }
            }

            alerts.push({
                type: "info",
                message: "Some teachers pending certification renewal",
                action: "Follow Up",
            });

            // 4️⃣ Department Performance Metrics
            const departmentPerformance = await Department.aggregate([
                {
                    $lookup: {
                        from: "teachers",
                        localField: "_id",
                        foreignField: "departmentId",
                        as: "teachers",
                    },
                },
                {
                    $lookup: {
                        from: "students",
                        localField: "_id",
                        foreignField: "departmentId",
                        as: "students",
                    },
                },
                {
                    $project: {
                        department: "$name",
                        teachers: { $size: "$teachers" },
                        students: { $size: "$students" },
                        avgGrade: { $avg: "$students.grade" },
                        attendance: { $avg: "$students.attendanceRate" },
                    },
                },
            ]);

            // 5️⃣ Recent Activities (combine data from multiple collections)
            const recentStudents = await Student.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("fullName createdAt")
                .lean();

            const recentTeachers = await Teacher.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("fullName createdAt")
                .lean();

            const recentActivities = [
                ...recentStudents.map((s) => ({
                    type: "enrollment",
                    message: `New student ${s.fullName} enrolled`,
                    time: s.createdAt,
                    priority: "medium",
                })),
                ...recentTeachers.map((t) => ({
                    type: "staff",
                    message: `New teacher ${t.fullName} joined`,
                    time: t.createdAt,
                    priority: "low",
                })),
            ].sort((a, b) => new Date(b.time) - new Date(a.time));

            // 6️⃣ Upcoming Events
            // const upcomingEvents = await Event.find({
            //     date: { $gte: new Date() },
            // })
            //     .sort({ date: 1 })
            //     .limit(10)
            //     .select("title date time attendeesCount")
            //     .lean();
            const upcomingEvents = [];
            // ✅ Final Dashboard Response
            return res.status(200).json({
                stats: {
                    totalStudents: studentCount,
                    activeTeachers: teacherCount,
                    totalClasses: classCount,
                    monthlyRevenue: totalRevenue[0]?.total || 0,
                },
                departments,
                alerts,
                departmentPerformance,
                recentActivities,
                upcomingEvents,
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            return res.status(500).json({ error: "Failed to load dashboard data" });
        }

    }

    // Student Dashboard
    async getStudentDashboard(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            const Student = await getStudentModel(decoded.schoolId, decoded.schoolName);
            const Attendance = await getAttendanceModel(decoded.schoolId, decoded.schoolName);
            const Assignment = await getAssignmentModel(decoded.schoolId, decoded.schoolName);
            const ClassModel = await getClassModel(decoded.schoolId, decoded.schoolName);

            const { studentId } = req.params;

            const student = await Student.findById(studentId)
                .populate("classId sectionId userId");

            const classData = await ClassModel.findById(student.classId);

            const attendanceDocs = await Attendance.find({ "records.studentId": student._id });

            let presentCount = 0;
            let totalCount = 0;
            attendanceDocs.forEach(att => {
                att.records.forEach(r => {
                    if (r.studentId.toString() === student._id.toString()) {
                        totalCount++;
                        if (r.status === "present" || r.status === "Present") presentCount++;
                    }
                });
            });
            

            const attendanceRate = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(2) : 0;
           
            // ======================
            // 🧾 ASSIGNMENTS
            // ======================
            const allAssignments = await Assignment.find({
                classId: student.classId,
                sectionId: student.sectionId,
            }).populate("subjectId teacherId");

            const pendingAssignments = allAssignments.filter(
                a => !a.submissions?.some(s => s.studentId.toString() === student._id.toString())
            );

            const upcomingClasses = [
                { time: "09:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Mr. Smith" },
                { time: "10:30 AM", subject: "Science", room: "Lab 2", teacher: "Dr. Johnson" },
            ];

            const creditsEarned = (presentCount / (totalCount || 1)) * 10; // Simple mock formula

            res.status(200).json({
                success: true,
                data: {
                    student: {
                        name: student.userId.fullName,
                        class: classData?.name || "N/A",
                        section: student.sectionId?.name || "N/A",
                    },
                    attendanceRate,
                    pendingAssignments: pendingAssignments.length,
                    creditsEarned: creditsEarned.toFixed(2),
                    upcomingClasses,
                    assignments: allAssignments.map(a => ({
                        subject: a.subjectId?.name || "N/A",
                        title: a.title,
                        dueDate: a.dueDate,
                        status: pendingAssignments.some(p => p._id.equals(a._id))
                            ? "Pending"
                            : "Submitted",
                    })),
                },
            });
        } catch (error) {
            console.error("Error in studentDashboard:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch student dashboard data",
            });
        }
    }
}
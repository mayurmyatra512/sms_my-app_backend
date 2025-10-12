import express from 'express';
import StudentController from '../controllers/student.controller.js';

const studentController = new StudentController();
const studentOthersRouter = express.Router();

// Define routes for student operations
studentOthersRouter.get('/class/:classId', (req, res) => studentController.getStudentsByClass(req, res));
studentOthersRouter.get('/section/:sectionId', (req, res) => studentController.getStudentsBySection(req, res));
studentOthersRouter.get('/searchByName', (req, res) => studentController.searchStudentsByName(req, res));
studentOthersRouter.get('/searchByRollNumber', (req, res) => studentController.searchStudentsByRollNumber(req, res));
studentOthersRouter.get('/searchByClassAndSection', (req, res) => studentController.searchStudentsByClassAndSection(req, res));
studentOthersRouter.get('/searchByAdmissionNumber', (req, res) => studentController.searchStudentsByAdmissionNumber(req, res));
studentOthersRouter.get('/searchByStatus', (req, res) => studentController.searchStudentsByStatus(req, res));
studentOthersRouter.get('/searchByGender', (req, res) => studentController.searchStudentsByGender(req, res));
studentOthersRouter.get('/searchByDateOfBirth', (req, res) => studentController.searchStudentsByDateOfBirth(req, res));
studentOthersRouter.get('/searchByParent', (req, res) => studentController.searchStudentsByParent(req, res));
studentOthersRouter.get('/searchBySchool', (req, res) => studentController.searchStudentsBySchool(req, res));
studentOthersRouter.get('/searchByBloodGroup', (req, res) => studentController.searchStudentsByBloodGroup(req, res));
studentOthersRouter.post('/students', (req, res) => studentController.addMultipleStudents(req, res));
studentOthersRouter.get('/userId/:userId', (req, res) => studentController.getStudentByUserId(req, res));
studentOthersRouter.get('/parentId/:parentId', (req, res) => studentController.getChildrenByParentId(req, res));


export default studentOthersRouter;
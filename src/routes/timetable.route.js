import express from "express";
import TimetableController from "../controllers/timetable.controller.js";

const timetableRouter = express.Router();
const timetableController = new TimetableController();

console.log("Timetable Route")

// Define routes for subject operations
timetableRouter.get('/', (req, res) => timetableController.getAllTimetables(req, res));
timetableRouter.get('/class', (req, res) => timetableController.getTimetableByClassId(req, res))
timetableRouter.get('/:id', (req, res) => timetableController.getTimetableById(req, res));
timetableRouter.post('/', (req, res) => timetableController.createTimetable(req, res));
timetableRouter.put('/:id', (req, res) => timetableController.updateTimetable(req, res));
timetableRouter.delete('/:id', (req, res) => timetableController.deleteTimetable(req, res));

export default timetableRouter;
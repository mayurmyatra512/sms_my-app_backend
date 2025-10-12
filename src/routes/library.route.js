import express from "express";
import LibraryController from "../controllers/library.controller.js";

const libraryRouter = express.Router();
const libraryController = new LibraryController();

// Members
libraryRouter.post("/members", (req, res) => libraryController.createMember(req, res));
libraryRouter.get("/members", (req, res) => libraryController.getMembers(req, res));

// Books
libraryRouter.post("/books", (req, res) => libraryController.addBook(req, res));
libraryRouter.get("/books", (req, res) => libraryController.getBooks(req, res));

// Borrow Records
libraryRouter.post("/borrow/issue", (req, res) => libraryController.issueBook(req, res));
libraryRouter.post("/borrow/return", (req, res) => libraryController.returnBook(req, res));
libraryRouter.get("/borrow/history/:memberId", (req, res) => libraryController.getBorrowHistory(req, res));
libraryRouter.get("/borrow/history", (req, res) => libraryController.getAllBorrowHistory(req, res))

export default libraryRouter;


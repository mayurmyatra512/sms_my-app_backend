import { getDataByToken } from "../config/jwtops.js";
import LibraryRepository from "../repositories/library.repository.js";


export default class LibraryController {
    constructor() {
        this.libraryRepository = new LibraryRepository()
    }

    // ---------- Member ----------
    async createMember(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const member = await this.libraryRepository.createMember(req.body, decoded.schoolId, decoded.schoolName);
            res.status(201).json(member);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    async getMembers(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const members = await this.libraryRepository.getAllMembers(decoded.schoolId, decoded.schoolName);
            res.json(members);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    // ---------- Book ----------
    async addBook(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });
            console.log("Bood add Data = ", req.body);
            const book = await this.libraryRepository.addBook(req.body, decoded.schoolId, decoded.schoolName);
            res.status(201).json(book);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    async getBooks(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const books = await this.libraryRepository.getAllBooks(decoded.schoolId, decoded.schoolName);
            console.log("Booke = ", books)
            res.json(books);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    // ---------- Borrow ----------
    async issueBook(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const { bookId, memberId, dueDate } = req.body;
            const record = await this.libraryRepository.issueBook({ bookId, memberId, dueDate }, decoded.schoolId, decoded.schoolName);
            res.status(201).json(record);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    async returnBook(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const { recordId } = req.body;
            const record = await this.libraryRepository.returnBook(recordId, decoded.schoolId, decoded.schoolName);
            res.json(record);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    async getBorrowHistory(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const { memberId } = req.params;
            const history = await this.libraryRepository.getBorrowHistoryByMember(memberId, decoded.schoolId, decoded.schoolName);
            res.json(history);
        } catch (error) {
            console.log("Error in Controller: ", error)
            res.status(500).json({ error: error.message });
        }
    }

    async getAllBorrowHistory(req, res) {
        try {
            const token = req.headers["authorization"];
            const decoded = await getDataByToken(token);

            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            const history = await this.libraryRepository.getAllBorrowHistory(decoded.schoolId, decoded.schoolName);
            console.log("History = ", history);
            res.json(history);
        } catch (error) {
            console.error("Error fetching borrow history:", error);
            res.status(500).json({ error: error.message });
        }
    }

}
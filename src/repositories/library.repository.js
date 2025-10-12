import { getDbConnection } from "../config/mongodbconnection.js";
import { dbName } from "../config/tenantManager.js";
import { BookSchema, BorrowRecordSchema, CategorySchema, MemberSchema } from "../models/library.schema.js";


// Dynamically get Member model from tenant DB
export const getMemberModel = async (companyId, companyName) => {
    try {
        // console.log("Name = ", companyName, "Id = ", companyId);
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        schoolDb.model("Category", CategorySchema, "categories");
        return schoolDb.model(`Member`, MemberSchema, `members`);
    } catch (error) {
        console.error("Error getting members model:", error);
        throw new Error("Failed to get members model");
    }
};

// Dynamically get Book model from tenant DB
export const getBookModel = async (companyId, companyName) => {
    try {
        // console.log("Name = ", companyName, "Id = ", companyId);
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Book`, BookSchema, `books`);
    } catch (error) {
        console.error("Error getting books model:", error);
        throw new Error("Failed to get books model");
    }
};

// Dynamically get Category model from tenant DB
export const getCategoryModel = async (companyId, companyName) => {
    try {
        // console.log("Name = ", companyName, "Id = ", companyId);
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`Category`, CategorySchema, `categories`);
    } catch (error) {
        console.error("Error getting categories model:", error);
        throw new Error("Failed to get categories model");
    }
};

// Dynamically get Borrow Record model from tenant DB
export const getBorrowRecordModel = async (companyId, companyName) => {
    try {
        // console.log("Name = ", companyName, "Id = ", companyId);
        const db = await dbName(companyName, companyId)
        const schoolDb = getDbConnection(db);
        if (!schoolDb) {
            console.error("Failed to connect to school database");
            throw new Error("Failed to connect to school database");
        }
        // const ClassModel = mongoose.model(`Class_${companyId}`, classSchema, `classs_${companyName}`);
        return schoolDb.model(`BorrowRecord`, BorrowRecordSchema, `borrowRecords`);
    } catch (error) {
        console.error("Error getting BorrowRecord model:", error);
        throw new Error("Failed to get BorrowRecord model");
    }
};


export default class LibraryRepository {
    // ---------- Member ----------
    async createMember(data, companyId, companyName) {
        const Member = await getMemberModel(companyId, companyName);
        return await Member.create(data);
    }

    async getMemberById(id, companyId, companyName) {
        const Member = await getMemberModel(companyId, companyName);
        return await Member.findById(id)
            .populate("roleId"); // auto populate Student or Teacher
    }

    async getAllMembers(companyId, companyName) {
        const Member = await getMemberModel(companyId, companyName);
        return await Member.find().populate({
            path: "roleId",
            populate: {
                path: "userId", // userId inside Student/Teacher
                model: "User"
            }
        });
    }

    // ---------- Books ----------
    async addBook(bookData, companyId, companyName) {
        const Book = await getBookModel(companyId, companyName);
        const Category = await getCategoryModel(companyId, companyName);
        let categoryId;

        // If category is passed as a string (name)
        if (typeof bookData.category === "string") {
            let category = await Category.findOne({ name: bookData.category.trim() });

            if (!category) {
                // Create new category if not exists
                category = new Category({ name: bookData.category.trim() });
                await category.save();
            }

            categoryId = category._id;
        } else {
            // If already sending categoryId
            categoryId = bookData.category;
        }

        // Create book with categoryId
        const book = new Book({ ...bookData, category: categoryId });
        return await book.save();
    }

    async getBookById(id, companyId, companyName) {
        const Book = await getBookModel(companyId, companyName);
        return await Book.findById(id);
    }

    async getAllBooks(companyId, companyName) {
        const Book = await getBookModel(companyId, companyName);
        return await Book.find().populate("category");
    }

    async updateBookCopies(id, available, total, companyId, companyName) {
        const Book = await getBookModel(companyId, companyName);
        return await Book.findByIdAndUpdate(
            id,
            { copiesAvailable: available, totalCopies: total },
            { new: true }
        );
    }

    // ---------- Borrow Records ----------
    async issueBook({ bookId, memberId, dueDate }, companyId, companyName) {
        // reduce available copies
        const Book = await getBookModel(companyId, companyName);
        await Book.findByIdAndUpdate(bookId, { $inc: { copiesAvailable: -1 } });

        return await BorrowRecord.create({
            book: bookId,
            member: memberId,
            dueDate
        });
    }

    async returnBook(recordId, companyId, companyName) {
        const BorrowRecord = await getBorrowRecordModel(companyId, companyName);
        const record = await BorrowRecord.findById(recordId);
        if (!record) throw new Error("Record not found");

        record.status = "returned";
        record.returnDate = new Date();
        await record.save();

        // increase available copies
        await Book.findByIdAndUpdate(record.book, { $inc: { copiesAvailable: 1 } });

        return record;
    }

    async getBorrowHistoryByMember(memberId, companyId, companyName) {
        const BorrowRecord = await getBorrowRecordModel(companyId, companyName);
        return await BorrowRecord.find({ member: memberId })
            .populate("book")
            .populate({
                path: "member",
                populate: { path: "roleId" } // populate student/teacher details
            });
    }
    async getAllBorrowHistory(companyId, companyName) {
        const BorrowRecord = await getBorrowRecordModel(companyId, companyName);
        return await BorrowRecord.find()
            .populate("book") // populate book details
            .populate({
                path: "member",
                populate: { path: "roleId" } // populate student or teacher
            })
            .sort({ issueDate: -1 }); // latest first
    }


}
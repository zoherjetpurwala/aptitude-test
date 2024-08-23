import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  choices: [{ type: String, required: true }],
}, { _id: false });

const examSchema = new mongoose.Schema({
  examId: { type: String, required: true },
  selectedAnswers: { type: Map, of: String, default: {} },
  timeRemaining: { type: Number, default: 7200 },
  questions: [questionSchema],
}, { _id: false });

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  exams: { type: [examSchema], default: [] },
}, { timestamps: true });

export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

let cachedConnection = null;

export async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI);
  cachedConnection = { db: connection.connection.db, client: connection.connection.client };
  return cachedConnection;
}
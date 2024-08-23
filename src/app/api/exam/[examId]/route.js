import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/mongodb";

export async function GET(_, { params }) {
  const { examId } = params;

  try {
    const { db } = await connectToDatabase();
    const exam = await db.collection("exams").findOne({ examId });

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, exam });
  } catch (error) {
    console.error("Error fetching exam data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch exam data." },
      { status: 500 }
    );
  }
}

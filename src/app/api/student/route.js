import { NextResponse } from "next/server";
import { Student, connectToDatabase } from "@/utils/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ email }).select("-password").lean();
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student }, { status: 200 });
  } catch (error) {
    console.error("Fetch student error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch student data." },
      { status: 500 }
    );
  }
}

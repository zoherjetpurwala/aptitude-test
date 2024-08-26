// pages/api/exams/[examId]/questions.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust path as needed

export async function GET(request, { params }) {
  const { examId } = params;

  try {
    const questions = await prisma.question.findMany({
      where: { examId: examId },
      select: {
        id: true,
        text: true,
        answers: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Error fetching questions" },
      { status: 500 }
    );
  }
}

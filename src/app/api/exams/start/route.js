import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { studentExamId } = await request.json();

  // Mark the exam as started
  const studentExam = await prisma.studentExam.update({
    where: { id: studentExamId },
    data: { startedAt: new Date() },
  });

  return NextResponse.json({ message: 'Exam started', studentExam });
}

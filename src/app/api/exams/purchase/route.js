import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(request) {
  const { userId, examId, paymentMethod, amount  } = await request.json();

  if (!userId || !examId || !amount) {
    return NextResponse.json({
      message: 'Invalid data',
    }, { status: 400 });
  }

  try {
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        user: { connect: { id: userId } },  // Ensure user exists
        exam: { connect: { id: examId } },
      },
    });

    // Create student exam record
    const studentExam = await prisma.studentExam.create({
      data: {
        userId,
        examId,
        startedAt: new Date(), // Assume exam starts immediately after payment for simplicity
      },
    });

    return NextResponse.json({
      message: 'Exam purchased successfully',
      paymentId: payment.id,
      studentExamId: studentExam.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: 'Failed to process payment',
    }, { status: 500 });
  }
}

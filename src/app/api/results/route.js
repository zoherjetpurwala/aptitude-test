import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  const results = await prisma.studentExam.findMany({
    where: { userId },
    include: {
      exam: {
        select: {
          title: true,
          description: true,
          duration: true,
        },
      },
      result: true,
    },
  });

  return NextResponse.json(results);
}

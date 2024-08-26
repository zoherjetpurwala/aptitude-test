import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  const exams = await prisma.exam.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      duration: true,
    },
  });

  return NextResponse.json(exams);
}

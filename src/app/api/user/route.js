import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(reqest) {
    try {
  
      const { email } = await reqest.json();
      
  
      if (!email) {
        return NextResponse.json(
          { success: false, message: "Email is required." },
          { status: 400 }
        );
      }
  
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            payments: true,       // Include related payments if needed
            studentExams: true,   // Include related student exams if needed
          },
        });  

        // console.log(user);


      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found." },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
      console.error("Fetch User error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch User data." },
        { status: 500 }
      );
    }
  }
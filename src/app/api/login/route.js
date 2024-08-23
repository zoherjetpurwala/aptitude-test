import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectToDatabase, Student } from '@/utils/mongodb';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await connectToDatabase();
    const student = await Student.findOne({ email });
    if (!student) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to log in.' }, { status: 500 });
  }
}

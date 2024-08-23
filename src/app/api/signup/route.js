import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, Student } from '@/utils/mongodb';

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const existingUser = await Student.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      username,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    const { db } = await connectToDatabase();
    const examCollection = db.collection('exams');
    const examCount = await examCollection.countDocuments();

    if (examCount === 0) {
      await examCollection.insertMany([
        {
          examId: 'exam1',
          questions: [
            {
              id: 'q1',
              text: 'What is the capital of France?',
              choices: ['Paris', 'London', 'Berlin', 'Madrid'],
            },
          ],
        },
        {
          examId: 'exam2',
          questions: [
            {
              id: 'q1',
              text: 'What is the capital of France?',
              choices: ['Paris', 'London', 'Berlin', 'Madrid'],
            },
          ],
        },
      ]);
    }

    const token = jwt.sign(
      { userId: newStudent._id, email: newStudent.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Failed to sign up.' }, { status: 500 });
  }
}
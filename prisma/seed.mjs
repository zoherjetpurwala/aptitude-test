

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Dynamically import JSON data
    const examData = await import('../src/lib/examdata.json', {
      assert: { type: 'json' },
    });

    // Add your seeding logic here
    for (const exam of examData.default) {
      await prisma.exam.create({
        data: {
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          price: exam.price,
          questions: {
            create: exam.questions.map(question => ({
              text: question.text,
              answers: {
                create: question.answers.map(answer => ({
                  text: answer.text,
                  isCorrect: answer.isCorrect,
                })),
              },
            })),
          },
        },
      });
    }
    console.log('Seeding completed.');
  } catch (e) {
    console.error('Error seeding data:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

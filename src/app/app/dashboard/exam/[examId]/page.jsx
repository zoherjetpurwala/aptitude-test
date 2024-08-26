"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ExamPage() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(7200); // Default 2 hours
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch(`/api/exams/${examId}/questions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setQuestions(data);
      console.log(data);
    };

    fetchQuestions();
  }, [examId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    await fetch(`/api/exams/${examId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ answers }),
    });

    router.push("/dashboard/results");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Exam</h1>
        <span className="p-2 text-lg font-bold bg-white rounded shadow border-2">
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>
      <div>
        {questions.map((question) => (
          <div key={question.id} className="mb-6">
            <h2 className="mb-2 text-xl font-bold">{question.text}</h2>
            <div className="flex flex-col">
              {question.answers.map((answer) => (
                <label key={answer.id} className="mb-2 flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.id} // Use answer.id as the value
                    checked={selectedAnswers[question.id] === answer.id} // Check if this option is selected
                    onChange={() => handleAnswerChange(question.id, answer.id)} // Pass answer.id to handleAnswerChange
                    className="mr-2"
                  />
                  {answer.text} {/* Render answer.text */}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="w-full p-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Submit Exam
      </button>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PageNavbar, {
  PageNavbarLeftContent,
} from "@/components/Layouts/Navbar/PageNavbar";
import { Element3 } from "iconsax-react";
import PageContent from "@/components/Layouts/PageContent";

const Exam = ({ params }) => {
  const { examId } = params;
  const [exam, setExam] = useState(null);
  const [timer, setTimer] = useState(2 * 60 * 60);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const questionRefs = useRef({});

  const fetchExamData = useCallback(
    async (token) => {
      try {
        const response = await fetch(`/api/exam/${examId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const data = await response.json();

        if (data.success) {
          setExam(data.exam);
          const savedAnswers = localStorage.getItem(
            `selectedAnswers-${examId}`
          );
          const savedTimer = localStorage.getItem(`timeRemaining-${examId}`);

          setSelectedAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
          setTimer(savedTimer ? parseInt(savedTimer) : 2 * 60 * 60);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching exam data:", error);
        router.push("/dashboard");
      }
    },
    [examId, router]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchExamData(token);

    const interval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        localStorage.setItem(`timeRemaining-${examId}`, newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examId, router, fetchExamData]);

  const handleAnswerChange = useCallback(
    (questionId, answer) => {
      setSelectedAnswers((prev) => {
        const updated = { ...prev, [questionId]: answer };
        localStorage.setItem(
          `selectedAnswers-${examId}`,
          JSON.stringify(updated)
        );
        return updated;
      });

      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    },
    [examId]
  );

  const handleSubmit = useCallback(() => {
    console.log("TODO");
  }, [""]);

  const formatTime = useCallback((timeInSeconds) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  if (!exam) return <div>Loading...</div>;

  return (
    <div className="overflow-x-hidden">
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className="border rounded-full w-10 h-10 flex justify-center items-center">
            <Element3 size={18} />
          </div>
          <div className="ml-2">
            <p className="text-base font-semibold text-gray-800">
              {exam.examId}
            </p>
          </div>
        </PageNavbarLeftContent>
      </PageNavbar>

      <PageContent>
        <div className="w-full flex flex-col items-center">
          <div className="mb-6">
            <p className="text-xl font-bold">
              Time Remaining: {formatTime(timer)}
            </p>
          </div>
          <div className="w-full max-w-4xl">
            {exam.questions.map((question, index) => (
              <div
                key={question.id}
                ref={(el) => (questionRefs.current[question.id] = el)}
                className={`mb-6 p-4 border rounded-3xl shadow ${
                  errors[question.id] ? "border-red-500" : "border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-base font-semibold">
                    Question {index + 1}
                  </p>
                  {errors[question.id] && (
                    <p className="text-red-500 font-medium">
                      This question is unanswered
                    </p>
                  )}
                </div>
                <p className="text-base mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.choices.map((choice) => {
                    const isSelected = selectedAnswers[question.id] === choice;
                    return (
                      <div
                        key={choice}
                        className={`flex items-center p-3 border rounded-3xl cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-100 border-blue-500"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => handleAnswerChange(question.id, choice)}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={choice}
                          checked={isSelected}
                          onChange={() =>
                            handleAnswerChange(question.id, choice)
                          }
                          className="mr-3 accent-blue-500"
                        />
                        <span className="text-base">{choice}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex justify-center mt-8 mb-8">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default Exam;

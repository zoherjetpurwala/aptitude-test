"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import PageNavbar, {
  PageNavbarLeftContent,
} from "@/components/Layouts/Navbar/PageNavbar";
import { Element3 } from "iconsax-react";
import PageContent from "@/components/Layouts/PageContent";

const exams = [
  { id: "exam1", title: "Aptitude Test 1" },
  { id: "exam2", title: "Aptitude Test 2" },
];

const ExamCard = ({ exam, onStart }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border-2 flex flex-col">
    <h2 className="text-xl text-center p-12 font-semibold mb-4">
      {exam.title}
    </h2>
    <button
      onClick={() => onStart(exam.id)}
      className="bg-blue-500 text-white p-2 rounded-lg shadow-lg"
    >
      Start Exam
    </button>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="spinner-border animate-spin h-8 w-8 border-4 border-blue-500 rounded-full"></div>
  </div>
);

export default function Dashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) return router.push("/login");

    const fetchStudentInfo = async () => {
      try {
        const res = await fetch("/api/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: decoded.email }),
        });
        const data = await res.json();
        if (data.success) setStudent(data.student);
        else router.push("/login");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleExamStart = (examId) => {
    router.push(`/dashboard/exam/${examId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageNavbar>
        <PageNavbarLeftContent>
          <div className="border rounded-full w-10 h-10 flex justify-center items-center">
            <Element3 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Dashboard</p>
          </div>
        </PageNavbarLeftContent>
      </PageNavbar>

      <PageContent>
        <div>
          <div className="flex justify-center items-center mb-8">
            <h1 className="text-4xl">Test List:</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} onStart={handleExamStart} />
            ))}
          </div>
        </div>
      </PageContent>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageNavbar, {
  PageNavbarLeftContent,
} from "@/components/Layouts/Navbar/PageNavbar";
import { Element3 } from "iconsax-react";
import PageContent from "@/components/Layouts/PageContent";
import jwt from "jsonwebtoken";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export default function Dashboard() {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchExams = async () => {
      const res = await fetch("/api/exams", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();

      setExams(data);
      console.log(data);
    };

    const token = localStorage.getItem("token");

    if (!token) return router.push("/auth");

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.email) return router.push("/auth");

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: decoded.email }),
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
        else router.push("/auth");
      } catch {
        router.push("/auth");
      } finally {
        // setLoading(false);
      }
    };

    fetchUser();
    fetchExams();
  }, []);

  const handlePurchase = async (examId, price, userId) => {
    const res = await fetch("/api/exams/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        examId,
        paymentMethod: "card",
        amount: price,
        userId,
      }),
    });

    if (res.ok) {
      router.push(`/app/dashboard/exam/${examId}`);
    }
  };
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
        <div className="">
          <h1 className="mb-6 text-2xl font-bold text-center">
            Available Exams:
          </h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <Card className="bg-opacity-80 backdrop-blur hover:shadow-2xl hover:shadow-primary-500/25">
                <CardBody>
                  <div key={exam.id} className="p-6">
                    <h2 className="text-xl font-bold">{exam.title}</h2>
                    <p className="mb-4">{exam.description}</p>
                    <p className="mb-2">Duration: {exam.duration} mins</p>
                    <p className="mb-4">Price: ${exam.price}</p>
                    <Button
                      color="primary"
                      variant="shadow"
                      onClick={() =>
                        handlePurchase(exam.id, exam.price, user.id)
                      }
                      className="w-full p-2"
                    >
                      Purchase & Start Exam
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </PageContent>
    </div>
  );
}

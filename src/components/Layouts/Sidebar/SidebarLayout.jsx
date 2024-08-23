"use client";

import Link from "next/link";
import { useCentralStore } from "@/utils/StateUtils";
import React, { useEffect, useState } from "react";
import { Element, LogoutCurve } from "iconsax-react";
import SidebarItem from "./SidebarItem";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

function SidebarLayout() {
  const { setIsSidebarOpen, isSidebarOpen } = useCentralStore();

  const handleClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(!isSidebarOpen);
  };

  const navbaritems = [
    { id: 1, title: "Dashboard", path: "/dashboard", icon: Element },
  ];

  const [student, setStudent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.email) {
        fetch("/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: decoded.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setStudent(data.student);
            } else {
              router.push("/login");
            }
          })
          .catch(() => {
            router.push("/login");
          });
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="w-72 shrink-0 md:block h-screen fixed top-0 overflow-hidden">
      <div className="w-full h-full bg-white border-r">
        <div className="p-4 md:p-6 flex cursor-pointer group justify-center items-center gap-2">
          <div className="flex justify-center flex-col items-center">
            <h1 className="text-lg font-bold text-gray-800">APTITUDE</h1>
            <p className="text-sm text-gray-500 font-medium">TEST</p>
          </div>
        </div>

        <hr className="bg-gray-400 mx-2" />

        <div className="flex flex-col h-full justify-between">
          <div className="pt-6 text-gray-500 font-medium space-y-2 md:px-2 text-xs">
            {navbaritems.map((item) => (
              <div key={item.id}>
                <SidebarItem
                  title={item.title}
                  path={item.path}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>

          <div>
            <hr className="bg-gray-400 mx-2 my-4" />

            <div className="flex pb-28 justify-center px-4 md:px-6 items-center w-full">
              <div className="flex flex-col items-center w-full justify-center gap-4">
                {student ? (
                  <div className="flex items-center justify-center flex-col ">
                    <p className=" font-semibold text-primary text-base  bg-opacity-20 px-8">
                      {student.username}
                    </p>
                    <p className="text-xs overflow-clip font-medium text-gray-500">
                      {student.email}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-sm font-semibold text-gray-800">Admin</p>
                    <p className="text-xs font-medium text-gray-500">
                      abc@example.com
                    </p>
                  </div>
                )}

                <Link href="?logoutmodal=true">
                  <button className="h-8 gap-1 outline outline-blue-300 bg-primary py-1 px-2 duration-200 text-white rounded-lg text-xs flex items-center justify-center">
                    <LogoutCurve size={16} />
                    <span className="">Logout</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout;

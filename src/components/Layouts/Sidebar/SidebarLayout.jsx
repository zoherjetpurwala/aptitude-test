"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import SidebarItem from "./SidebarItem";
import { Element, LogoutCurve } from "iconsax-react";
import SparklesText from "@/components/ui/magictext";

function SidebarLayout() {
  const [mounted, setMounted] = useState(false);
  const [student, setStudent] = useState(null);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Load and save theme in localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.email) {
        fetchStudentData(decoded.email);
      }
    } else {
      router.push("/auth");
    }
  }, [router, setTheme]);

  // Fetch student data
  const fetchStudentData = useCallback(async (email) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setStudent(data.user);
      } else {
        router.push("/auth");
      }
    } catch {
      router.push("/auth");
    }
  }, [router]);

  // Switch theme with transition
  const switchTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [resolvedTheme, setTheme]);

  const toggleTheme = useCallback(() => {
    if (document.startViewTransition) {
      document.startViewTransition(switchTheme);
    } else {
      switchTheme();
    }
  }, [switchTheme]);

  // Memoize navbar items
  const navbarItems = useMemo(() => [
    { id: 1, title: "Dashboard", path: "/app/dashboard", icon: Element },
  ], []);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.clear();
    router.push("/auth");
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="w-72 shrink-0 md:block h-screen fixed bg-white dark:bg-black top-0 overflow-hidden">
      <div className="w-full h-full border-r">
        <div className="p-4 md:p-6 flex justify-center items-center gap-2">
        <SparklesText text="100xTests" className={"text-3xl"} />

        </div>

        <hr className="mx-2" />

        <div className="flex flex-col h-full justify-between">
          <div className="pt-6 font-medium space-y-2 px-4 text-xs">
            {navbarItems.map((item) => (
              <SidebarItem key={item.id} title={item.title} path={item.path} icon={item.icon} />
            ))}
          </div>

          <div>
            <hr className="mx-2 my-4" />
            <div className="flex pb-28 justify-center px-4 md:px-6 items-center w-full">
              <div className="flex flex-col items-center w-full justify-center gap-4">
                {student ? (
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-primary text-base bg-opacity-20 px-8">
                      {student.name}
                    </p>
                    <p className="text-xs font-medium">{student.email}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold">Admin</p>
                    <p className="text-xs font-medium">abc@example.com</p>
                  </div>
                )}

                <Button onPress={onOpen} color="primary" variant="shadow" className="h-8 py-1 px-2 rounded-lg text-xs">
                  <LogoutCurve size={16} />
                  <span>Logout</span>
                </Button>

                <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">Are you sure you want to Logout?</ModalHeader>
                        <ModalFooter>
                          <Button color="primary" variant="light" onPress={onClose}>No</Button>
                          <Button onClick={handleLogout} color="danger" onPress={onClose}>Yes</Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

                <Button onClick={toggleTheme} color="primary" variant="shadow" className="h-8 py-1 px-2 rounded-lg text-xs">
                  <span>Toggle</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarLayout;

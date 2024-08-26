"use client";

import Link from "next/link";
import { useCentralStore } from "@/lib/StateUtils";
import React, { useEffect, useState } from "react";
import { Element, LogoutCurve } from "iconsax-react";
import SidebarItem from "./SidebarItem";
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

function SidebarLayout() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme()

  const SWITCH = () => {
    switch (resolvedTheme) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('light')
        break
      default:
        break
    }
  }

  const TOGGLE_THEME = () => {
    //@ts-ignore
    if (!document.startViewTransition) SWITCH()

    //@ts-ignore
    document.startViewTransition(SWITCH)
  }

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const navbaritems = [
    { id: 1, title: "Dashboard", path: "/app/dashboard", icon: Element },
  ];

  const [student, setStudent] = useState(null);
  const router = useRouter();
  

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    console.log("Helllo " + token);

    if (token) {
      const decoded = jwt.decode(token);

      if (decoded && decoded.email) {
        fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: decoded.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setStudent(data.user);
            } else {
              router.push("/auth");
            }
          })
          .catch(() => {
            router.push("/auth");
          });
      }
    } else {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();

    router.push("/auth");
  };


  if (!mounted) return null;

  return (
    <div className="w-72 shrink-0 md:block h-screen fixed light light:bg-white dark dark:bg-black top-0 overflow-hidden">
      <div className="w-full h-full border-r">
        <div className="p-4 md:p-6 flex cursor-pointer group justify-center items-center gap-2">
          <div className="flex justify-center flex-col items-center">
            <h1 className="text-lg font-bold ">APTITUDE</h1>
            <p className="text-sm  font-medium">TEST</p>
          </div>
        </div>

        <hr className=" mx-2" />

        <div className="flex flex-col h-full justify-between">
          <div className="pt-6 font-medium space-y-2 px-4 text-xs">
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
            <hr className=" mx-2 my-4" />
            <div className="flex pb-28 justify-center px-4 md:px-6 items-center w-full">
              <div className="flex flex-col items-center w-full justify-center gap-4">
                {student ? (
                  <div className="flex items-center justify-center flex-col ">
                    <p className=" font-semibold text-primary text-base  bg-opacity-20 px-8">
                      {student.name}
                    </p>
                    <p className="text-xs overflow-clip font-medium ">
                      {student.email}
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <p className="text-sm font-semibold ">Admin</p>
                    <p className="text-xs font-medium ">abc@example.com</p>
                  </div>
                )}

                  <Button
                    onPress={onOpen}
                    color="primary"
                    variant="shadow"
                    className="h-8 gap-1  py-1 px-2 duration-200 rounded-lg text-xs flex items-center justify-center"
                  >
                    <LogoutCurve size={16} />
                    <span>Logout</span>
                  </Button>

                <Modal
                  backdrop="blur"
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  className=" bg-opacity-45  backdrop-blur"
                  classNames={{
                    backdrop:
                      "bg-gradient-to-t  z-50 from-primary backdrop-opacity-50",
                  }}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Are you sure you want to Logout?
                        </ModalHeader>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            No
                          </Button>
                          <Button onClick={handleLogout} color="danger" onPress={onClose}>
                            Yes
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

              
                <Button
                  onClick={TOGGLE_THEME}
                  color="primary"
                  variant="shadow"
                  className="h-8 gap-1  py-1 px-2 duration-200 rounded-lg text-xs flex items-center justify-center"
                >
                  <span className="">Toggle</span>
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

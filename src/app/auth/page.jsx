"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@nextui-org/card";
import { Button, Input } from "@nextui-org/react";
import { motion } from "framer-motion";
import { BorderBeam } from "@/components/ui/borderbeam";
import DotPattern from "@/components/ui/dotpatterrn";
import SparklesText from "@/components/ui/magictext";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { email, password, name }
      : { email, password };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (!isRegister) {
        localStorage.setItem("token", data.token);
        router.push("/app");
      } else {
        setIsRegister(false); // Switch to login after successful registration
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 justify-center h-screen">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      />
      <SparklesText text="100xTests" className={"text-6xl"} />
      <Card
        isBlurred
        className="max-w-sm w-full  p-2 shadow-2xl bg-background/60 dark:bg-background/80 border-none"
      >
        <BorderBeam size={250} duration={6} delay={9} />
        <motion.div
            key={isRegister ? "register" : "login"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            layout
          >

        <CardBody>
          
            <h2 className="text-2xl font-bold text-center">
              {isRegister ? "Register" : "Login"}
            </h2>
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <Input
                  isRequired
                  color="primary"
                  type="text"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 mb-4"
                />
              )}
              <Input
                isRequired
                color="primary"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4"
              />
              <Input
                isRequired
                color="primary"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4"
              />
              <Button
                type="submit"
                className="w-full p-2 font-bold text-white bg-blue-500 hover:bg-blue-600"
              >
                {isRegister ? "Register" : "Login"}
              </Button>
            </form>
            <p className="text-center mt-4">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsRegister(false)}
                  >
                    Login
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsRegister(true)}
                  >
                    Register
                  </span>
                </>
              )}
            </p>
        </CardBody>
        </motion.div>

      </Card>
    </div>
  );
}

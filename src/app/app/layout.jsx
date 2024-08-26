"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarLayout from "@/components/Layouts/Sidebar/SidebarLayout";
import { useCentralStore } from "@/lib/StateUtils";

const AppLayout = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useCentralStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isSidebarOpen ? "overflow-hidden" : ""} h-screen`}
    >
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsSidebarOpen(false)}
            className="bg-black/60 absolute top-0 left-0 md:hidden w-full h-screen z-20"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
            className="absolute md:hidden z-30 top-0 left-0"
          >
            <SidebarLayout />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-[300px_1fr] w-full overflow-x-hidden">
        <div className="hidden md:block">
          <SidebarLayout />
        </div>

        <div className="w-full overflow-x-auto mx-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default AppLayout;

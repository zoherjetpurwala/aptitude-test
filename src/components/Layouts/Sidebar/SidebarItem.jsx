import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link"
import { useCentralStore } from "@/utils/StateUtils";


const SidebarItem = (props) => {
  const pathname = usePathname();
  const { setIsSidebarOpen, isSidebarOpen } = useCentralStore();

  const handleClick = () => {
    if (isSidebarOpen) setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div>
      <Link
      onClick={handleClick}
        href={props.path}
        className={`flex ${
          pathname === props.path
            ? "text-primary text-base bg-primary bg-opacity-20 px-8"
            : ""
        }  hover:px-8 duration-200 px-6 py-2 items-center gap-2 rounded-lg`}
      >

        {props.icon && React.createElement(props.icon, { size: 16 })}
        <span>{props.title}</span>
      </Link>
    </div>
  );
};

export default SidebarItem;

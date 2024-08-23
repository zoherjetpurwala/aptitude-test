"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";

function LogoutModal() {
  const searchParams = useSearchParams();
  const logoutmodal = searchParams.get("logoutmodal");
  const pathname = usePathname();
  const router = useRouter();


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();

    router.push("/login");
  };

  return (
    <>
      {logoutmodal && (
        <dialog className="fixed left-0 top-0 w-full h-full bg-primary bg-opacity-20 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <div className="bg-white m-auto p-8 rounded-lg">
            <div className="flex flex-col">
              <p>Are you sure you want to Logout?</p>
              <br />
              <div className="flex justify-end">
              <Link href={pathname}>
                <button type="button" className=" rounded-2xl text-primary w-16 p-2">
                  No
                </button>
              </Link>
              <Link href={"/login"}>
                <button type="button" onClick={handleLogout} className="bg-primary rounded-2xl w-16 text-white p-2">
                  Yes
                </button>
              </Link>
              </div>
 
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default LogoutModal;

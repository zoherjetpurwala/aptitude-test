"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

function LogoutModal() {
  const searchParams = useSearchParams();
  const logoutmodal = searchParams.get("logoutmodal");
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();

    router.push("/auth");
  };

  return (
    <>
      {logoutmodal && (
        <dialog className="fixed left-0 top-0 w-full h-full bg-primary bg-opacity-10 z-50 overflow-auto backdrop-blur flex justify-center items-center">
          <Card className="m-auto p-5">
            <CardBody>
              <div className="flex flex-col">
                <p>Are you sure you want to Logout?</p>
                <br />
                <div className="flex justify-end gap-1">
                  <Link href={pathname}>
                    <Button
                      color="primary"
                      variant="light"
                      type="button"
                      className=" rounded-2xl  w-16 p-2"
                    >
                      No
                    </Button>
                  </Link>
                  <Link href={"/auth"}>
                    <Button
                      variant="flat"
                      color="primary"
                      type="button"
                      onClick={handleLogout}
                      className="rounded-2xl w-16 text-white p-2"
                    >
                      Yes
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </dialog>
      )}
    </>
  );
}

export default LogoutModal;

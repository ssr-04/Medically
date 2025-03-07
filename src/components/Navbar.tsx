import Link from "next/link"
import DesktopNavBar from "./DesktopNavBar"
import MobileNavBar from "./MobileNavBar"
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

const Navbar = async() => {
  const user = await currentUser();
  if(user) await syncUser();
  
  return (
    <nav className="top-0 stciky w-full border-b bg-background/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-background/60 border-gray-500">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
                <div>
                    <Link href="/" className="text-xl font-bold tracking-wider font-mono">
                    Medicaly
                    </Link>
                </div>

                <DesktopNavBar />
                <MobileNavBar />
            </div>
        </div>
    </nav>
  )
}

export default Navbar
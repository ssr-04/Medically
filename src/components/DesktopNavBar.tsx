import Link from "next/link"
import { Button } from "./ui/button"
import { HomeIcon, LogsIcon, PillIcon, StethoscopeIcon } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, UserButton, UserProfile } from "@clerk/nextjs"

const DesktopNavBar = async () => {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost">
            <Link href="/" className="flex items-center gap-2">
                <HomeIcon className="w-4 h-4"/>
                <span className="hidden lg:inline">Home</span>
            </Link>
        </Button>
        {user ? (
            <div className="flex items-center space-x-2">
                <Link href="/medications" className="flex items-center gap-2">
                    <Button variant="ghost">
                        <PillIcon className="w-4 h-4"/>
                        <span className="hidden md:inline">Medications</span>
                    </Button>
                </Link>
                <Link href="/conditions">
                    <Button variant="ghost" className="flex items-center gap-2">
                        <StethoscopeIcon />
                        <span className="hidden md:inline">Conditions</span>
                    </Button>
                </Link>
                <Link href="logs">
                    <Button variant="ghost" className="flex items-center gap-2">
                        <LogsIcon />
                        <span className="hidden md:inline">Med Logs</span>
                    </Button>
                </Link>
                <UserButton />
            </div>
        ) : (
            <SignInButton mode="modal">
                <Button variant="default">
                    Sign In
                </Button>
            </SignInButton>
        )}
    </div>
  )
}

export default DesktopNavBar
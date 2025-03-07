"use client";

import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { Button } from "./ui/button";
import { HomeIcon, LogOutIcon, LogsIcon, MenuIcon, PillIcon, StethoscopeIcon } from "lucide-react";
import Link from "next/link";

const MobileNavBar = () => {
  const { isSignedIn } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Function to close menu on item click
  const handleMenuClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
              <Link href="/" onClick={handleMenuClick}>
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {isSignedIn ? (
              <>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link href="/medications" onClick={handleMenuClick}>
                    <PillIcon className="w-4 h-4" />
                    Medications
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link href="/conditions" onClick={handleMenuClick}>
                    <StethoscopeIcon className="w-4 h-4" />
                    Conditions
                  </Link>
                </Button>
                <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link href="/logs" onClick={handleMenuClick}>
                    <LogsIcon className="w-4 h-4" />
                    Med Logs
                  </Link>
                </Button>
                <SignOutButton>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start w-full"
                    onClick={handleMenuClick}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Logout
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="redirect">
                <Button variant="default" className="w-full" onClick={handleMenuClick}>
                  Sign In
                </Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavBar;

"use client";

import { UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end items-center gap-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
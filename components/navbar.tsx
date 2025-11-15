"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import CreateBankDialog from "./create-bank";

export default function Navbar() {
  const [openCreateBank, setOpenCreateBank] = useState(false);

  return (
    <>
      <nav className="w-full border-b bg-white p-4 flex justify-between items-center">
        {/* Left side title */}
        <h1 className="text-xl font-semibold">Bank Statement</h1>

        {/* Right side round + button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setOpenCreateBank(true)}>
              Create Bank
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Create Bank Dialog */}
      <CreateBankDialog
        open={openCreateBank}
        onOpenChange={setOpenCreateBank}
      />
    </>
  );
}

/* eslint-disable react/prop-types */
import { Menu } from "lucide-react";
import ModeToggle from "../ThemeToggle";
import { Button } from "../ui/button";
import DialogComponent from "../DialogComponent";
import AccountVerificationForm from "@/features/auth/components/AccountVerificationForm";
import { useState } from "react";

export default function DashHeader({
  setMobileMenuOpen,
  mobileMenuOpen,
  user,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  return (
    <header>
      <div className="flex items-center justify-between py-8">
        <span className="text-2xl font-bold truncate">
          Hallo {user?.firstName}
        </span>
        <div className="flex gap-2 items-center">
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </div>
      {!user?.verified && isDialogOpen && (
        <DialogComponent
          title="Verifikasi akun Anda"
          description="Masukkan kode yang kami kirimkan kepada Anda"
          content={<AccountVerificationForm onSuccess={handleCloseDialog} />}
        >
          <p className="text-sm text-primary hover:underline cursor-pointer my-4">
            Kami telah mengirimkan email konfirmasi, klik di sini untuk verifikasi akun Anda.
          </p>
        </DialogComponent>
      )}
    </header>
  );
}

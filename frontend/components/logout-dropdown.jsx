import { logout } from "@/actions/auth-action";
import { LogOut } from "lucide-react";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

export default function LogoutDropDown() {
  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenuContent align="center">
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

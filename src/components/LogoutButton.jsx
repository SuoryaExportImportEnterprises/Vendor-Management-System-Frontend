import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleLogout}
      className="mt-2"
    >
      Logout
    </Button>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import API_BASE_URL from "../config/api";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Invalid username or password");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("authToken", result.token);
      localStorage.setItem("username", data.username);

      toast.success("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      toast.error("Cannot connect to server");
      console.error("Login error:", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden relative">

        {/* Top Orange Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>

        <CardHeader className="text-center mt-6">

          {/* Circular Logo */}
          <div className="mx-auto w-20 h-20 rounded-full bg-orange-500 shadow-md flex items-center justify-center">
            {/* Replace this image path with your local image */}
            <img
              src="/logoImage.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-4">
            <CardTitle className="text-3xl font-bold text-orange-600">
              Suorya
            </CardTitle>
            <h2 className="text-xl font-semibold mt-1">Vendor Management System</h2>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                {...register("username", { required: "Username is required" })}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                {...register("password", { required: "Password is required" })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

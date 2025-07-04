// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/PhoneInput";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"driver" | "client" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [license_number, setLicenseNumber] = useState("");
  const [frequent_location, setFrequentLocation] = useState("");
  const [personalID, setPersonalID] = useState<File | null>(null);

  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleRoleChange = (newRole: "driver" | "client") => {
    setRole(newRole);
    if (newRole === "client") {
      setLicenseNumber("");
      setFrequentLocation("");
      setPersonalID(null);
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!username || !email || !phone || !role) {
        toast.error("Please fill out all required fields.");
        return false;
      }
      if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        toast.error("Please enter a valid email address.");
        return false;
      }
    } else if (step === 2) {
      if (!password || !confirmPassword) {
        toast.error("Please enter both password fields.");
        return false;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return false;
      }
    } else if (step === 3 && role === "driver") {
      if (!license_number || !frequent_location || !personalID) {
        toast.error("Please provide all driver information.");
        return false;
      }
      if (!personalID.type.startsWith("image/")) {
        toast.error("Personal ID must be an image file.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1 && role === "client") {
        setStep(2);
      } else if (step < (role === "driver" ? 3 : 2)) {
        setStep(step + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (step === 2 && role === "client") {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  async function handleRegister() {
    if (!validateStep()) return;

    try {
      const regData: RegisterData = {
        username,
        email,
        phone,
        role: role as "driver" | "client",
        password,
        ...(role === "driver" && {
          license_number,
          frequent_location,
          personalID,
        }),
      };

      await register(regData);
      toast.success("Registration successful!");
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.error?.details) {
        const errors = err.response.data.error.details;
        const errorMessage = Object.values(errors).flat().join(" ") || "Registration failed.";
        toast.error(errorMessage);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Create Your Account</h1>
                  <p className="text-muted-foreground text-balance">
                    Step {step} of {role === "driver" ? 3 : 2}:{" "}
                    {step === 1
                      ? "Account Details"
                      : step === 2
                      ? "Password Setup"
                      : "Driver Information"}
                  </p>
                </div>

                {step === 1 && (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <PhoneInput
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        defaultCountry="RW"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={handleRoleChange}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {step === 3 && role === "driver" && (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="license-number">License Number</Label>
                      <Input
                        id="license-number"
                        placeholder="Enter license number"
                        value={license_number}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="frequent-location">Frequent Location</Label>
                      <Input
                        id="frequent-location"
                        placeholder="Enter frequent location"
                        value={frequent_location}
                        onChange={(e) => setFrequentLocation(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="personal-id">Personal ID Upload</Label>
                      <Input
                        id="personal-id"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setPersonalID(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <Button variant="outline" onClick={handlePrevious} disabled={loading}>
                      Previous
                    </Button>
                  )}
                  {step < (role === "driver" ? 3 : 2) ? (
                    <Button onClick={handleNext} disabled={loading} className="ml-auto">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleRegister} disabled={loading} className="ml-auto">
                      {loading ? "Registering…" : "Register"}
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login here
                  </Link>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-6">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
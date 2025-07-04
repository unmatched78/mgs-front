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
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"shop" | "vet" | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shop_name, setShopName] = useState("");
  const [shop_email, setShopEmail] = useState("");
  const [shop_phone, setShopPhone] = useState("");
  const [shop_address, setShopAddress] = useState("");
  const [license_number, setLicenseNumber] = useState("");
  const [vet_email, setVetEmail] = useState("");
  const [vet_phone, setVetPhone] = useState("");

  const { registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/home";

  const handleRoleChange = (newRole: "shop" | "vet") => {
    setRole(newRole);
    if (newRole === "vet") {
      setShopName("");
      setShopEmail("");
      setShopPhone("");
      setShopAddress("");
    } else {
      setLicenseNumber("");
      setVetEmail("");
      setVetPhone("");
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
    } else if (step === 3) {
      if (role === "shop" && (!shop_name || !shop_email || !shop_phone)) {
        toast.error("Please provide all shop information.");
        return false;
      }
      if (role === "vet" && (!license_number || !vet_email || !vet_phone)) {
        toast.error("Please provide all veterinary information.");
        return false;
      }
      if (role === "shop" && shop_email && !shop_email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        toast.error("Please enter a valid shop email address.");
        return false;
      }
      if (role === "vet" && vet_email && !vet_email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        toast.error("Please enter a valid veterinary email address.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
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
        role: role as "shop" | "vet",
        password,
        ...(role === "shop" && {
          shop_name,
          shop_email,
          shop_phone,
          shop_address,
        }),
        ...(role === "vet" && {
          license_number,
          vet_email,
          vet_phone,
        }),
      };

      await registerUser(regData);
      toast.success("Registration successful!");
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
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
                    Step {step} of 3: {step === 1 ? "Account Details" : step === 2 ? "Password Setup" : "Role Information"}
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
                          <SelectItem value="shop">Shop Staff</SelectItem>
                          <SelectItem value="vet">Veterinary</SelectItem>
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

                {step === 3 && role === "shop" && (
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="shop-name">Shop Name</Label>
                      <Input
                        id="shop-name"
                        placeholder="Enter shop name"
                        value={shop_name}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="shop-email">Shop Email</Label>
                      <Input
                        id="shop-email"
                        type="email"
                        placeholder="shop@example.com"
                        value={shop_email}
                        onChange={(e) => setShopEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="shop-phone">Shop Phone</Label>
                      <PhoneInput
                        id="shop-phone"
                        value={shop_phone}
                        onChange={(e) => setShopPhone(e.target.value)}
                        placeholder="Enter shop phone number"
                        defaultCountry="RW"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="shop-address">Shop Address</Label>
                      <Input
                        id="shop-address"
                        placeholder="Enter shop address"
                        value={shop_address}
                        onChange={(e) => setShopAddress(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {step === 3 && role === "vet" && (
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
                      <Label htmlFor="vet-email">Veterinary Email</Label>
                      <Input
                        id="vet-email"
                        type="email"
                        placeholder="vet@example.com"
                        value={vet_email}
                        onChange={(e) => setVetEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="vet-phone">Veterinary Phone</Label>
                      <PhoneInput
                        id="vet-phone"
                        value={vet_phone}
                        onChange={(e) => setVetPhone(e.target.value)}
                        placeholder="Enter veterinary phone number"
                        defaultCountry="RW"
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
                  {step < 3 ? (
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
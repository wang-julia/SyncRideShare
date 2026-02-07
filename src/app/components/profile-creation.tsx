import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { User, Mail, Calendar as CalendarIcon, Lock, ArrowLeft, AlertCircle, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  phoneNumber: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  phoneNumber: string;
}

interface ProfileCreationProps {
  onSubmit: (data: SignupData) => Promise<void>;
  onBack?: () => void;
}

export function ProfileCreation({ onSubmit, onBack }: ProfileCreationProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<UserProfile["gender"]>("prefer-not-to-say");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!email.toLowerCase().endsWith("@columbia.edu")) {
      setError("Please use your Columbia University email address (@columbia.edu)");
      return;
    }

    setIsLoading(true);
    
    const data: SignupData = {
      name,
      email,
      password,
      age: parseInt(age),
      gender,
      phoneNumber,
    };

    try {
      console.log("Submitting signup form...");
      await onSubmit(data);
      console.log("Signup submission completed successfully");
      // If we reach here, signup was successful and the parent component will handle navigation
    } catch (err) {
      console.error("Signup error caught in form:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      // Make rate limit errors more user-friendly
      if (errorMessage.includes('rate limit') || errorMessage.includes('wait')) {
        setError("Please wait a minute before trying again. This helps keep your account secure.");
      } else {
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <Card className="p-6 border-[#4a85c8] border-2 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-[#4a85c8]">
                <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-2xl">
                  {name ? getInitials(name) : <User className="w-10 h-10" />}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-2xl mb-2">Create Your Profile</h2>
            <p className="text-gray-600">Let's get you set up to find ride matches</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@columbia.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="123-456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="21"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                Gender
              </Label>
              <RadioGroup value={gender} onValueChange={(value) => setGender(value as UserProfile["gender"])} disabled={isLoading}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary" className="cursor-pointer">Non-binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                  <Label htmlFor="prefer-not-to-say" className="cursor-pointer">Prefer not to say</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full hover:bg-opacity-90" 
              style={{ backgroundColor: '#4a85c8' }}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your information will be used to match you with compatible ride-share partners
          </p>
        </Card>
      </div>
    </div>
  );
}
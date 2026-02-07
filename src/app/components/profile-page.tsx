import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { User, Mail, Calendar as CalendarIcon, Phone, ArrowLeft, AlertCircle, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { UserProfile } from "@/app/components/profile-creation";

interface ProfilePageProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => Promise<void>;
  onBack: () => void;
}

export function ProfilePage({ userProfile, onUpdateProfile, onBack }: ProfilePageProps) {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age.toString());
  const [gender, setGender] = useState<UserProfile["gender"]>(userProfile.gender);
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    setIsLoading(true);

    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      age: parseInt(age),
      gender,
      phoneNumber,
    };

    try {
      await onUpdateProfile(updatedProfile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
    } finally {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto p-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6 border-[#4a85c8] border-2 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="w-20 h-20 ring-2 ring-offset-2 ring-[#4a85c8]">
                <AvatarFallback style={{ backgroundColor: '#4a85c8' }} className="text-white text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-2xl mb-2">Your Profile</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">Profile updated successfully!</p>
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

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
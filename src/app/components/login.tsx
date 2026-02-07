import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import logo from "figma:asset/7107bd02e613dd856c16fb749845e9f675c7d7ba.png";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.toLowerCase().endsWith("@columbia.edu")) {
      setError("Please use your @columbia.edu email address");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="Logo" className="h-56" />
            </div>
            <h2 className="text-2xl mb-2">Welcome Back</h2>
            <p className="text-gray-600">Log in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full hover:bg-opacity-90 text-white"
              style={{ backgroundColor: '#4a85c8' }}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <button
              onClick={onBack}
              className="font-semibold hover:underline"
              style={{ color: '#4a85c8' }}
            >
              Sign up
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
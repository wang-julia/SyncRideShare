import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Users, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/7107bd02e613dd856c16fb749845e9f675c7d7ba.png";

interface WelcomeProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Welcome({ onLogin, onSignup }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logo} alt="Logo" className="h-64" />
          </div>
          <p className="text-gray-600 text-lg">Share rides to NYC airports and stations with fellow Columbia students</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e8f1fa' }}>
                <Users className="w-5 h-5" style={{ color: '#4a85c8' }} />
              </div>
              <div>
                <h3 className="font-semibold">Find Matches</h3>
                <p className="text-sm text-gray-600">Connect with students heading to the same locations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e8f1fa' }}>
                <MapPin className="w-5 h-5" style={{ color: '#4a85c8' }} />
              </div>
              <div>
                <h3 className="font-semibold">Share Locations</h3>
                <p className="text-sm text-gray-600">Coordinate pickup points and routes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e8f1fa' }}>
                <MessageCircle className="w-5 h-5" style={{ color: '#4a85c8' }} />
              </div>
              <div>
                <h3 className="font-semibold">Chat & Coordinate</h3>
                <p className="text-sm text-gray-600">Message your matches to finalize details</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onSignup}
              className="w-full hover:bg-opacity-90 text-white"
              style={{ backgroundColor: '#4a85c8' }}
            >
              Get Started
            </Button>
            
            <Button 
              onClick={onLogin}
              variant="outline"
              className="w-full border-2"
              style={{ borderColor: '#4a85c8', color: '#4a85c8' }}
            >
              Log In
            </Button>
          </div>
        </Card>

        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

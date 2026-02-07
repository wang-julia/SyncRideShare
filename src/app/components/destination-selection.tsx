import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";
import logo from "@/assets/7107bd02e613dd856c16fb749845e9f675c7d7ba.png";

interface DestinationSelectionProps {
  onSelectAirport: (airport: string) => void;
  onBack?: () => void;
  onHome?: () => void;
}

const AIRPORTS = [
  { code: "JFK", name: "John F. Kennedy International Airport" },
  { code: "LGA", name: "LaGuardia Airport" },
  { code: "EWR", name: "Newark Liberty International Airport" },
  { code: "PENN", name: "Penn Station" },
  { code: "GCT", name: "Grand Central Terminal" },
];

export function DestinationSelection({ onSelectAirport, onBack, onHome }: DestinationSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="-ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
          {onHome && (
            <Button
              variant="ghost"
              onClick={onHome}
              className="ml-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          )}
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logo} alt="Logo" className="h-32" />
          </div>
          <p className="text-gray-600">Find students to share your ride</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl mb-4">Where are you heading?</h2>
          {AIRPORTS.map((airport) => (
            <Card
              key={airport.code}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelectAirport(airport.code)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl mb-1">{airport.code}</div>
                  <div className="text-sm text-gray-600">{airport.name}</div>
                </div>
                <div style={{ color: '#4a85c8' }}>→</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

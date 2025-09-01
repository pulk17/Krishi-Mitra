import { Leaf, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Krishi Mitra</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Demo Farmer
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
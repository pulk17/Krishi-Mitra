import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-800">Krishi Mitra</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            AI-powered plant disease detection for healthier crops
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 Krishi Mitra. Helping farmers grow better crops with AI technology.
          </p>
        </div>
      </div>
    </footer>
  );
}
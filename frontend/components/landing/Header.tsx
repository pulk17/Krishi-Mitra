"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Leaf, LogIn } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export function LandingHeader() {
  const [supabase, setSupabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
      setError(null);
    } catch (err) {
      console.error("Failed to initialize Supabase:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize authentication"
      );
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert(
        t.authNotAvailable ||
          "Authentication not available. Please check configuration."
      );
      return;
    }

    setLoading(true);
    try {
      // Use the standard redirect flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(`${t.signInFailed || "Sign in failed"}: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-6xl items-center">
        <div className="mr-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold text-lg">{t.appName}</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <LanguageSelector variant="header" disabled={loading} />
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading || !!error}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t.signingIn || "Signing in..."}
              </>
            ) : error ? (
              "Config Error"
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {t.signInWithGoogle}
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
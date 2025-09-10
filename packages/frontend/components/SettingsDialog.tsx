"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Save, Database } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const {
    user,
    profile,
    isGuest,
    loading: authLoading,
    refreshProfile,
  } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (isGuest) return;

    setLoading(true);
    setMessage("");

    try {
      // Call the backend API to update the profile
      await apiClient.put('/api/user/profile', { full_name: fullName });

      // Manually refresh the profile in the auth context to trigger a global update
      await refreshProfile();
      
      setMessage("Profile updated successfully!");
      
      setTimeout(() => {
        setMessage("");
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setMessage(`Failed to update profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Profile Section */}
          {!isGuest && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={authLoading}
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={loading || authLoading}
                className="w-full"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Profile
              </Button>
            </div>
          )}

          {/* Data & Privacy Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data & Privacy
            </h3>
            <div className="text-sm text-muted-foreground">
              {isGuest ? (
                <p>Your data is stored locally in your browser. Sign in to sync across devices.</p>
              ) : (
                <p>Your data is securely stored and synced across your devices.</p>
              )}
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
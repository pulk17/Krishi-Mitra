'use client'

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { DashboardStats } from "@/components/dashboard-stats";
import { DiagnosisFlow } from "@/components/DiagnosisFlow";

/**
 * Main application page.
 * This component acts as the primary layout container, assembling all the 
 * feature components into a cohesive user interface. It is kept clean and
 * declarative, delegating all logic to its child components.
 */
export default function PlantDiagnosisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <WelcomeBanner />
          <DashboardStats />
          <DiagnosisFlow />
        </div>
      </main>
      <Footer />
    </div>
  );
}
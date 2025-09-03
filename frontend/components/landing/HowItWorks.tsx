'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, BrainCircuit, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: <Camera className="h-8 w-8 text-green-600" />,
      title: t.step1Title,
      description: t.step1Description,
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-green-600" />,
      title: t.step2Title,
      description: t.step2Description,
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
      title: t.step3Title,
      description: t.step3Description,
    },
  ];
  
  return (
    <section className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        {t.howItWorksTitle}
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        {t.howItWorksDescription}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <div className="mb-4 flex justify-center">{icon}</div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
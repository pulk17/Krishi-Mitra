'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Globe, Leaf, History } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Features() {
  const { t } = useLanguage()
  
  const features = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-green-600" />,
      title: t.feature1Title,
      description: t.feature1Description,
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: t.feature2Title,
      description: t.feature2Description,
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: t.feature3Title,
      description: t.feature3Description,
    },
    {
      icon: <History className="h-8 w-8 text-green-600" />,
      title: t.feature4Title,
      description: t.feature4Description,
    },
  ];

  return (
    <section className="container py-24 sm:py-32">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t.featuresTitle}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.featuresDescription}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }) => (
          <Card key={title} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="mb-4 flex justify-center">{icon}</div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
"use client";

import { Header } from "@/components/layout";
import { HeroEnhanced } from "@/components/HeroEnhanced";
import { SolutionSection } from "@/components/sections/solution-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { WorkflowVisualSection } from "@/components/sections/workflow-visual-section";
import { ScreenshotShowcaseSection } from "@/components/sections/screenshot-showcase-section";
import { FeaturesShowcaseSection } from "@/components/sections/features-showcase-section";
import { FeatureShowcaseWithImages } from "@/components/sections/feature-showcase-with-images";
import { ComparisonStatsSection } from "@/components/sections/comparison-stats-section";
import { TargetUsersSection } from "@/components/sections/target-users-section";
import { RoadmapSection } from "@/components/sections/roadmap-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCTASection } from "@/components/sections/final-cta-section";
import { Footer } from "@/components/layout";

const Index = () => {
  return (
    <>
      <Header />
      <HeroEnhanced />
      <SolutionSection />
      <ScreenshotShowcaseSection />
      <FeatureShowcaseWithImages />
      <ComparisonStatsSection />
      <WorkflowVisualSection />
      <HowItWorksSection />
      <FeaturesShowcaseSection />
      <TargetUsersSection />
      <RoadmapSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  );
};

export default Index;

import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import MapDashboard from "@/components/MapDashboard";
import FilterSheet from "@/components/FilterSheet";
import AIChatBot from "@/components/AIChatBot";
import ContributorForm from "@/components/ContributorForm";

const Index = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <AppHeader />
      <MapDashboard activeFilters={activeFilters} />
      <FilterSheet
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
        onOpenChange={setFiltersOpen}
      />
      <AIChatBot fabOffset={filtersOpen} />
      <ContributorForm fabOffset={filtersOpen} />
    </div>
  );
};

export default Index;

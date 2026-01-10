import { useState } from 'react';
import { categories, Subcategory } from '@/components/data/catalogData';

export function useCatalogState() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubSubcategoryDialogOpen, setIsSubSubcategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<typeof categories[0] | null>(null);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  return {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedSubSubcategory,
    setSelectedSubSubcategory,
    isCategoryDialogOpen,
    setIsCategoryDialogOpen,
    isSubSubcategoryDialogOpen,
    setIsSubSubcategoryDialogOpen,
    currentCategory,
    setCurrentCategory,
    currentSubcategory,
    setCurrentSubcategory,
    isSideMenuOpen,
    setIsSideMenuOpen,
    expandedCategories,
    setExpandedCategories,
    expandedSubcategories,
    setExpandedSubcategories,
    searchQuery,
    setSearchQuery,
    selectedSeries,
    setSelectedSeries,
  };
}

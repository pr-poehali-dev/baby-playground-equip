import { categories, Subcategory } from '@/components/data/catalogData';

interface CatalogHandlersProps {
  setSelectedCategory: (value: string | null) => void;
  setSelectedSubcategory: (value: string | null) => void;
  setSelectedSubSubcategory: (value: string | null) => void;
  setCurrentCategory: (value: typeof categories[0] | null) => void;
  setCurrentSubcategory: (value: Subcategory | null) => void;
  setIsCategoryDialogOpen: (value: boolean) => void;
  setIsSubSubcategoryDialogOpen: (value: boolean) => void;
  setIsSideMenuOpen: (value: boolean) => void;
  setExpandedSubcategories: (value: string[] | ((prev: string[]) => string[])) => void;
  setSelectedSeries: (value: string | null) => void;
  currentCategory: typeof categories[0] | null;
  currentSubcategory: Subcategory | null;
}

export function useCatalogHandlers(props: CatalogHandlersProps) {
  const {
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedSubSubcategory,
    setCurrentCategory,
    setCurrentSubcategory,
    setIsCategoryDialogOpen,
    setIsSubSubcategoryDialogOpen,
    setIsSideMenuOpen,
    setExpandedSubcategories,
    setSelectedSeries,
    currentCategory,
    currentSubcategory,
  } = props;

  const handleCategoryClick = (cat: typeof categories[0]) => {
    setCurrentCategory(cat);
    setIsCategoryDialogOpen(true);
  };

  const handleSubcategorySelect = (sub: Subcategory) => {
    if (sub.hasChildren && sub.children) {
      setCurrentSubcategory(sub);
      setIsSubSubcategoryDialogOpen(true);
      setIsCategoryDialogOpen(false);
    } else {
      if (currentCategory) {
        setSelectedCategory(currentCategory.id);
        setSelectedSubcategory(sub.name);
        setSelectedSubSubcategory(null);
        setSelectedSeries(sub.name);
        setIsCategoryDialogOpen(false);
        setTimeout(() => {
          const productsSection = document.getElementById('products');
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  const handleSubSubcategorySelect = (subSubName: string) => {
    if (currentCategory) {
      setSelectedCategory(currentCategory.id);
      setSelectedSubcategory(currentSubcategory?.name || null);
      setSelectedSubSubcategory(subSubName);
      setSelectedSeries(currentSubcategory?.name || null);
      setIsSubSubcategoryDialogOpen(false);
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleTreeCategorySelect = (categoryId: string, categoryData: typeof categories[0]) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedSubSubcategory(null);
    setCurrentCategory(categoryData);
    setIsSideMenuOpen(false);
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const handleTreeSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, sub: Subcategory) => {
    if (sub.hasChildren) {
      const key = `${categoryId}-${subName}`;
      setExpandedSubcategories(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subName);
      setSelectedSubSubcategory(null);
      setCurrentCategory(categoryData);
      setIsSideMenuOpen(false);
      setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleTreeSubSubcategorySelect = (categoryId: string, categoryData: typeof categories[0], subName: string, subSubName: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subName);
    setSelectedSubSubcategory(subSubName);
    setCurrentCategory(categoryData);
    setIsSideMenuOpen(false);
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedSubcategories([]);
  };

  const handleResetFilters = () => {
    setSelectedSubSubcategory(null);
    setSelectedSeries(null);
  };

  return {
    handleCategoryClick,
    handleSubcategorySelect,
    handleSubSubcategorySelect,
    handleTreeCategorySelect,
    handleTreeSubcategorySelect,
    handleTreeSubSubcategorySelect,
    toggleCategory,
    handleResetFilters,
  };
}

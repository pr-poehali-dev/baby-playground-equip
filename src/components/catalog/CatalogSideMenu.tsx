import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface SubSubSubcategory {
  name: string;
  image: string;
}

interface SubSubcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubSubcategory[];
}

interface Subcategory {
  name: string;
  image: string;
  hasChildren?: boolean;
  children?: SubSubcategory[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  image: string;
  bgImage: string;
  subcategories: Subcategory[];
  order?: number;
}

interface CatalogSideMenuProps {
  isSideMenuOpen: boolean;
  setIsSideMenuOpen: (open: boolean) => void;
  categories: Category[];
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  handleTreeCategorySelect: (id: string, cat: Category) => void;
  expandedSubcategories: string[];
  expandedSubSubcategories: string[];
  handleTreeSubcategorySelect: (catId: string, cat: Category, subName: string, sub: Subcategory) => void;
  handleTreeSubSubcategorySelect: (catId: string, cat: Category, subName: string, subSubName: string, subSub: SubSubcategory) => void;
  handleTreeSubSubSubcategorySelect: (catId: string, cat: Category, subName: string, subSubName: string, subSubSubName: string) => void;
}

export function CatalogSideMenu({
  isSideMenuOpen,
  setIsSideMenuOpen,
  categories,
  expandedCategories,
  toggleCategory,
  selectedCategory,
  selectedSubcategory,
  handleTreeCategorySelect,
  expandedSubcategories,
  expandedSubSubcategories,
  handleTreeSubcategorySelect,
  handleTreeSubSubcategorySelect,
  handleTreeSubSubSubcategorySelect,
}: CatalogSideMenuProps) {
  return (
    <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-heading">Каталог</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-2">
          {categories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <Icon 
                      name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                      size={16} 
                    />
                  </Button>
                  <button
                    className={`flex-1 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 bg-white ${
                      selectedCategory === cat.id && !selectedSubcategory ? 'bg-primary/10 text-primary font-semibold' : ''
                    }`}
                    onClick={() => handleTreeCategorySelect(cat.id, cat)}
                  >
                    <span className="text-base flex-1">{cat.name}</span>
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="ml-10 mt-1 space-y-1">
                    {cat.subcategories.map((sub) => {
                      const subKey = `${cat.id}-${sub.name}`;
                      const isSubExpanded = expandedSubcategories.includes(subKey);
                      
                      return (
                        <div key={sub.name}>
                          <div className="flex items-center gap-1">
                            {sub.hasChildren && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-6 h-6 p-0"
                                onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                              >
                                <Icon 
                                  name={isSubExpanded ? "ChevronDown" : "ChevronRight"} 
                                  size={14} 
                                />
                              </Button>
                            )}
                            <button
                              className={`flex-1 text-left px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm ${
                                selectedSubcategory === sub.name ? 'bg-primary/10 text-primary font-semibold' : ''
                              } ${!sub.hasChildren ? 'ml-7' : ''}`}
                              onClick={() => handleTreeSubcategorySelect(cat.id, cat, sub.name, sub)}
                            >
                              {sub.name}
                            </button>
                          </div>
                          
                          {isSubExpanded && sub.children && (
                            <div className="ml-7 mt-1 space-y-1">
                              {sub.children.map((subSub) => {
                                const subSubKey = `${cat.id}-${sub.name}-${subSub.name}`;
                                const isSubSubExpanded = expandedSubSubcategories.includes(subSubKey);
                                
                                return (
                                  <div key={subSub.name}>
                                    <div className="flex items-center gap-1">
                                      {subSub.hasChildren && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-6 h-6 p-0"
                                          onClick={() => handleTreeSubSubcategorySelect(cat.id, cat, sub.name, subSub.name, subSub)}
                                        >
                                          <Icon 
                                            name={isSubSubExpanded ? "ChevronDown" : "ChevronRight"} 
                                            size={14} 
                                          />
                                        </Button>
                                      )}
                                      <button
                                        className={`flex-1 text-left px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm ${
                                          !subSub.hasChildren ? 'ml-7' : ''
                                        }`}
                                        onClick={() => handleTreeSubSubcategorySelect(cat.id, cat, sub.name, subSub.name, subSub)}
                                      >
                                        {subSub.name}
                                      </button>
                                    </div>
                                    
                                    {isSubSubExpanded && subSub.children && (
                                      <div className="ml-7 mt-1 space-y-1">
                                        {subSub.children.map((subSubSub) => (
                                          <button
                                            key={subSubSub.name}
                                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs"
                                            onClick={() => handleTreeSubSubSubcategorySelect(cat.id, cat, sub.name, subSub.name, subSubSub.name)}
                                          >
                                            {subSubSub.name}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
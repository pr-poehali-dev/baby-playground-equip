import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

interface CategoryDialogsProps {
  isCategoryDialogOpen: boolean;
  setIsCategoryDialogOpen: (open: boolean) => void;
  currentCategory: Category | null;
  handleSubcategoryClick: (sub: Subcategory) => void;
  isSubSubcategoryDialogOpen: boolean;
  setIsSubSubcategoryDialogOpen: (open: boolean) => void;
  currentSubcategory: Subcategory | null;
  currentSubSubcategory: SubSubcategory | null;
  handleSubSubcategoryClick: (subSub: SubSubcategory) => void;
  isSubSubSubcategoryDialogOpen: boolean;
  setIsSubSubSubcategoryDialogOpen: (open: boolean) => void;
  handleSubSubSubcategoryClick: (subSubSubName: string) => void;
  currentSubSubSubcategory: SubSubSubcategory | null;
  setCurrentSubSubSubcategory: (cat: SubSubSubcategory | null) => void;
  isFinalCategoryDialogOpen: boolean;
  setIsFinalCategoryDialogOpen: (open: boolean) => void;
  onBackFromSubcategory?: () => void;
  onBackFromSubSubcategory?: () => void;
}

export function CategoryDialogs({
  isCategoryDialogOpen,
  setIsCategoryDialogOpen,
  currentCategory,
  handleSubcategoryClick,
  isSubSubcategoryDialogOpen,
  setIsSubSubcategoryDialogOpen,
  currentSubcategory,
  currentSubSubcategory,
  handleSubSubcategoryClick,
  isSubSubSubcategoryDialogOpen,
  setIsSubSubSubcategoryDialogOpen,
  handleSubSubSubcategoryClick,
  currentSubSubSubcategory,
  setCurrentSubSubSubcategory,
  isFinalCategoryDialogOpen,
  setIsFinalCategoryDialogOpen,
  onBackFromSubcategory,
  onBackFromSubSubcategory,
}: CategoryDialogsProps) {
  const handleBackFromSubcategory = () => {
    setIsCategoryDialogOpen(false);
    if (onBackFromSubcategory) {
      onBackFromSubcategory();
    }
  };

  const handleBackFromSubSubcategory = () => {
    setIsSubSubcategoryDialogOpen(false);
    if (onBackFromSubSubcategory) {
      onBackFromSubSubcategory();
    }
  };
  return (
    <>
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] sm:max-h-[85vh] h-auto sm:h-auto overflow-hidden m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2 sm:pb-4">
            <DialogTitle className="text-2xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-6">
              {currentCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:px-6 sm:pb-6 px-0 py-0 overflow-y-auto">
            {currentCategory?.subcategories.map((sub) => (
              <div
                key={sub.name}
                className="cursor-pointer group"
                onClick={() => handleSubcategoryClick(sub)}
              >
                <div className="relative overflow-hidden rounded-md bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 aspect-[4/3] border-2 border-gray-200 hover:border-gray-200">
                  <div className="absolute inset-0">
                    {sub.image.startsWith('http') ? (
                      <img src={sub.image} alt={sub.name} loading="lazy" className="w-full h-full group-hover:scale-110 transition-transform duration-300 object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{sub.image}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 py-1.5 px-2 -mb-px">
                    <h4 className="font-heading text-white text-base sm:text-xl leading-tight font-light text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-[7px]">{sub.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubSubcategoryDialogOpen} onOpenChange={setIsSubSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] sm:max-h-[85vh] h-auto sm:h-auto overflow-hidden m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2 sm:pb-4">
            <DialogTitle className="text-2xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-4">
              {currentSubcategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 sm:px-4 sm:pb-4 px-0 py-0 overflow-y-auto">
            {currentSubcategory?.children?.map((subSub) => (
              <div key={subSub.name} className="cursor-pointer transition-all hover:shadow-xl overflow-hidden group rounded-md flex flex-col relative border-2 border-gray-200" onClick={() => handleSubSubcategoryClick(subSub)}>
                <div className="aspect-square overflow-hidden flex items-center justify-center p-6 sm:p-4">
                  {subSub.image.startsWith('http') ? (
                    <img src={subSub.image} alt={subSub.name} loading="lazy" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-9xl sm:text-7xl">{subSub.image}</span>
                  )}
                </div>
                <div className="absolute bottom-2 left-0 right-0 py-1 px-2 sm:px-4">
                  <h4 className="font-semibold text-center text-sm sm:text-sm break-words leading-tight text-[#1d2025]">{subSub.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubSubSubcategoryDialogOpen} onOpenChange={setIsSubSubSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] sm:max-h-[85vh] h-auto sm:h-auto overflow-hidden m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full flex flex-col">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2 sm:pb-4">
            <DialogTitle className="text-xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-4">
              {currentSubSubcategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 px-3 pb-3 sm:grid-cols-3 sm:gap-4 sm:px-4 sm:pb-4 overflow-y-auto">
            {currentSubSubcategory?.children?.map((subSubSub) => (
              <div key={subSubSub.name} className="cursor-pointer transition-all hover:shadow-xl overflow-hidden group rounded-md flex flex-col relative border-2 border-gray-200" onClick={() => {
                handleSubSubSubcategoryClick(subSubSub.name);
                setIsSubSubSubcategoryDialogOpen(false);
              }}>
                <div className="aspect-square overflow-hidden flex items-center justify-center p-6 sm:p-4">
                  {subSubSub.image.startsWith('http') ? (
                    <img src={subSubSub.image} alt={subSubSub.name} loading="lazy" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-8xl sm:text-7xl">{subSubSub.image}</span>
                  )}
                </div>
                <div className="absolute bottom-2 left-0 right-0 py-1 px-2 sm:px-4">
                  <h4 className="font-semibold text-center text-sm sm:text-sm break-words leading-tight text-[#1d2025]">{subSubSub.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] sm:max-h-[80vh] h-full sm:h-auto overflow-y-auto m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-4">
              {currentCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 pb-4 sm:pb-0">
            {currentCategory?.subcategories.map((sub) => (
              <div
                key={sub.name}
                className="cursor-pointer transition-all hover:shadow-xl group rounded-md relative"
                onClick={() => handleSubcategoryClick(sub)}
              >
                <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden rounded-md">
                  {sub.image.startsWith('http') ? (
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{sub.image}</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 py-1 px-2">
                    <h4 className="font-heading text-white text-base sm:text-xl leading-tight font-light text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-[7px]">{sub.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubSubcategoryDialogOpen} onOpenChange={setIsSubSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] sm:max-h-[80vh] h-full sm:h-auto overflow-y-auto m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-4">
              {currentSubcategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 px-4 pb-4">
            {currentSubcategory?.children?.map((subSub) => (
              <div key={subSub.name} className="cursor-pointer transition-all hover:shadow-xl overflow-hidden group rounded-md flex flex-col relative border-2 border-gray-200" onClick={() => handleSubSubcategoryClick(subSub)}>
                <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
                  {subSub.image.startsWith('http') ? (
                    <img src={subSub.image} alt={subSub.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-7xl">{subSub.image}</span>
                  )}
                </div>
                <div className="absolute bottom-2 left-0 right-0 py-1 px-2 sm:px-4">
                  <h4 className="font-semibold text-center text-xs sm:text-sm break-words leading-tight text-[#1d2025]">{subSub.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubSubSubcategoryDialogOpen} onOpenChange={setIsSubSubSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] sm:max-h-[80vh] h-full sm:h-auto overflow-y-auto m-0 sm:m-4 rounded-none sm:rounded-lg max-w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-4xl font-heading font-semibold text-center mb-2 sm:mb-4">
              {currentSubSubcategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 px-4 pb-4">
            {currentSubSubcategory?.children?.map((subSubSub) => (
              <div key={subSubSub.name} className="cursor-pointer transition-all hover:shadow-xl overflow-hidden group rounded-md flex flex-col relative border-2 border-gray-200" onClick={() => {
                if (subSubSub.hasChildren && subSubSub.children) {
                  handleSubSubcategoryClick(subSubSub);
                } else {
                  handleSubSubSubcategoryClick(subSubSub.name);
                }
              }}>
                <div className="aspect-square overflow-hidden flex items-center justify-center p-4">
                  {subSubSub.image.startsWith('http') ? (
                    <img src={subSubSub.image} alt={subSubSub.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-7xl">{subSubSub.image}</span>
                  )}
                </div>
                <div className="absolute bottom-2 left-0 right-0 py-1 px-2 sm:px-4">
                  <h4 className="font-semibold text-center text-xs sm:text-sm break-words leading-tight text-[#1d2025]">{subSubSub.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
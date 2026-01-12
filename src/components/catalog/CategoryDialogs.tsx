import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SubSubcategory {
  name: string;
  image: string;
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
  handleSubSubcategoryClick: (subSubName: string) => void;
}

export function CategoryDialogs({
  isCategoryDialogOpen,
  setIsCategoryDialogOpen,
  currentCategory,
  handleSubcategoryClick,
  isSubSubcategoryDialogOpen,
  setIsSubSubcategoryDialogOpen,
  currentSubcategory,
  handleSubSubcategoryClick,
}: CategoryDialogsProps) {
  return (
    <>
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-4xl font-heading font-semibold text-center mb-4">
              {currentCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
            {currentCategory?.subcategories.map((sub) => (
              <Card
                key={sub.name}
                className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-2 overflow-hidden group shadow-md flex flex-col"
                onClick={() => handleSubcategoryClick(sub)}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-white flex items-center justify-center p-2 flex-1">
                  {sub.image.startsWith('http') ? (
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 scale-110" />
                  ) : (
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{sub.image}</span>
                  )}
                </div>
                <div className="py-2 px-4 rounded-none" style={{
                  backgroundColor: sub.name.includes('Classic') ? 'rgba(214, 236, 204, 0.95)' : 
                                   sub.name.includes('Eco') ? 'rgba(232, 222, 248, 0.95)' : 
                                   'white'
                }}>
                  <h4 className="font-semibold text-center sm:text-sm break-words text-base">{sub.name}</h4>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubSubcategoryDialogOpen} onOpenChange={setIsSubSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-4xl font-heading font-semibold text-center mb-4">
              {currentSubcategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {currentSubcategory?.children?.map((subSub) => (
              <Card
                key={subSub.name}
                className="cursor-pointer transition-all hover:shadow-xl overflow-hidden group border-0"
                onClick={() => handleSubSubcategoryClick(subSub.name)}
              >
                <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center p-2">
                  {subSub.image.startsWith('http') ? (
                    <img src={subSub.image} alt={subSub.name} className="w-full h-full object-contain scale-110" />
                  ) : (
                    <span className="text-7xl">{subSub.image}</span>
                  )}
                </div>
                <div className="py-3 px-4 bg-white">
                  <h4 className="text-base font-semibold text-center leading-tight">{subSub.name}</h4>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
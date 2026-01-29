import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ExcelSettingsDialogProps {
  isExcelSettingsOpen: boolean;
  setIsExcelSettingsOpen: (open: boolean) => void;
  imageColumnWidth: number;
  setImageColumnWidth: (width: number) => void;
  imageRowHeight: number;
  setImageRowHeight: (height: number) => void;
}

export function ExcelSettingsDialog({
  isExcelSettingsOpen,
  setIsExcelSettingsOpen,
  imageColumnWidth,
  setImageColumnWidth,
  imageRowHeight,
  setImageRowHeight
}: ExcelSettingsDialogProps) {
  return (
    <Dialog open={isExcelSettingsOpen} onOpenChange={setIsExcelSettingsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настройки изображений для Excel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Ширина колонки с изображением (пиксели)
            </label>
            <Input
              type="number"
              min="50"
              max="500"
              value={imageColumnWidth}
              onChange={(e) => setImageColumnWidth(parseInt(e.target.value) || 100)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Рекомендуется: 100-200 пикселей
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Высота строки (пункты)
            </label>
            <Input
              type="number"
              min="30"
              max="300"
              value={imageRowHeight}
              onChange={(e) => setImageRowHeight(parseInt(e.target.value) || 80)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Рекомендуется: 60-120 пунктов
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setIsExcelSettingsOpen(false)}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

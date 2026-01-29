import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ExcelUploadProps {
  onStatusChange: (status: 'idle' | 'success' | 'error', message: string) => void;
}

export function ExcelUpload({ onStatusChange }: ExcelUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [updateMode, setUpdateMode] = useState<'new' | 'update'>('update');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        onStatusChange('idle', '');
      } else {
        onStatusChange('error', 'Пожалуйста, выберите файл Excel (.xls или .xlsx)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onStatusChange('error', 'Выберите файл для загрузки');
      return;
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      onStatusChange('error', `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)} МБ). Максимальный размер: 3 МБ. Попробуйте удалить изображения из Excel или сжать файл.`);
      return;
    }

    setIsUploading(true);
    onStatusChange('idle', '');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];

          const response = await fetch('https://functions.poehali.dev/3b730be0-98fd-437a-8f8a-3838030eab92', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              content: base64Data,
              updateMode: updateMode,
            }),
          });

          if (!response.ok) {
            throw new Error('Ошибка загрузки файла');
          }

          const result = await response.json();

          if (result.success) {
            const imagesText = result.imagesUploaded ? `, изображений: ${result.imagesUploaded}` : '';
            const updatedText = result.updatedCount ? `, обновлено: ${result.updatedCount}` : '';
            const addedText = result.addedCount ? `, добавлено: ${result.addedCount}` : '';
            onStatusChange('success', `Файл успешно загружен! Обработано товаров: ${result.productsCount || 0}${imagesText}${updatedText}${addedText}. Обновляем каталог...`);
            setFile(null);
            
            const fileInput = document.getElementById('excel-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            throw new Error(result.error || 'Неизвестная ошибка');
          }
        } catch (error) {
          console.error('Upload error:', error);
          onStatusChange('error', error instanceof Error ? error.message : 'Ошибка при загрузке файла');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        onStatusChange('error', 'Ошибка чтения файла');
      };
    } catch (error) {
      console.error('Error:', error);
      setIsUploading(false);
      onStatusChange('error', 'Произошла ошибка');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка Excel-файла с товарами</CardTitle>
        <CardDescription>
          Загрузите Excel-файл (.xls или .xlsx) с товарами. Максимальный размер: 3 МБ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Режим загрузки:</label>
          <div className="flex gap-2">
            <Button
              variant={updateMode === 'update' ? 'default' : 'outline'}
              onClick={() => setUpdateMode('update')}
              className="flex-1"
            >
              Обновить существующие
            </Button>
            <Button
              variant={updateMode === 'new' ? 'default' : 'outline'}
              onClick={() => setUpdateMode('new')}
              className="flex-1"
            >
              Заменить все товары
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {updateMode === 'update' 
              ? 'Обновит существующие товары и добавит новые'
              : 'Удалит все существующие товары и загрузит только из файла'}
          </p>
        </div>

        <div className="space-y-2">
          <Input
            id="excel-file-input"
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Выбран файл: {file.name} ({(file.size / 1024).toFixed(2)} КБ)
            </p>
          )}
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить файл
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

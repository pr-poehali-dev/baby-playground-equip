import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ImageUploadProps {
  onStatusChange: (status: 'idle' | 'success' | 'error', message: string) => void;
}

export function ImageUpload({ onStatusChange }: ImageUploadProps) {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      setImageFiles(imageFiles);
      onStatusChange('idle', '');
    }
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      onStatusChange('error', 'Выберите изображения для загрузки');
      return;
    }

    setIsUploadingImages(true);
    onStatusChange('idle', '');

    try {
      let uploaded = 0;
      let errors = 0;

      for (const file of imageFiles) {
        try {
          const article = file.name.split('.')[0];
          
          const reader = new FileReader();
          const base64Data = await new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const base64 = reader.result as string;
              resolve(base64.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const response = await fetch('https://functions.poehali.dev/cffc3d7a-5348-4b4d-899c-7d41c585573d', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              article: article,
              filename: file.name,
              content: base64Data,
            }),
          });

          if (!response.ok) {
            if (response.status === 413) {
              throw new Error(`Файл ${file.name} слишком большой`);
            }
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();
          if (result.success) {
            uploaded++;
          } else {
            errors++;
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          errors++;
        }
      }

      onStatusChange('success', `Загружено изображений: ${uploaded}${errors > 0 ? `, ошибок: ${errors}` : ''}. Обновляем каталог...`);
      setImageFiles([]);
      const fileInput = document.getElementById('image-files-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Upload images error:', error);
      onStatusChange('error', error instanceof Error ? error.message : 'Ошибка при загрузке изображений');
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Загрузка изображений товаров</CardTitle>
        <CardDescription>
          Загрузите изображения товаров. Имя файла должно совпадать с артикулом товара (например, 12345.jpg)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            id="image-files-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
            disabled={isUploadingImages}
          />
          {imageFiles.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Выбрано файлов: {imageFiles.length}
            </p>
          )}
        </div>

        <Button 
          onClick={handleUploadImages} 
          disabled={imageFiles.length === 0 || isUploadingImages}
          className="w-full"
        >
          {isUploadingImages ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Image" size={16} className="mr-2" />
              Загрузить изображения
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

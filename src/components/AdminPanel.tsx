import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export function AdminPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        setUploadStatus('idle');
        setMessage('');
      } else {
        setMessage('Пожалуйста, выберите файл Excel (.xls или .xlsx)');
        setUploadStatus('error');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Выберите файл для загрузки');
      setUploadStatus('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');
    setMessage('');

    try {
      // Конвертируем файл в base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];

          // Отправляем файл на сервер для загрузки в S3
          const response = await fetch('https://functions.poehali.dev/3b730be0-98fd-437a-8f8a-3838030eab92', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              content: base64Data,
            }),
          });

          if (!response.ok) {
            throw new Error('Ошибка загрузки файла');
          }

          const result = await response.json();

          if (result.success) {
            setUploadStatus('success');
            const imagesText = result.imagesUploaded ? `, изображений: ${result.imagesUploaded}` : '';
            setMessage(`Файл успешно загружен! Обработано товаров: ${result.productsCount || 0}${imagesText}`);
            setFile(null);
            
            // Сбрасываем input
            const fileInput = document.getElementById('excel-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          } else {
            throw new Error(result.error || 'Неизвестная ошибка');
          }
        } catch (error) {
          console.error('Upload error:', error);
          setUploadStatus('error');
          setMessage(error instanceof Error ? error.message : 'Ошибка при загрузке файла');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        setUploadStatus('error');
        setMessage('Ошибка чтения файла');
      };
    } catch (error) {
      console.error('Error:', error);
      setIsUploading(false);
      setUploadStatus('error');
      setMessage('Произошла ошибка');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Upload" size={24} className="text-primary" />
            Загрузка каталога
          </CardTitle>
          <CardDescription>
            Загрузите Excel-файл с каталогом товаров для обновления базы данных
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="excel-file-input" className="text-sm font-medium">
              Выберите файл Excel
            </label>
            <Input
              id="excel-file-input"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="cursor-pointer"
            />
            {file && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon name="FileSpreadsheet" size={16} />
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить каталог
              </>
            )}
          </Button>

          {message && (
            <div
              className={`p-4 rounded-lg border ${
                uploadStatus === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : uploadStatus === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon
                  name={
                    uploadStatus === 'success'
                      ? 'CheckCircle2'
                      : uploadStatus === 'error'
                      ? 'AlertCircle'
                      : 'Info'
                  }
                  size={20}
                  className="flex-shrink-0 mt-0.5"
                />
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold flex items-center gap-2">
              <Icon name="Info" size={16} />
              Требования к файлу:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Формат: .xls или .xlsx</li>
              <li>Структура: Артикул, Название, Категория, Цена, Габариты</li>
              <li>Первая строка должна содержать заголовки</li>
              <li>Изображения внутри файла будут автоматически загружены</li>
              <li>Максимальный размер файла: 10 MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
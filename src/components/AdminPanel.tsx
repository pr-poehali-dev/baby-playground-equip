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
  const [updateMode, setUpdateMode] = useState<'new' | 'update'>('new');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

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
            setUploadStatus('success');
            const imagesText = result.imagesUploaded ? `, изображений: ${result.imagesUploaded}` : '';
            const updatedText = result.updatedCount ? `, обновлено: ${result.updatedCount}` : '';
            const addedText = result.addedCount ? `, добавлено: ${result.addedCount}` : '';
            setMessage(`Файл успешно загружен! Обработано товаров: ${result.productsCount || 0}${imagesText}${updatedText}${addedText}`);
            setFile(null);
            
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

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const response = await fetch('https://functions.poehali.dev/917765db-45ab-4e16-aab0-381a5f51201c');
      const data = await response.json();
      
      if (data.file && data.filename) {
        const byteCharacters = atob(data.file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
      setMessage('Ошибка при скачивании шаблона');
      setUploadStatus('error');
    } finally {
      setIsDownloadingTemplate(false);
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
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Режим загрузки
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="updateMode"
                  value="new"
                  checked={updateMode === 'new'}
                  onChange={(e) => setUpdateMode(e.target.value as 'new' | 'update')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Добавить новые товары</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="updateMode"
                  value="update"
                  checked={updateMode === 'update'}
                  onChange={(e) => setUpdateMode(e.target.value as 'new' | 'update')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Обновить существующие (по артикулу)</span>
              </label>
            </div>
          </div>

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

          <div className="flex gap-3">
            <Button
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              {isDownloadingTemplate ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Скачивание...
                </>
              ) : (
                <>
                  <Icon name="Download" size={20} className="mr-2" />
                  Скачать шаблон
                </>
              )}
            </Button>

            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1"
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
          </div>

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
              <li>Структура: Картинка, Категория, Подкатегория, Подподкатегория, Подподподкатегория, Подподподподкатегория, Артикул, Название, Размеры, Цена</li>
              <li>Первая строка должна содержать заголовки</li>
              <li>Подкатегории можно оставлять пустыми</li>
              <li>Режим "Обновить" — меняет цены/данные по артикулу</li>
              <li>Режим "Добавить" — только новые товары, пропускает дубли</li>
              <li>Максимальный размер файла: 10 MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

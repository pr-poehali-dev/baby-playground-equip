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
  const [updateMode, setUpdateMode] = useState<'new' | 'update'>('update');

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  
  const [articlesToDelete, setArticlesToDelete] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);


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

    // Проверяем размер файла (максимум 3 МБ для облачных функций)
    const maxSize = 3 * 1024 * 1024; // 3 МБ
    if (file.size > maxSize) {
      setMessage(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)} МБ). Максимальный размер: 3 МБ. Попробуйте удалить изображения из Excel или сжать файл.`);
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
            setMessage(`Файл успешно загружен! Обработано товаров: ${result.productsCount || 0}${imagesText}${updatedText}${addedText}. Обновляем каталог...`);
            setFile(null);
            
            const fileInput = document.getElementById('excel-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            // Обновляем страницу через 2 секунды чтобы пользователь успел прочитать сообщение
            setTimeout(() => {
              window.location.reload();
            }, 2000);
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



  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      setImageFiles(imageFiles);
      setUploadStatus('idle');
      setMessage('');
    }
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      setMessage('Выберите изображения для загрузки');
      setUploadStatus('error');
      return;
    }

    setIsUploadingImages(true);
    setUploadStatus('idle');
    setMessage('');

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

      setUploadStatus('success');
      setMessage(`Загружено изображений: ${uploaded}${errors > 0 ? `, ошибок: ${errors}` : ''}. Обновляем каталог...`);
      setImageFiles([]);
      const fileInput = document.getElementById('image-files-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Обновляем страницу через 2 секунды чтобы пользователь успел прочитать сообщение
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Upload images error:', error);
      setUploadStatus('error');
      setMessage(error instanceof Error ? error.message : 'Ошибка при загрузке изображений');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleDeleteByArticles = async () => {
    if (!articlesToDelete.trim()) {
      setMessage('Введите артикулы для удаления');
      setUploadStatus('error');
      return;
    }

    const input = articlesToDelete.trim();
    let articles: string[] = [];

    const rangeMatch = input.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      
      if (start > end) {
        setMessage('Начальный артикул должен быть меньше конечного');
        setUploadStatus('error');
        return;
      }

      const prefix = rangeMatch[1].match(/^0+/)?.[0] || '';
      const length = rangeMatch[1].length;

      for (let i = start; i <= end; i++) {
        articles.push(i.toString().padStart(length, '0'));
      }
    } else {
      articles = input.split('-').map(a => a.trim()).filter(a => a);
    }
    
    if (articles.length === 0) {
      setMessage('Введите корректные артикулы');
      setUploadStatus('error');
      return;
    }

    const confirmMessage = articles.length > 10 
      ? `Удалить ${articles.length} товаров (${articles[0]} - ${articles[articles.length - 1]})? Это необратимо!`
      : `Удалить товары с артикулами: ${articles.join(', ')}? Это необратимо!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    setUploadStatus('idle');
    setMessage('');

    try {
      const response = await fetch('https://functions.poehali.dev/86a5f270-0e5f-4fc8-8762-1839512f352a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: articles
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setMessage(`Удалено товаров: ${result.deleted}`);
        setArticlesToDelete('');
      } else {
        throw new Error(result.error || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUploadStatus('error');
      setMessage(error instanceof Error ? error.message : 'Ошибка при удалении');
    } finally {
      setIsDeleting(false);
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

          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="Image" size={20} className="text-primary" />
                Загрузка изображений
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Загрузите изображения товаров. Имена файлов должны совпадать с артикулами (например: 0230.png, 0231.jpg)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="image-files-input" className="text-sm font-medium">
                Выберите изображения
              </label>
              <Input
                id="image-files-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFilesChange}
                disabled={isUploadingImages}
                className="cursor-pointer"
              />
              {imageFiles.length > 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon name="Image" size={16} />
                  Выбрано файлов: {imageFiles.length}
                </p>
              )}
            </div>

            <Button
              onClick={handleUploadImages}
              disabled={isUploadingImages || imageFiles.length === 0}
              className="w-full"
            >
              {isUploadingImages ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Загрузка изображений...
                </>
              ) : (
                <>
                  <Icon name="Image" size={16} className="mr-2" />
                  Загрузить изображения
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Icon name="Trash2" size={20} className="text-destructive" />
                Удаление товаров
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Введите артикулы через дефис (например: 0230-0235-0240) или диапазон (например: 0230-0235)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="articles-to-delete" className="text-sm font-medium">
                Артикулы для удаления
              </label>
              <Input
                id="articles-to-delete"
                type="text"
                value={articlesToDelete}
                onChange={(e) => setArticlesToDelete(e.target.value)}
                placeholder="0230-0235 (диапазон) или 0230-0235-0240 (список)"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDeleteByArticles}
                disabled={isDeleting || !articlesToDelete.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить выбранные
                  </>
                )}
              </Button>
              
              <Button
                onClick={async () => {
                  if (!confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕ товары из базы данных! Это необратимо! Продолжить?')) {
                    return;
                  }
                  
                  setIsDeleting(true);
                  setUploadStatus('idle');
                  setMessage('');
                  
                  try {
                    const response = await fetch('https://functions.poehali.dev/86a5f270-0e5f-4fc8-8762-1839512f352a', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        articles: ['*']
                      }),
                    });

                    const result = await response.json();

                    if (result.success) {
                      setUploadStatus('success');
                      setMessage(`Удалено всех товаров: ${result.deleted}. Обновляем страницу...`);
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    } else {
                      throw new Error(result.error || 'Ошибка удаления');
                    }
                  } catch (error) {
                    console.error('Delete all error:', error);
                    setUploadStatus('error');
                    setMessage(error instanceof Error ? error.message : 'Ошибка при удалении');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                variant="destructive"
                className="flex-1"
              >
                {isDeleting ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Удаление...
                  </>
                ) : (
                  <>
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить ВСЕ
                  </>
                )}
              </Button>
            </div>
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
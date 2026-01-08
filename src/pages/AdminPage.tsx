import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const swingProducts = [
  { article: '0110', name: 'Качели (одинарные, вариант 1)', images: ['https://cdn.poehali.dev/files/111.png'] },
  { article: '0111', name: 'Качели (одинарные, вариант 2)', images: ['https://cdn.poehali.dev/files/115.png'] },
  { article: '0112', name: 'Качели двойные (вариант 1)', images: ['https://cdn.poehali.dev/files/112.png'] },
  { article: '0113', name: 'Качели двойные (вариант 2)', images: ['https://cdn.poehali.dev/files/113.png'] },
  { article: '0114', name: 'Качели двойные (вариант 3)', images: ['https://cdn.poehali.dev/files/114.png'] },
];

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const uploadSwingImages = async () => {
    setUploadingImages(true);
    setResult(null);

    try {
      let successCount = 0;
      
      for (const product of swingProducts) {
        const response = await fetch('https://functions.poehali.dev/e02bd312-25b6-4983-990b-110af1ed4e52', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'upload_images',
            images: product.images,
            article: product.article,
          }),
        });

        const data = await response.json();

        if (data.success) {
          successCount++;
        }
      }

      setResult({
        success: true,
        message: `Загружено изображений для ${successCount} из ${swingProducts.length} товаров`,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const loadCatalog = async () => {
    setLoading(true);
    setResult(null);

    try {
      const parseResponse = await fetch('https://functions.poehali.dev/996892ec-cd18-4c4d-9dfb-c83d04015e2e');
      const parseData = await parseResponse.json();

      if (!parseData.success) {
        throw new Error('Ошибка парсинга Excel: ' + parseData.error);
      }

      const loadResponse = await fetch('https://functions.poehali.dev/e02bd312-25b6-4983-990b-110af1ed4e52', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: parseData.products,
          clear_existing: false,
        }),
      });

      const loadData = await loadResponse.json();

      if (!loadData.success) {
        throw new Error('Ошибка загрузки в БД: ' + loadData.error);
      }

      setResult({
        success: true,
        message: `Успешно загружено ${loadData.inserted} товаров из ${loadData.total_products}`,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Панель администратора</h1>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Загрузка изображений качелей</h2>
                <p className="text-muted-foreground mb-4">
                  Привязать фотографии к 5 товарам качелей
                </p>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {swingProducts.map((product, idx) => (
                    <div key={idx} className="space-y-1">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full aspect-square object-cover rounded border"
                      />
                      <p className="text-xs text-muted-foreground text-center">{product.article}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={uploadSwingImages}
                disabled={uploadingImages}
                size="lg"
                className="w-full"
              >
                {uploadingImages ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка изображений...
                  </>
                ) : (
                  <>
                    <Icon name="Image" className="mr-2 h-4 w-4" />
                    Привязать изображения к товарам
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Загрузка каталога</h2>
                <p className="text-muted-foreground mb-4">
                  Загрузить товары из файла "Спорт 26.xls" в базу данных
                </p>
              </div>

              <Button
                onClick={loadCatalog}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Download" className="mr-2 h-4 w-4" />
                    Загрузить каталог
                  </>
                )}
              </Button>
            </div>
          </Card>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <Icon
                  name={result.success ? 'CheckCircle' : 'XCircle'}
                  className="h-5 w-5 mt-0.5"
                />
                <p>{result.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
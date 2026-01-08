import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadCatalog = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Шаг 1: Получаем данные из Excel
      const parseResponse = await fetch('https://functions.poehali.dev/996892ec-cd18-4c4d-9dfb-c83d04015e2e');
      const parseData = await parseResponse.json();

      if (!parseData.success) {
        throw new Error('Ошибка парсинга Excel: ' + parseData.error);
      }

      // Шаг 2: Загружаем в базу данных
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
        </Card>
      </div>
    </div>
  );
}

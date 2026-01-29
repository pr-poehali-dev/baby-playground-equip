import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProductDeleteProps {
  onStatusChange: (status: 'idle' | 'success' | 'error', message: string) => void;
}

export function ProductDelete({ onStatusChange }: ProductDeleteProps) {
  const [articlesToDelete, setArticlesToDelete] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteByArticles = async () => {
    if (!articlesToDelete.trim()) {
      onStatusChange('error', 'Введите артикулы для удаления');
      return;
    }

    const input = articlesToDelete.trim();
    let articles: string[] = [];

    const rangeMatch = input.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      
      if (start > end) {
        onStatusChange('error', 'Начальный артикул должен быть меньше конечного');
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
      onStatusChange('error', 'Введите корректные артикулы');
      return;
    }

    const confirmMessage = articles.length > 10 
      ? `Удалить ${articles.length} товаров (${articles[0]} - ${articles[articles.length - 1]})?`
      : `Удалить ${articles.length} товар(ов): ${articles.join(', ')}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    onStatusChange('idle', '');

    try {
      const response = await fetch('https://functions.poehali.dev/e93f95d7-e11d-4883-bf7e-1f41cb0b3bbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: articles
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товаров');
      }

      const result = await response.json();

      if (result.success) {
        onStatusChange('success', `Удалено товаров: ${result.deletedCount}. Обновляем каталог...`);
        setArticlesToDelete('');
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Delete error:', error);
      onStatusChange('error', error instanceof Error ? error.message : 'Ошибка при удалении товаров');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Удаление товаров по артикулам</CardTitle>
        <CardDescription>
          Введите артикулы через дефис (12345-67890-11111) или диапазон (00001-00100)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Например: 12345-67890 или 00001-00100"
            value={articlesToDelete}
            onChange={(e) => setArticlesToDelete(e.target.value)}
            disabled={isDeleting}
          />
          <p className="text-xs text-muted-foreground">
            Для диапазона: укажите начальный и конечный артикул через дефис (например, 00001-00100)
          </p>
        </div>

        <Button 
          onClick={handleDeleteByArticles} 
          disabled={!articlesToDelete.trim() || isDeleting}
          variant="destructive"
          className="w-full"
        >
          {isDeleting ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Удаление...
            </>
          ) : (
            <>
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить товары
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

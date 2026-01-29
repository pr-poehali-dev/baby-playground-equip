import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExcelUpload } from '@/components/admin/ExcelUpload';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProductDelete } from '@/components/admin/ProductDelete';

export function AdminPanel() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleStatusChange = (status: 'idle' | 'success' | 'error', msg: string) => {
    setUploadStatus(status);
    setMessage(msg);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
        <p className="text-muted-foreground">Управление каталогом товаров</p>
      </div>

      {message && (
        <Card className={`mb-6 ${uploadStatus === 'success' ? 'border-green-500 bg-green-50' : uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}`}>
          <CardHeader>
            <CardTitle className={uploadStatus === 'success' ? 'text-green-700' : uploadStatus === 'error' ? 'text-red-700' : ''}>
              {uploadStatus === 'success' ? 'Успешно' : uploadStatus === 'error' ? 'Ошибка' : 'Информация'}
            </CardTitle>
            <CardDescription className={uploadStatus === 'success' ? 'text-green-600' : uploadStatus === 'error' ? 'text-red-600' : ''}>
              {message}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-6">
        <ExcelUpload onStatusChange={handleStatusChange} />
        <ImageUpload onStatusChange={handleStatusChange} />
        <ProductDelete onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}

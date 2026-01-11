import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface OrderFormProps {
  total: number;
  installationCost: number;
  deliveryCost: number;
  grandTotal: number;
  onSubmit: (formData: OrderFormData) => void;
  onCancel: () => void;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  legalStatus: string;
  comment: string;
}

export function OrderForm({ total, installationCost, deliveryCost, grandTotal, onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    legalStatus: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Введите адрес доставки';
    }

    if (!formData.legalStatus) {
      newErrors.legalStatus = 'Выберите правовой статус';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };



  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-heading flex items-center gap-2">
          <Icon name="FileText" size={24} />
          Оформление заказа
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ваше имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Иван Иванов"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (918) 123-45-67"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.ru"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="address">Адрес доставки *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Город, улица, дом, квартира"
              className={errors.address ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="legalStatus">Правовой статус *</Label>
            <Select 
              value={formData.legalStatus} 
              onValueChange={(value) => handleChange('legalStatus', value)}
            >
              <SelectTrigger className={errors.legalStatus ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите правовой статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Физическое лицо</SelectItem>
                <SelectItem value="entrepreneur">Индивидуальный предприниматель</SelectItem>
                <SelectItem value="legal">Юридическое лицо</SelectItem>
                <SelectItem value="government">Государственная организация</SelectItem>
                <SelectItem value="education">Образовательное учреждение</SelectItem>
              </SelectContent>
            </Select>
            {errors.legalStatus && <p className="text-sm text-red-500 mt-1">{errors.legalStatus}</p>}
          </div>

          <div>
            <Label htmlFor="comment">Комментарий к заказу</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="Дополнительная информация"
              rows={3}
            />
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-base">
              <span>Сумма товаров:</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
            {installationCost > 0 && (
              <div className="flex justify-between text-base text-muted-foreground">
                <span>Монтаж:</span>
                <span>{installationCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            {deliveryCost > 0 && (
              <div className="flex justify-between text-base text-muted-foreground">
                <span>Доставка:</span>
                <span>{deliveryCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Итого:</span>
              <span className="text-primary">{grandTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Изменить</Button>
            <Button type="submit" className="flex-1"> Заказать</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
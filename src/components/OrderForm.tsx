import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  article?: string;
}

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartItem[];
  calculateTotal: () => number;
  deliveryCost: number;
  installationPercent: number;
  calculateInstallationCost: () => number;
  calculateGrandTotal: () => number;
  onSubmit: (formData: OrderFormData) => void;
  currentOrderNumber: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  legalStatus: string;
  comment: string;
}

export function OrderForm({ open, onOpenChange, cart, calculateTotal, deliveryCost, installationPercent, calculateInstallationCost, calculateGrandTotal, onSubmit, currentOrderNumber }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    legalStatus: '',
    comment: ''
  });

  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);

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



  const total = calculateTotal();
  const installationCost = calculateInstallationCost();
  const grandTotal = calculateGrandTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 left-4 sm:hidden z-50">
          <Button
            variant="outline"
            size="icon"
            className="hover:border-primary hover:text-primary hover:bg-transparent h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle className="text-xl font-heading flex items-center gap-2">
            <Icon name="FileText" size={20} />
            Оформление заказа
          </DialogTitle>
        </DialogHeader>
    <Card className="w-full border-0 shadow-none">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <Label htmlFor="name" className="text-sm">Ваше имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Иван Иванов"
              className={`h-9 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm">Телефон *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+7 (918) 123-45-67"
              className={`h-9 ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@mail.ru"
              className={`h-9 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="address" className="text-sm">Адрес доставки *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Город, улица, дом, квартира"
              className={`min-h-[50px] ${errors.address ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.address && <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>}
          </div>

          <div>
            <Label htmlFor="legalStatus" className="text-sm">Правовой статус *</Label>
            <Select 
              value={formData.legalStatus} 
              onValueChange={(value) => handleChange('legalStatus', value)}
            >
              <SelectTrigger className={`h-9 ${errors.legalStatus ? 'border-red-500' : ''}`}>
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
            {errors.legalStatus && <p className="text-xs text-red-500 mt-0.5">{errors.legalStatus}</p>}
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm">Комментарий к заказу</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              placeholder="Дополнительная информация"
              className="min-h-[50px]"
              rows={2}
            />
          </div>

          <div className="border-t pt-2 space-y-1">
            {installationCost > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Монтаж:</span>
                <span>{installationCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            {deliveryCost > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Доставка:</span>
                <span>{deliveryCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t pt-1">
              <span>Сумма товаров:</span>
              <span className="text-primary">{grandTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <Checkbox 
              id="privacy" 
              checked={acceptedPrivacy}
              onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
            />
            <label htmlFor="privacy" className="text-xs text-muted-foreground leading-tight cursor-pointer">
              Я согласен с обработкой{' '}
              <span 
                className="text-[#44aa02] underline cursor-pointer hover:text-[#44aa02]/80"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPrivacyDialog(true);
                }}
              >
                моих персональных данных
              </span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-9 hover:border-primary hover:text-primary hover:bg-transparent">Отменить</Button>
            <Button 
              type="submit" 
              className="flex-1 h-9" 
              disabled={!acceptedPrivacy}
              style={{
                backgroundColor: acceptedPrivacy ? '' : '#ffffff',
                color: acceptedPrivacy ? '' : '#999',
                border: acceptedPrivacy ? '' : '1px solid #ddd'
              }}
            >
              Заказать
            </Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">Соглашение на обработку персональных данных</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              Настоящим в соответствии с Федеральным законом № 152-ФЗ «О персональных данных» от 27.07.2006 года Вы подтверждаете свое согласие на обработку компанией ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ персональных данных: сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, передачу исключительно в целях продажи программного обеспечения на Ваше имя, как это описано ниже, блокирование, обезличивание, уничтожение.
            </p>
            <p>
              Компания ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ гарантирует конфиденциальность получаемой информации. Обработка персональных данных осуществляется в целях эффективного исполнения заказов, договоров и иных обязательств, принятых компанией ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ в качестве обязательных к исполнению.
            </p>
            <p>
              В случае необходимости предоставления Ваших персональных данных правообладателю, дистрибьютору или реселлеру программного обеспечения в целях регистрации программного обеспечения на ваше имя, вы даёте согласие на передачу ваших персональных данных. Компания ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ гарантирует, что правообладатель, дистрибьютор или реселлер программного обеспечения осуществляет защиту персональных данных на условиях, аналогичных изложенным в Политике конфиденциальности персональных данных.
            </p>
            <p>
              Настоящее согласие распространяется на следующие Ваши персональные данные: фамилия, имя и отчество, адрес электронной почты, почтовый адрес доставки заказов, контактный телефон, платёжные реквизиты.
            </p>
            <p>
              Срок действия согласия является неограниченным. Вы можете в любой момент отозвать настоящее согласие, направив письменное уведомления на адрес: 350005, г. Краснодар, ул. Кореновская, д. 57, офис 7 с пометкой «Отзыв согласия на обработку персональных данных».
            </p>
            <p>
              Обращаем ваше внимание, что отзыв согласия на обработку персональных данных влечёт за собой удаление Вашей учётной записи с Интернет-сайта (https://www.urban-play.ru), а также уничтожение записей, содержащих ваши персональные данные, в системах обработки персональных данных компании ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ, что может сделать невозможным пользование интернет-сервисами компании ИП ПРОНИН РУСЛАН ОЛЕГОВИЧ.
            </p>
            <p>
              Гарантирую, что представленная мной информация является полной, точной и достоверной, а также что при представлении информации не нарушаются действующее законодательство Российской Федерации, законные права и интересы третьих лиц. Вся представленная информация заполнена мною в отношении себя лично.
            </p>
            <p>
              Настоящее согласие действует в течение всего периода хранения персональных данных, если иное не предусмотрено законодательством Российской Федерации.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowPrivacyDialog(false)}>Закрыть</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
      </DialogContent>
    </Dialog>
  );
}
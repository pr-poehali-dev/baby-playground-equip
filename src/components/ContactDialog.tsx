import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    status: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Новая заявка на консультацию:\n\nФ.И.О: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}\nГород: ${formData.city}\nСтатус: ${formData.status}\nКомментарий: ${formData.comment}`;
    
    console.log('Заявка:', formData);
    
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время",
    });
    
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      status: '',
      comment: ''
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">Оставить заявку на консультацию</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Оставьте свой номер и мы свяжемся с вами с понедельника по пятницу с 9 до 18 часов (UTC+3)
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Ф.И.О*"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Телефон*"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="email"
                placeholder="Email*"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Ваш город*"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Правовой статус*" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Физическое лицо</SelectItem>
                <SelectItem value="entrepreneur">Индивидуальный предприниматель</SelectItem>
                <SelectItem value="legal">Юридическое лицо</SelectItem>
                <SelectItem value="government">Государственная организация</SelectItem>
                <SelectItem value="education">Образовательное учреждение</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Textarea
              placeholder="Ваш комментарий"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className="resize-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Icon name="Phone" size={20} className="mr-2" />
            Перезвоните мне
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Оставляя заявку, вы соглашаетесь с{' '}
            <span className="text-primary">обработкой персональных данных</span> и{' '}
            <span className="text-primary">политикой конфиденциальности</span>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

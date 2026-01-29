import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { OrderForm, OrderFormData } from '../OrderForm';

interface OrderDialogsProps {
  showOrderForm: boolean;
  setShowOrderForm: (show: boolean) => void;
  showSuccessDialog: boolean;
  setShowSuccessDialog: (show: boolean) => void;
  orderNumber: string;
  handleOrderSubmit: (formData: OrderFormData) => void;
  setIsContactDialogOpen: (open: boolean) => void;
}

export function OrderDialogs({
  showOrderForm,
  setShowOrderForm,
  showSuccessDialog,
  setShowSuccessDialog,
  orderNumber,
  handleOrderSubmit,
  setIsContactDialogOpen
}: OrderDialogsProps) {
  return (
    <>
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
          </DialogHeader>
          <OrderForm onSubmit={handleOrderSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="CheckCircle2" size={24} className="text-green-500" />
              Заказ успешно оформлен!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Номер вашего заказа:</p>
              <p className="text-2xl font-bold">{orderNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => setShowSuccessDialog(false)} className="flex-1">
                Продолжить покупки
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSuccessDialog(false);
                  setIsContactDialogOpen(true);
                }}
              >
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Связаться
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

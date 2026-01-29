import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { CartItem } from '../data/catalogData';

interface KPDialogProps {
  showKPDialog: boolean;
  setShowKPDialog: (show: boolean) => void;
  kpAddress: string;
  setKpAddress: (address: string) => void;
  kpInstallationPercent: number;
  setKpInstallationPercent: (percent: number) => void;
  kpDeliveryCost: number;
  setKpDeliveryCost: (cost: number) => void;
  hideInstallationInKP: boolean;
  setHideInstallationInKP: (hide: boolean) => void;
  hideDeliveryInKP: boolean;
  setHideDeliveryInKP: (hide: boolean) => void;
  kpFormat: 'xlsx' | 'pdf';
  setKpFormat: (format: 'xlsx' | 'pdf') => void;
  kpDiscountPercent: number;
  setKpDiscountPercent: (percent: number) => void;
  kpDiscountAmount: number;
  setKpDiscountAmount: (amount: number) => void;
  kpTargetTotal: number;
  setKpTargetTotal: (total: number) => void;
  generateKP: (options?: { address?: string; installationPercent?: number; deliveryCost?: number; hideInstallation?: boolean; hideDelivery?: boolean; format?: 'xlsx' | 'pdf'; sortedCart?: CartItem[]; discountPercent?: number; discountAmount?: number }) => void;
  sortedCart: CartItem[];
  calculateTotal: () => number;
}

export function KPDialog({
  showKPDialog,
  setShowKPDialog,
  kpAddress,
  setKpAddress,
  kpInstallationPercent,
  setKpInstallationPercent,
  kpDeliveryCost,
  setKpDeliveryCost,
  hideInstallationInKP,
  setHideInstallationInKP,
  hideDeliveryInKP,
  setHideDeliveryInKP,
  kpFormat,
  setKpFormat,
  kpDiscountPercent,
  setKpDiscountPercent,
  kpDiscountAmount,
  setKpDiscountAmount,
  kpTargetTotal,
  setKpTargetTotal,
  generateKP,
  sortedCart,
  calculateTotal
}: KPDialogProps) {
  const totalCost = calculateTotal();

  const handleKpTargetTotalChange = (value: number) => {
    setKpTargetTotal(value);
    if (value > 0 && totalCost > 0) {
      const newDiscountAmount = totalCost - value;
      const newDiscountPercent = (newDiscountAmount / totalCost) * 100;
      setKpDiscountAmount(Math.max(0, newDiscountAmount));
      setKpDiscountPercent(Math.max(0, newDiscountPercent));
    }
  };

  const handleKpDiscountPercentChange = (value: number) => {
    setKpDiscountPercent(value);
    const newDiscountAmount = (totalCost * value) / 100;
    setKpDiscountAmount(newDiscountAmount);
    setKpTargetTotal(totalCost - newDiscountAmount);
  };

  const handleKpDiscountAmountChange = (value: number) => {
    setKpDiscountAmount(value);
    if (totalCost > 0) {
      const newDiscountPercent = (value / totalCost) * 100;
      setKpDiscountPercent(newDiscountPercent);
    }
    setKpTargetTotal(totalCost - value);
  };

  return (
    <Dialog open={showKPDialog} onOpenChange={setShowKPDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Создание КП</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Адрес доставки</label>
            <Input
              placeholder="Введите адрес..."
              value={kpAddress}
              onChange={(e) => setKpAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Скидка</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Скидка %"
                value={kpDiscountPercent || ''}
                onChange={(e) => handleKpDiscountPercentChange(parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Скидка ₽"
                value={kpDiscountAmount || ''}
                onChange={(e) => handleKpDiscountAmountChange(parseFloat(e.target.value) || 0)}
                className="text-sm"
              />
            </div>
            <Input
              type="number"
              placeholder="Целевая сумма ₽"
              value={kpTargetTotal || ''}
              onChange={(e) => handleKpTargetTotalChange(parseFloat(e.target.value) || 0)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Монтаж (%)</label>
            <Input
              type="number"
              placeholder="0"
              value={kpInstallationPercent || ''}
              onChange={(e) => setKpInstallationPercent(parseFloat(e.target.value) || 0)}
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="hideInstallation"
                checked={hideInstallationInKP}
                onCheckedChange={(checked) => setHideInstallationInKP(checked as boolean)}
              />
              <label htmlFor="hideInstallation" className="text-sm cursor-pointer">
                Скрыть монтаж в КП
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Доставка (₽)</label>
            <Input
              type="number"
              placeholder="0"
              value={kpDeliveryCost || ''}
              onChange={(e) => setKpDeliveryCost(parseFloat(e.target.value) || 0)}
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="hideDelivery"
                checked={hideDeliveryInKP}
                onCheckedChange={(checked) => setHideDeliveryInKP(checked as boolean)}
              />
              <label htmlFor="hideDelivery" className="text-sm cursor-pointer">
                Скрыть доставку в КП
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Формат файла</label>
            <div className="flex gap-2">
              <Button
                variant={kpFormat === 'xlsx' ? 'default' : 'outline'}
                onClick={() => setKpFormat('xlsx')}
                className="flex-1"
              >
                <Icon name="FileSpreadsheet" size={16} className="mr-2" />
                Excel
              </Button>
              <Button
                variant={kpFormat === 'pdf' ? 'default' : 'outline'}
                onClick={() => setKpFormat('pdf')}
                className="flex-1"
              >
                <Icon name="FileText" size={16} className="mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowKPDialog(false)}>
            Отмена
          </Button>
          <Button onClick={() => {
            generateKP({
              address: kpAddress,
              installationPercent: kpInstallationPercent,
              deliveryCost: kpDeliveryCost,
              hideInstallation: hideInstallationInKP,
              hideDelivery: hideDeliveryInKP,
              format: kpFormat,
              sortedCart: sortedCart,
              discountPercent: kpDiscountPercent,
              discountAmount: kpDiscountAmount
            });
            setShowKPDialog(false);
          }}>
            <Icon name="Download" size={16} className="mr-2" />
            Скачать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

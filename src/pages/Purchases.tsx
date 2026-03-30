import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { ShoppingCart, DollarSign, Truck, Users, CalendarIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import { usePurchaseOrders, useCreatePurchaseOrder, useSuppliers } from '@/hooks/usePurchases';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { PurchaseOrder, PurchaseItem } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function Purchases() {
  const { data: orders = [], isLoading } = usePurchaseOrders();
  const { data: suppliers = [] } = useSuppliers();
  const createMutation = useCreatePurchaseOrder();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    po_number: '',
    supplier_id: '',
    items: [] as PurchaseItem[],
    total_amount: 0,
    order_date: '',
    delivery_date: '',
    status: 'Pending' as 'Draft' | 'Pending' | 'In-Progress' | 'Completed' | 'Overdue',
    notes: '',
  });
  const [orderDate, setOrderDate] = useState<Date>();
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [currentItem, setCurrentItem] = useState({ name: '', qty: 0, price: 0 });
  const [editingIndex, setEditingIndex] = useState(-1);

  const openPOs = orders.filter(o => o.status !== 'Completed').length;
  const monthlySpend = orders
    .filter(o => new Date(o.order_date) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    .reduce((sum, o) => sum + o.total_amount, 0);
  const pendingDeliveries = orders.filter(o => new Date(o.delivery_date) > new Date() && o.status !== 'Completed').length;
  const activeSuppliers = new Set(orders.map(o => o.supplier_name)).size;

  const handleAddItem = () => {
    if (!currentItem.name || currentItem.qty <= 0 || currentItem.price <= 0) return;
    const subtotal = currentItem.qty * currentItem.price;
    const newItem: PurchaseItem = { ...currentItem, subtotal };
    const newItems = editingIndex >= 0 
      ? formData.items.map((item, i) => i === editingIndex ? newItem : item)
      : [...formData.items, newItem];
    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce((sum, i) => sum + i.subtotal, 0),
    });
    setCurrentItem({ name: '', qty: 0, price: 0 });
    setEditingIndex(-1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce((sum, i) => sum + i.subtotal, 0),
    });
  };

  const handleEditItem = (index: number) => {
    const item = formData.items[index];
    setCurrentItem({ name: item.name, qty: item.qty, price: item.price });
    setEditingIndex(index);
  };

  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const count = orders.length + 1;
    return `PO-${year}-${count.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_id || formData.items.length === 0 || !orderDate || !deliveryDate || deliveryDate < orderDate) {
      toast.error('Please fill all required fields and fix validation');
      return;
    }
    const supplier = suppliers.find(s => s.id === formData.supplier_id);
    const poData = {
      po_number: generatePONumber(),
      supplier_id: formData.supplier_id,
      supplier_name: supplier?.name || '',
      items: formData.items,
      total_amount: formData.total_amount,
      order_date: orderDate.toISOString().split('T')[0],
      delivery_date: deliveryDate.toISOString().split('T')[0],
      status: formData.status,
      notes: formData.notes,
    };
    createMutation.mutate(poData);
    setOpen(false);
    setFormData({
      po_number: '',
      supplier_id: '',
      items: [],
      total_amount: 0,
      order_date: '',
      delivery_date: '',
      status: 'Pending',
      notes: '',
    });
    setOrderDate(undefined);
    setDeliveryDate(undefined);
    setCurrentItem({ name: '', qty: 0, price: 0 });
    setEditingIndex(-1);
  };

  const columns = [
    { key: "po_number", label: "PO Number" },
    { key: "supplier_name", label: "Supplier" },
    { key: "items", label: "Items", render: (items: PurchaseItem[]) => items.length },
    { key: "total_amount", label: "Total", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { key: "order_date", label: "Order Date", render: (v: string) => format(new Date(v), 'MMM dd') },
    { key: "delivery_date", label: "Delivery", render: (v: string) => format(new Date(v), 'MMM dd') },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Purchases" 
        description="Manage purchase orders, suppliers, and procurement" 
        icon={ShoppingCart} 
        action="New PO"
        onAction={() => setOpen(true)}
      />
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Open POs" value={openPOs.toString()} change="+3 this week" trend="up" icon={ShoppingCart} />
        <KpiCard title="Monthly Spend" value={`PKR ${monthlySpend.toLocaleString()}`} change="+8.2%" trend="down" icon={DollarSign} />
        <KpiCard title="Pending Deliveries" value={pendingDeliveries.toString()} change="-1" trend="up" icon={Truck} />
        <KpiCard title="Active Suppliers" value={activeSuppliers.toString()} change="+2" trend="up" icon={Users} />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Loading purchase orders...
          </CardContent>
        </Card>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}

      {/* New PO Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Purchase Order</DialogTitle>
            <DialogDescription>Create new PO with dynamic items.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>PO Number</Label>
                <Input value={generatePONumber()} readOnly className="font-mono" />
              </div>
              <div>
                <Label>Supplier *</Label>
                <Select value={formData.supplier_id} onValueChange={(v) => setFormData({...formData, supplier_id: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Items ({formData.items.length})</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input 
                    placeholder="Item Name"
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  />
                  <Input 
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={currentItem.qty}
                    onChange={(e) => setCurrentItem({...currentItem, qty: parseInt(e.target.value) || 0})}
                  />
                  <Input 
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({...currentItem, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="w-full">
                  {editingIndex >= 0 ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-md p-4 bg-muted/50">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.qty} @ PKR {item.price.toFixed(2)} = PKR {item.subtotal.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditItem(index)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {formData.items.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No items added. Add items above.</p>
                )}
              </div>
              <div className="text-lg font-bold text-right">
                Total: PKR {formData.total_amount.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Order Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !orderDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {orderDate ? format(orderDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent 
                      mode="single" 
                      selected={orderDate} 
                      onSelect={setOrderDate} 
                      initialFocus 
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Delivery Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent 
                      mode="single" 
                      selected={deliveryDate} 
                      onSelect={setDeliveryDate} 
                      initialFocus 
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In-Progress">In-Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes or special instructions..."
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || formData.items.length === 0}>
                {createMutation.isPending ? 'Creating...' : 'Create PO'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


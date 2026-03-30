import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { Package, Warehouse, AlertTriangle, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import { useProducts, useAddProduct } from '@/hooks/useInventory';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/types';

export default function Inventory() {
  const { data: products = [], isLoading } = useProducts();
  const addProductMutation = useAddProduct();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'created_at' | 'qty_on_hand'> & { qty_on_hand: number }>({
    sku: '',
    name: '',
    category: 'Raw Material',
    unit: 'unit',
    cost: 0,
    price: 0,
    reorder_level: 0,
    qty_on_hand: 0,
    warehouse: 'WH-A',
    status: 'Active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate(formData);
    setOpen(false);
    setFormData({
      sku: '',
      name: '',
      category: 'Raw Material',
      unit: 'unit',
      cost: 0,
      price: 0,
      reorder_level: 0,
      qty_on_hand: 0,
      warehouse: 'WH-A',
      status: 'Active',
    });
  };

  const columns = [
    { key: "sku", label: "SKU" },
    { key: "name", label: "Item Name" },
    { key: "category", label: "Category" },
    { key: "qty_on_hand", label: "Qty on Hand" },
    { key: "warehouse", label: "Warehouse" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  const itemData = products.map(p => ({
    ...p,
    qty: `${p.qty_on_hand} ${p.unit}`,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Inventory" description="Track stock levels, warehouses, and item movements" icon={Package} action="Add Item" onAction={() => setOpen(true)} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Items" value={products.length.toString()} change="+4 new" trend="up" icon={Package} />
        <KpiCard title="Stock Value" value="PKR 184,200" change="+3.2%" trend="up" icon={BarChart3} />
        <KpiCard title="Warehouses" value="3" change="No change" trend="up" icon={Warehouse} />
        <KpiCard title="Low Stock Alerts" value="1" change="+0 items" trend="down" icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">All Items</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                Loading items...
              </CardContent>
            </Card>
          ) : (
            <DataTable columns={columns} data={itemData} />
          )}
        </TabsContent>
        <TabsContent value="movements" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground">Stock movement history coming soon</CardContent></Card>
        </TabsContent>
        <TabsContent value="warehouses" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[{ name: "Warehouse A", location: "Main Plant", capacity: 78 }, { name: "Warehouse B", location: "Assembly Wing", capacity: 52 }, { name: "Warehouse C", location: "Finished Goods", capacity: 65 }].map((wh) => (
              <Card key={wh.name}>
                <CardContent className="p-5 space-y-3">
                  <div className="font-semibold">{wh.name}</div>
                  <p className="text-sm text-muted-foreground">{wh.location}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Capacity</span><span className="font-medium">{wh.capacity}%</span>
                    </div>
                    <Progress value={wh.capacity} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Create new inventory item.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raw Material">Raw Material</SelectItem>
                    <SelectItem value="WIP">WIP</SelectItem>
                    <SelectItem value="Finished Good">Finished Good</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Cost Price</Label>
                <Input id="cost" type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} />
              </div>
              <div>
                <Label htmlFor="price">Sell Price</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="qty">Initial Qty</Label>
                <Input id="qty" type="number" value={formData.qty_on_hand} onChange={(e) => setFormData({...formData, qty_on_hand: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <Label htmlFor="reorder">Reorder Level</Label>
                <Input id="reorder" type="number" value={formData.reorder_level} onChange={(e) => setFormData({...formData, reorder_level: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={formData.warehouse} onValueChange={(v) => setFormData({...formData, warehouse: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WH-A">WH-A</SelectItem>
                    <SelectItem value="WH-B">WH-B</SelectItem>
                    <SelectItem value="WH-C">WH-C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={addProductMutation.isPending}>
                {addProductMutation.isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { Factory, ClipboardList, Cog, AlertTriangle, Calendar, List, Settings, MessageSquare, BadgeCheck, Clock, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from 'react';
import { useWorkOrders, useCreateWorkOrder } from '@/hooks/useProduction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { WorkOrder } from '@/types';

export default function Production() {
  const { data: workOrders = [], isLoading } = useWorkOrders();
  const createMutation = useCreateWorkOrder();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: 0,
    start_date: '',
    due_date: '',
    bill_of_materials: [] as string[],
    routing_steps: [] as string[],
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    notes: '',
  });
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || formData.quantity <= 0 || !startDate || !dueDate || dueDate <= startDate) {
      toast.error('Please fix validation errors');
      return;
    }
    const workOrder = {
      ...formData,
      start_date: startDate!.toISOString().split('T')[0],
      due_date: dueDate!.toISOString().split('T')[0],
      bill_of_materials: formData.bill_of_materials,
      routing_steps: formData.routing_steps,
    };
    createMutation.mutate(workOrder as any);
    setOpen(false);
    setFormData({
      product_name: '',
      quantity: 0,
      start_date: '',
      due_date: '',
      bill_of_materials: [],
      routing_steps: [],
      priority: 'Medium',
      notes: '',
    });
    setStartDate(undefined);
    setDueDate(undefined);
  };

  const activeOrders = workOrders.filter(w => w.status !== 'Completed').length;
  const monthlyOutput = workOrders.reduce((sum, w) => sum + w.quantity, 0);

  const woCols = [
    { key: "id", label: "Work Order" },
    { key: "product_name", label: "Product" },
    { key: "quantity", label: "Quantity" },
    { key: "start_date", label: "Start", render: (v: string) => format(new Date(v), 'MMM dd') },
    { key: "due_date", label: "Due", render: (v: string) => format(new Date(v), 'MMM dd') },
    { key: "progress", label: "Progress", render: (v: number) => <div className="w-24"><Progress value={v} className="h-2" /></div> },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  const bomCols = [
    { key: "id", label: "BOM ID" },
    { key: "product", label: "Product" },
    { key: "components", label: "Components" },
    { key: "cost", label: "Unit Cost" },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  const boms = [
    { id: "BOM-001", product: "Hydraulic Pump Assembly", components: 12, cost: "PKR 142.50", status: "Active" },
    { id: "BOM-002", product: "Electric Motor Unit", components: 18, cost: "PKR 235.00", status: "Active" },
    { id: "BOM-003", product: "Control Panel Board", components: 24, cost: "PKR 180.75", status: "Draft" },
    { id: "BOM-004", product: "Gear Assembly Kit", components: 8, cost: "PKR 95.20", status: "Active" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Production" 
        description="Manage work orders, BOMs, and manufacturing processes" 
        icon={Factory} 
        action="New Work Order"
        onAction={() => setOpen(true)}
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Work Orders" value={activeOrders.toString()} change="+1 this week" trend="up" icon={ClipboardList} />
        <KpiCard title="Monthly Output" value={`${monthlyOutput} units`} change="+4.8%" trend="up" icon={Factory} />
        <KpiCard title="Efficiency Rate" value="94.2%" change="+1.3%" trend="up" icon={Cog} />
        <KpiCard title="Scrap Rate" value="2.1%" change="-0.4%" trend="up" icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Work Orders</TabsTrigger>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          <TabsTrigger value="routing">Routing</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                Loading work orders...
              </CardContent>
            </Card>
          ) : (
            <DataTable columns={woCols} data={workOrders} />
          )}
        </TabsContent>
        <TabsContent value="bom" className="mt-4">
          <DataTable columns={bomCols} data={boms} />
        </TabsContent>
        <TabsContent value="routing" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground">Production routing configuration coming soon</CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Work Order</DialogTitle>
            <DialogDescription>Create a new manufacturing work order.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="product_name">Product Name *</Label>
              <Input id="product_name" value={formData.product_name} onChange={(e) => setFormData({...formData, product_name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} required />
              </div>
              <div>
                <Label>Priority *</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v as 'Low' | 'Medium' | 'High'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label>Bill of Materials</Label>
              <Input placeholder="e.g. BOM-001, BOM-002" value={formData.bill_of_materials.join(', ')} onChange={(e) => setFormData({...formData, bill_of_materials: e.target.value.split(',').map(s => s.trim())})} />
            </div>
            <div>
              <Label>Routing Steps</Label>
              <Input placeholder="e.g. Cutting, Welding, Assembly" value={formData.routing_steps.join(', ')} onChange={(e) => setFormData({...formData, routing_steps: e.target.value.split(',').map(s => s.trim())})} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Additional instructions..." />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Work Order'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


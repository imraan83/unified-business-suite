import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { Package, Warehouse, AlertTriangle, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const items = [
  { sku: "RM-001", name: "Carbon Steel Plate", category: "Raw Material", qty: "2,400 kg", warehouse: "WH-A", reorder: 500, current: 2400, status: "Active" },
  { sku: "RM-002", name: "Aluminum Alloy Rod", category: "Raw Material", qty: "850 units", warehouse: "WH-A", reorder: 200, current: 850, status: "Active" },
  { sku: "WIP-001", name: "Machined Housing", category: "WIP", qty: "320 units", warehouse: "WH-B", reorder: 100, current: 320, status: "Active" },
  { sku: "FG-001", name: "Hydraulic Pump Assembly", category: "Finished Good", qty: "180 units", warehouse: "WH-C", reorder: 50, current: 180, status: "Active" },
  { sku: "RM-003", name: "Copper Wire (2mm)", category: "Raw Material", qty: "45 spools", warehouse: "WH-A", reorder: 100, current: 45, status: "Low" },
  { sku: "FG-002", name: "Electric Motor Unit", category: "Finished Good", qty: "92 units", warehouse: "WH-C", reorder: 80, current: 92, status: "Active" },
];

const columns = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "qty", label: "Quantity" },
  { key: "warehouse", label: "Warehouse" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

export default function Inventory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Inventory" description="Track stock levels, warehouses, and item movements" icon={Package} action="Add Item" />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Items" value="3,847" change="+24 new" trend="up" icon={Package} />
        <KpiCard title="Stock Value" value="PKR 184,200" change="+3.2%" trend="up" icon={BarChart3} />
        <KpiCard title="Warehouses" value="3" change="No change" trend="up" icon={Warehouse} />
        <KpiCard title="Low Stock Alerts" value="5" change="+2 items" trend="down" icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">All Items</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>
        <TabsContent value="items" className="mt-4">
          <DataTable columns={columns} data={items} />
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
    </div>
  );
}

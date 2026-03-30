import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { Factory, ClipboardList, Cog, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const workOrders = [
  { id: "WO-2024-001", product: "Hydraulic Pump Assembly", qty: "200 units", start: "Mar 20", due: "Apr 05", progress: 65, status: "In-Progress" },
  { id: "WO-2024-002", product: "Electric Motor Unit", qty: "150 units", start: "Mar 22", due: "Apr 10", progress: 40, status: "In-Progress" },
  { id: "WO-2024-003", product: "Control Panel Board", qty: "300 units", start: "Mar 25", due: "Apr 15", progress: 15, status: "In-Progress" },
  { id: "WO-2024-004", product: "Gear Assembly Kit", qty: "500 units", start: "Apr 01", due: "Apr 20", progress: 0, status: "Pending" },
  { id: "WO-2024-005", product: "Valve Housing Unit", qty: "180 units", start: "Mar 15", due: "Mar 28", progress: 100, status: "Completed" },
];

const boms = [
  { id: "BOM-001", product: "Hydraulic Pump Assembly", components: 12, cost: "PKR 142.50", status: "Active" },
  { id: "BOM-002", product: "Electric Motor Unit", components: 18, cost: "PKR 235.00", status: "Active" },
  { id: "BOM-003", product: "Control Panel Board", components: 24, cost: "PKR 180.75", status: "Draft" },
  { id: "BOM-004", product: "Gear Assembly Kit", components: 8, cost: "PKR 95.20", status: "Active" },
];

const woCols = [
  { key: "id", label: "Work Order" },
  { key: "product", label: "Product" },
  { key: "qty", label: "Quantity" },
  { key: "start", label: "Start" },
  { key: "due", label: "Due Date" },
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

export default function Production() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Production" description="Manage work orders, BOMs, and manufacturing processes" icon={Factory} action="New Work Order" />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Work Orders" value="3" change="+1 this week" trend="up" icon={ClipboardList} />
        <KpiCard title="Monthly Output" value="1,750 units" change="+4.8%" trend="up" icon={Factory} />
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
          <DataTable columns={woCols} data={workOrders} />
        </TabsContent>
        <TabsContent value="bom" className="mt-4">
          <DataTable columns={bomCols} data={boms} />
        </TabsContent>
        <TabsContent value="routing" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground">Production routing configuration coming soon</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { ShoppingCart, DollarSign, Truck, Users } from "lucide-react";

const orders = [
  { id: "PO-2024-001", supplier: "Acme Steel Corp", items: 5, total: "$12,450", date: "Mar 28", delivery: "Apr 05", status: "Pending" },
  { id: "PO-2024-002", supplier: "Global Polymers Ltd", items: 3, total: "$8,320", date: "Mar 27", delivery: "Apr 02", status: "Completed" },
  { id: "PO-2024-003", supplier: "MetalWorks Inc", items: 8, total: "$6,750", date: "Mar 25", delivery: "Mar 30", status: "In-Progress" },
  { id: "PO-2024-004", supplier: "ElectroSupply Co", items: 12, total: "$15,200", date: "Mar 24", delivery: "Apr 08", status: "Draft" },
  { id: "PO-2024-005", supplier: "ChemPro Industries", items: 2, total: "$4,800", date: "Mar 22", delivery: "Mar 28", status: "Overdue" },
];

const columns = [
  { key: "id", label: "PO Number" },
  { key: "supplier", label: "Supplier" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "date", label: "Order Date" },
  { key: "delivery", label: "Delivery" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

export default function Purchases() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Purchases" description="Manage purchase orders, suppliers, and procurement" icon={ShoppingCart} action="New PO" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Open POs" value="12" change="+3 this week" trend="up" icon={ShoppingCart} />
        <KpiCard title="Monthly Spend" value="$47,520" change="+8.2%" trend="down" icon={DollarSign} />
        <KpiCard title="Pending Deliveries" value="8" change="-1" trend="up" icon={Truck} />
        <KpiCard title="Active Suppliers" value="24" change="+2" trend="up" icon={Users} />
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}

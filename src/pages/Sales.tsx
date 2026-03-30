import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { Receipt, DollarSign, Users, TrendingUp } from "lucide-react";

const orders = [
  { id: "SO-2024-015", customer: "TechVision Ltd", items: 4, total: "$24,800", date: "Mar 28", status: "In-Progress" },
  { id: "SO-2024-014", customer: "BuildRight Co", items: 2, total: "$18,200", date: "Mar 27", status: "Completed" },
  { id: "SO-2024-013", customer: "PowerGrid Systems", items: 6, total: "$31,500", date: "Mar 26", status: "Pending" },
  { id: "SO-2024-012", customer: "AutoMax Industries", items: 3, total: "$14,600", date: "Mar 25", status: "Paid" },
  { id: "SO-2024-011", customer: "MarineTech Corp", items: 1, total: "$8,900", date: "Mar 24", status: "Draft" },
];

const columns = [
  { key: "id", label: "SO Number" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

export default function Sales() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Sales" description="Manage sales orders, quotations, and customer invoices" icon={Receipt} action="New Order" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Monthly Sales" value="$326,400" change="+12.5%" trend="up" icon={DollarSign} />
        <KpiCard title="Open Orders" value="8" change="+2" trend="up" icon={Receipt} />
        <KpiCard title="Active Customers" value="156" change="+12" trend="up" icon={Users} />
        <KpiCard title="Avg Order Value" value="$19,600" change="+5.3%" trend="up" icon={TrendingUp} />
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}

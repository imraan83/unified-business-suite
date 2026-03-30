import { KpiCard } from "@/components/KpiCard";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Factory, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 48000, expenses: 31000 },
  { month: "Mar", revenue: 55000, expenses: 29000 },
  { month: "Apr", revenue: 51000, expenses: 33000 },
  { month: "May", revenue: 62000, expenses: 35000 },
  { month: "Jun", revenue: 68000, expenses: 32000 },
];

const productionData = [
  { month: "Jan", output: 1200 }, { month: "Feb", output: 1350 },
  { month: "Mar", output: 1500 }, { month: "Apr", output: 1420 },
  { month: "May", output: 1680 }, { month: "Jun", output: 1750 },
];

const categoryData = [
  { name: "Raw Materials", value: 35 },
  { name: "Finished Goods", value: 45 },
  { name: "WIP", value: 20 },
];

const COLORS = ["hsl(220, 70%, 45%)", "hsl(170, 60%, 40%)", "hsl(38, 92%, 50%)"];

const recentOrders = [
  { id: "PO-2024-001", supplier: "Acme Steel Corp", amount: "$12,450", status: "Pending", date: "Mar 28" },
  { id: "PO-2024-002", supplier: "Global Polymers", amount: "$8,320", status: "Completed", date: "Mar 27" },
  { id: "SO-2024-015", supplier: "TechVision Ltd", amount: "$24,800", status: "In-Progress", date: "Mar 26" },
  { id: "PO-2024-003", supplier: "MetalWorks Inc", amount: "$6,750", status: "Paid", date: "Mar 25" },
  { id: "SO-2024-016", supplier: "BuildRight Co", amount: "$18,200", status: "Draft", date: "Mar 24" },
];

const orderColumns = [
  { key: "id", label: "Order ID" },
  { key: "supplier", label: "Party" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  { key: "date", label: "Date" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, John. Here's your business overview.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value="$326,400" change="+12.5% from last month" trend="up" icon={DollarSign} />
        <KpiCard title="Inventory Value" value="$184,200" change="+3.2% from last month" trend="up" icon={Package} />
        <KpiCard title="Production Output" value="1,750 units" change="+4.8% from last month" trend="up" icon={Factory} />
        <KpiCard title="Active Orders" value="42" change="-2.1% from last month" trend="down" icon={ShoppingCart} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Revenue vs Expenses</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(220, 70%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(170, 60%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Inventory Split</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable title="Recent Transactions" columns={orderColumns} data={recentOrders} />
        </div>
        <Card>
          <CardHeader><CardTitle className="text-base">Production Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="output" stroke="hsl(220, 70%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

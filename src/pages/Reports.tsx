import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const monthlyPL = [
  { month: "Jan", revenue: 42000, cogs: 25000, gross: 17000 },
  { month: "Feb", revenue: 48000, cogs: 28000, gross: 20000 },
  { month: "Mar", revenue: 55000, cogs: 29000, gross: 26000 },
  { month: "Apr", revenue: 51000, cogs: 30000, gross: 21000 },
  { month: "May", revenue: 62000, cogs: 33000, gross: 29000 },
  { month: "Jun", revenue: 68000, cogs: 35000, gross: 33000 },
];

const cashFlow = [
  { month: "Jan", inflow: 38000, outflow: 32000 },
  { month: "Feb", inflow: 45000, outflow: 36000 },
  { month: "Mar", inflow: 52000, outflow: 34000 },
  { month: "Apr", inflow: 48000, outflow: 38000 },
  { month: "May", inflow: 58000, outflow: 40000 },
  { month: "Jun", inflow: 65000, outflow: 42000 },
];

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports & Analytics" description="Financial statements, production reports, and business insights" icon={BarChart3} />

      <div className="grid gap-4 md:grid-cols-3">
        {["Profit & Loss", "Balance Sheet", "Trial Balance", "Cash Flow Statement", "Inventory Valuation", "Production Efficiency"].map((r) => (
          <Card key={r} className="cursor-pointer hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="font-medium">{r}</div>
              <p className="text-sm text-muted-foreground mt-1">View detailed report</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly P&L</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyPL}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(220, 70%, 45%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="cogs" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="COGS" />
                <Bar dataKey="gross" fill="hsl(170, 60%, 40%)" radius={[4, 4, 0, 0]} name="Gross Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Cash Flow</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={cashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Area type="monotone" dataKey="inflow" fill="hsl(170, 60%, 40%)" fillOpacity={0.2} stroke="hsl(170, 60%, 40%)" name="Inflow" />
                <Area type="monotone" dataKey="outflow" fill="hsl(0, 72%, 51%)" fillOpacity={0.2} stroke="hsl(0, 72%, 51%)" name="Outflow" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

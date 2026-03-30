import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/KpiCard";
import { TrendingUp, TrendingDown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useReports } from "@/hooks/useReports";
import { exportToCSV, exportToPDF, exportChartToCSV } from "@/lib/exportUtils";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";

export default function Reports() {
  const { kpis, monthlyPL, cashFlow, isLoading } = useReports();

  // Fallback data if no Supabase data
  const fallbackMonthlyPL = [
    { month: "Jan", revenue: 42000, cogs: 25000, gross: 17000 },
    { month: "Feb", revenue: 48000, cogs: 28000, gross: 20000 },
    { month: "Mar", revenue: 55000, cogs: 29000, gross: 26000 },
    { month: "Apr", revenue: 51000, cogs: 30000, gross: 21000 },
    { month: "May", revenue: 62000, cogs: 33000, gross: 29000 },
    { month: "Jun", revenue: 68000, cogs: 35000, gross: 33000 },
  ];

  const fallbackCashFlow = [
    { month: "Jan", inflow: 38000, outflow: 32000 },
    { month: "Feb", inflow: 45000, outflow: 36000 },
    { month: "Mar", inflow: 52000, outflow: 34000 },
    { month: "Apr", inflow: 48000, outflow: 38000 },
    { month: "May", inflow: 58000, outflow: 40000 },
    { month: "Jun", inflow: 65000, outflow: 42000 },
  ];

  const dataMonthlyPL = monthlyPL?.length 
    ? monthlyPL.map((d: any) => ({
        month: d.month.slice(5,7), // MM
        revenue: d.revenue,
        cogs: d.expenses,
        gross: d.profit
      }))
    : fallbackMonthlyPL;

  const dataCashFlow = cashFlow?.length 
    ? cashFlow.map((d: any) => ({
        month: d.month.slice(5,7),
        inflow: d.inflow,
        outflow: d.outflow
      }))
    : fallbackCashFlow;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 bg-muted rounded-lg animate-pulse" />
          <div className="h-80 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <PageHeader title="Reports & Analytics" description="Financial statements, production reports, and business insights" icon={BarChart3} />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => {
              // Sample data export for demonstration
              const sampleData = [
                { month: 'Jan', revenue: 42000, expenses: 25000, profit: 17000 },
                { month: 'Feb', revenue: 48000, expenses: 28000, profit: 20000 },
                { month: 'Mar', revenue: 55000, expenses: 29000, profit: 26000 },
              ];
              exportToCSV(sampleData, 'profit-loss-data');
            }} className="h-9 px-3">
              <FileText className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" onClick={async () => {
              const element = document.getElementById('reports-content');
              if (element) {
                await exportToPDF(element, 'reports-analytics');
              }
            }} className="h-9 px-3">
              <Save className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
        
        <div id="reports-content">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Profit & Loss", path: "/reports/profit-loss" },
              { name: "Balance Sheet", path: "/reports/balance-sheet" },
              { name: "Trial Balance", path: "/reports/trial-balance" },
              { name: "Cash Flow Statement", path: "/reports/cash-flow" },
              { name: "Inventory Valuation", path: "/reports/inventory" },
              { name: "Production Efficiency", path: "/reports/production" }
            ].map((report) => (
              <Card 
                key={report.name} 
                className="cursor-pointer hover:border-primary/40 transition-colors hover:shadow-lg"
                onClick={() => {
                  // For now, we'll just log - in a real app we'd use useNavigate
                  console.log(`Navigating to ${report.path}`);
                }}
              >
                <CardContent className="p-5">
                  <div className="font-medium">{report.name}</div>
                  <p className="text-sm text-muted-foreground mt-1">View detailed report</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <KpiCard 
              title="Total Revenue" 
              value={(kpis?.total_revenue || 0).toLocaleString()} 
              change="+12%" 
              trend="up" 
              icon={TrendingUp} 
            />
            <KpiCard 
              title="Net Profit" 
              value={(kpis?.net_profit || 0).toLocaleString()} 
              change="+8%" 
              trend="up" 
              icon={TrendingUp} 
            />
            <KpiCard 
              title="Inventory Value" 
              value={(kpis?.inventory_value || 0).toLocaleString()} 
              change="-2%" 
              trend="down" 
              icon={TrendingDown} 
            />
            <KpiCard 
              title="Prod Efficiency" 
              value={kpis?.avg_prod_efficiency ? (kpis.avg_prod_efficiency as number).toFixed(1) + '%' : '0%'} 
              change="+1.5%" 
              trend="up" 
              icon={TrendingUp} 
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Monthly P&L</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dataMonthlyPL}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `PKR ${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
                    <Bar dataKey="revenue" fill="hsl(220, 70%, 45%)" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="cogs" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expenses" />
                    <Bar dataKey="gross" fill="hsl(170, 60%, 40%)" radius={[4, 4, 0, 0]} name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Cash Flow</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={dataCashFlow}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `PKR ${v / 1000}k`} />
                    <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
                    <Area type="monotone" dataKey="inflow" fill="hsl(170, 60%, 40%)" fillOpacity={0.2} stroke="hsl(170, 60%, 40%)" name="Inflow" />
                    <Area type="monotone" dataKey="outflow" fill="hsl(0, 72%, 51%)" fillOpacity={0.2} stroke="hsl(0, 72%, 51%)" name="Outflow" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
}
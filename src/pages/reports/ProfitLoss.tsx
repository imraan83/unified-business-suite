import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProfitLoss() {
  const { monthlyPL, isLoading } = useReports();
  
  const fallbackData = [
    { month: "Jan", revenue: 42000, expenses: 25000, profit: 17000 },
    { month: "Feb", revenue: 48000, expenses: 28000, profit: 20000 },
    { month: "Mar", revenue: 55000, expenses: 29000, profit: 26000 },
    { month: "Apr", revenue: 51000, expenses: 30000, profit: 21000 },
    { month: "May", revenue: 62000, expenses: 33000, profit: 29000 },
    { month: "Jun", revenue: 68000, expenses: 35000, profit: 33000 },
  ];

  const data = monthlyPL?.length 
    ? monthlyPL.map((d: any) => ({
        month: d.month.slice(5,7),
        revenue: d.revenue,
        expenses: d.expenses,
        profit: d.profit
      }))
    : fallbackData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Profit & Loss Statement" 
        description="Detailed view of revenue, expenses, and profitability" 
        icon={BarChart3} 
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly P&L Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `PKR ${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="hsl(220, 70%, 45%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expenses" />
                <Bar dataKey="profit" fill="hsl(170, 60%, 40%)" radius={[4, 4, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Summary Statistics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Revenue (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Expenses (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + d.expenses, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Net Profit (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + d.profit, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Monthly Profit</p>
              <p className="text-2xl font-bold">PKR {(data.reduce((sum, d) => sum + d.profit, 0) / data.length).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle className="text-base">Monthly Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expenses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.expenses.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.profit.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) + '%' : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
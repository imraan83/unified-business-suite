import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CashFlow() {
  const { cashFlow, isLoading } = useReports();
  
  const fallbackData = [
    { month: "Jan", inflow: 38000, outflow: 32000 },
    { month: "Feb", inflow: 45000, outflow: 36000 },
    { month: "Mar", inflow: 52000, outflow: 34000 },
    { month: "Apr", inflow: 48000, outflow: 38000 },
    { month: "May", inflow: 58000, outflow: 40000 },
    { month: "Jun", inflow: 65000, outflow: 42000 },
  ];

  const data = cashFlow?.length 
    ? cashFlow.map((d: any) => ({
        month: d.month.slice(5,7),
        inflow: d.inflow,
        outflow: d.outflow
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
        title="Cash Flow Statement" 
        description="Analysis of cash inflows and outflows" 
        icon={BarChart3} 
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Cash Flow Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `PKR ${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
                <Bar dataKey="inflow" fill="hsl(170, 60%, 40%)" radius={[4, 4, 0, 0]} name="Inflow" />
                <Bar dataKey="outflow" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Summary Statistics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Inflow (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + d.inflow, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Outflow (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + d.outflow, 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Net Cash Flow (6 months)</p>
              <p className="text-2xl font-bold">PKR {data.reduce((sum, d) => sum + (d.inflow - d.outflow), 0).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Monthly Net Flow</p>
              <p className="text-2xl font-bold">PKR {(data.reduce((sum, d) => sum + (d.inflow - d.outflow), 0) / data.length).toLocaleString()}</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inflow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Outflow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.inflow.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.outflow.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {(item.inflow - item.outflow).toLocaleString()}</td>
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
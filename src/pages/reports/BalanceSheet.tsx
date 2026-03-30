import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports } from "@/hooks/useReports";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function BalanceSheet() {
  const { kpis, isLoading } = useReports();
  
  const fallbackData = {
    total_revenue: 326400,
    total_expenses: 228000,
    net_profit: 98400,
    inventory_value: 184200,
    avg_prod_efficiency: 85.3
  };

  const data = kpis || fallbackData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid gap-4">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const totalAssets = data.inventory_value || 0;
  const totalLiabilities = 150000; // This would come from liabilities table in a real app
  const equity = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Balance Sheet" 
        description="Assets, liabilities, and equity statement" 
        icon={TrendingUp} 
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Assets</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Assets</p>
              <p className="text-xl font-bold">PKR {totalAssets.toLocaleString()}</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Inventory Value</p>
              <p className="text-lg font-semibold">PKR {data.inventory_value?.toLocaleString() || '0'}</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Accounts Receivable</p>
              <p className="text-lg font-semibold">PKR 45,000</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Cash & Bank</p>
              <p className="text-lg font-semibold">PKR 65,000</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Liabilities & Equity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Liabilities</p>
              <p className="text-xl font-bold">PKR {totalLiabilities.toLocaleString()}</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Accounts Payable</p>
              <p className="text-lg font-semibold">PKR 25,000</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Short-term Loans</p>
              <p className="text-lg font-semibold">PKR 30,000</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-2">
              <p className="text-sm font-medium">Tax Payable</p>
              <p className="text-lg font-semibold">PKR 8,000</p>
            </div>
            <div className="border-t border-muted pt-4 space-y-6">
              <p className="text-sm font-medium">Total Liabilities</p>
              <p className="text-lg font-semibold text-destructive">PKR {totalLiabilities.toLocaleString()}</p>
            </div>
            
            <div className="border-t border-muted pt-6 space-y-2">
              <p className="text-sm font-medium">Owner's Equity</p>
              <p className="text-xl font-bold {equity >= 0 ? 'text-success' : 'text-destructive'}">
                PKR {equity.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle className="text-base">Financial Ratios</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-2">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Current Ratio</p>
              <p className="text-2xl font-bold">{((totalAssets || 0) / totalLiabilities).toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Debt to Equity</p>
              <p className="text-2xl font-bold">{totalLiabilities / Math.max(equity, 1)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
              <p className="text-2xl font-bold">
                {data.total_revenue ? ((data.net_profit || 0) / data.total_revenue * 100).toFixed(1) + '%' : '0%'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Return on Assets</p>
              <p className="text-2xl font-bold">
                {totalAssets ? ((data.net_profit || 0) / totalAssets * 100).toFixed(1) + '%' : '0%'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
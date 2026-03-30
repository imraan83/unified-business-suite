import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports } from "@/hooks/useReports";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TrialBalance() {
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
      </div>
    );
  }

  // Sample trial balance data (debits and credits should balance)
  const trialBalanceData = [
    { account: "Cash", debit: 65000, credit: 0 },
    { account: "Accounts Receivable", debit: 45000, credit: 0 },
    { account: "Inventory", debit: data.inventory_value || 184200, credit: 0 },
    { account: "Equipment", debit: 165000, credit: 0 },
    { account: "Accounts Payable", debit: 0, credit: 25000 },
    { account: "Salaries Payable", debit: 0, credit: 15000 },
    { account: "Unearned Revenue", debit: 0, credit: 10000 },
    { account: "Common Stock", debit: 0, credit: 200000 },
    { account: "Retained Earnings", debit: 0, credit: 124200 },
    { account: "Service Revenue", debit: 0, credit: 50500 },
    { account: "Sales Revenue", debit: 0, credit: 275900 },
    { account: "Salaries Expense", debit: 85000, credit: 0 },
    { account: "Rent Expense", debit: 18000, credit: 0 },
    { account: "Utilities Expense", debit: 3300, credit: 0 },
    { account: "Supplies Expense", debit: 5200, credit: 0 },
    { account: "Depreciation Expense", debit: 12000, credit: 0 },
  ];

  const totalDebits = trialBalanceData.reduce((sum, row) => sum + row.debit, 0);
  const totalCredits = trialBalanceData.reduce((sum, row) => sum + row.credit, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Trial Balance" 
        description="Listing of all general ledger accounts and their balances" 
        icon={TrendingUp} 
      />
      
      <Card>
        <CardHeader><CardTitle className="text-base">Trial Balance Report</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {trialBalanceData.map((row, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{row.account}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.debit ? `PKR ${row.debit.toLocaleString()}` : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{row.credit ? `PKR ${row.credit.toLocaleString()}` : '-'}</td>
                  </tr>
                ))}
                <tr className="border-t border-bold bg-muted">
                  <td className="px-6 py-4 font-bold text-lg">TOTALS</td>
                  <td className="px-6 py-4 font-bold text-lg">PKR {totalDebits.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-lg">PKR {totalCredits.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium">
              {totalDebits === totalCredits 
                ? "✓ Trial Balance is IN BALANCE" 
                : "✗ Trial Balance is OUT OF BALANCE"}
            </p>
            {! (totalDebits === totalCredits) && (
              <p className="text-sm text-destructive mt-1">
                Difference: PKR {Math.abs(totalDebits - totalCredits).toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
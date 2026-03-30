import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { BookOpen, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const accounts = [
  { code: "1000", name: "Cash & Bank", type: "Asset", balance: "$45,200", status: "Active" },
  { code: "1100", name: "Accounts Receivable", type: "Asset", balance: "$82,400", status: "Active" },
  { code: "1200", name: "Inventory", type: "Asset", balance: "$184,200", status: "Active" },
  { code: "2000", name: "Accounts Payable", type: "Liability", balance: "$34,600", status: "Active" },
  { code: "2100", name: "Accrued Expenses", type: "Liability", balance: "$12,800", status: "Active" },
  { code: "3000", name: "Owner's Equity", type: "Equity", balance: "$250,000", status: "Active" },
  { code: "4000", name: "Sales Revenue", type: "Revenue", balance: "$326,400", status: "Active" },
  { code: "5000", name: "Cost of Goods Sold", type: "Expense", balance: "$188,200", status: "Active" },
];

const journalEntries = [
  { id: "JE-001", date: "Mar 28, 2024", description: "Sales revenue recognition", debit: "$24,800", credit: "$24,800", status: "Posted" },
  { id: "JE-002", date: "Mar 27, 2024", description: "Raw material purchase", debit: "$12,450", credit: "$12,450", status: "Posted" },
  { id: "JE-003", date: "Mar 26, 2024", description: "Salary payment", debit: "$18,500", credit: "$18,500", status: "Pending" },
  { id: "JE-004", date: "Mar 25, 2024", description: "Depreciation entry", debit: "$2,400", credit: "$2,400", status: "Draft" },
];

const accountCols = [
  { key: "code", label: "Code" },
  { key: "name", label: "Account Name" },
  { key: "type", label: "Type" },
  { key: "balance", label: "Balance" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

const journalCols = [
  { key: "id", label: "Entry ID" },
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "debit", label: "Debit" },
  { key: "credit", label: "Credit" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

export default function Accounting() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Accounting" description="Manage your financial accounts, journals, and statements" icon={BookOpen} action="New Entry" />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Assets" value="$311,800" change="+5.2%" trend="up" icon={DollarSign} />
        <KpiCard title="Total Liabilities" value="$47,400" change="-2.1%" trend="down" icon={CreditCard} />
        <KpiCard title="Net Revenue" value="$326,400" change="+12.5%" trend="up" icon={TrendingUp} />
        <KpiCard title="Net Income" value="$138,200" change="+8.3%" trend="up" icon={DollarSign} />
      </div>

      <Tabs defaultValue="chart">
        <TabsList>
          <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="mt-4">
          <DataTable columns={accountCols} data={accounts} />
        </TabsContent>
        <TabsContent value="journal" className="mt-4">
          <DataTable columns={journalCols} data={journalEntries} />
        </TabsContent>
        <TabsContent value="ledger" className="mt-4">
          <Card><CardContent className="p-8 text-center text-muted-foreground">General Ledger view coming soon</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { KpiCard } from "@/components/KpiCard";
import { BookOpen, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDashboardSummary, useAccounts, useJournalEntries, useCreateJournalEntry } from '@/hooks/useAccounting';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Form schema for journal entry (simple single line for demo; extend for multi-line)
const formSchema = z.object({
  date: z.date(),
  description: z.string().min(1, 'Description required'),
  debitAccountId: z.string().min(1, 'Debit account required'),
  debitAmount: z.coerce.number().min(0, 'Debit amount >= 0'),
  creditAccountId: z.string().min(1, 'Credit account required'),
  creditAmount: z.coerce.number().min(0, 'Credit amount >= 0'),
}).refine((data) => data.debitAmount === data.creditAmount, {
  message: 'Debit and credit amounts must match',
  path: ['creditAmount'],
});

type FormData = z.infer<typeof formSchema>;

export default function Accounting() {
  const [open, setOpen] = useState(false);
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: accountsData } = useAccounts();
  const { data: entriesData } = useJournalEntries();
  const createEntryMutation = useCreateJournalEntry();

  const accounts = accountsData || [];
  const entries = entriesData || [];
  const summaryData = summary || { assets: 0, liabilities: 0, revenue: 0, netIncome: 0 };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      description: '',
      debitAccountId: '',
      debitAmount: 0,
      creditAccountId: '',
      creditAmount: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    createEntryMutation.mutate({
      date: data.date.toISOString().split('T')[0],
      description: data.description,
      lines: [
        { account_id: data.debitAccountId, debit: data.debitAmount, credit: 0 },
        { account_id: data.creditAccountId, debit: 0, credit: data.creditAmount },
      ],
    });
    form.reset();
    setOpen(false);
  };

  const accountCols = [
    { key: "code", label: "Code" },
    { key: "name", label: "Account Name" },
    { key: "type", label: "Type" },
    { key: "balance", label: "Balance", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
  ];

  const journalCols = [
    { key: "id", label: "Entry ID" },
    { key: "date", label: "Date" },
    { key: "description", label: "Description" },
    { key: "lines", label: "Accounts", render: (v: any[]) => v.map(l => `${l.accounts?.code} (${l.debit > 0 ? 'Dr' : 'Cr'} ${l.debit || l.credit})`).join(', ') },
    { key: "created_at", label: "Posted" , render: (v: string) => new Date(v).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Accounting" 
        description="Manage your financial accounts, journals, and statements" 
        icon={BookOpen} 
        action="New Entry"
        onAction={() => setOpen(true)}
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Assets" value={`PKR ${summaryData.assets.toLocaleString()}`} change="+5.2%" trend="up" icon={DollarSign} />\n        <KpiCard title="Total Liabilities" value={`PKR ${summaryData.liabilities.toLocaleString()}`} change="-2.1%" trend="down" icon={CreditCard} />\n        <KpiCard title="Net Revenue" value={`PKR ${summaryData.revenue.toLocaleString()}`} change="+12.5%" trend="up" icon={TrendingUp} />\n        <KpiCard title="Net Income" value={`PKR ${summaryData.netIncome.toLocaleString()}`} change="+8.3%" trend="up" icon={DollarSign} />
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList>
          <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="mt-4">
          <DataTable columns={accountCols} data={accounts} title="Chart of Accounts" />
        </TabsContent>
        <TabsContent value="journal" className="mt-4">
          <DataTable columns={journalCols} data={entries} title="Journal Entries" />
        </TabsContent>
        <TabsContent value="ledger" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.code} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4 text-muted-foreground">Select an account to view ledger.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Entry Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>Create a balanced journal entry.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Entry description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="debitAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Debit Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="debitAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Debit Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Account</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creditAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credit Amount</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createEntryMutation.isPending}>
                  {createEntryMutation.isPending ? 'Creating...' : 'Create Entry'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


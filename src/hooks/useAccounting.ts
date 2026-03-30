import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';

// Schemas
const AccountSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']),
  balance: z.number(),
  status: z.enum(['Active', 'Inactive']),
});

const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  date: z.string(),
  description: z.string(),
});

const JournalLineSchema = z.object({
  id: z.string().uuid(),
  entry_id: z.string().uuid(),
  account_id: z.string().uuid(),
  debit: z.number(),
  credit: z.number(),
});

type Account = z.infer<typeof AccountSchema>;
type JournalEntry = z.infer<typeof JournalEntrySchema>;
type JournalLine = z.infer<typeof JournalLineSchema>;

// Dashboard summary
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const { data: accounts } = await supabase
        .from('accounts')
        .select('*')
        .eq('status', 'Active');

      const assets = accounts?.filter(a => a.type === 'Asset').reduce((sum, a) => sum + (a.balance || 0), 0) || 0;
      const liabilities = accounts?.filter(a => a.type === 'Liability').reduce((sum, a) => sum + (a.balance || 0), 0) || 0;
      const revenue = accounts?.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + (a.balance || 0), 0) || 0;
      const expenses = accounts?.filter(a => a.type === 'Expense').reduce((sum, a) => sum + (a.balance || 0), 0) || 0;
      const netIncome = revenue - expenses;

      return { assets, liabilities, revenue: netIncome, netIncome }; // netRevenue as revenue - expenses? Adjust per need
    },
  });
};

// Accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data } = await supabase.from('accounts').select('*');
      return z.array(AccountSchema).parse(data);
    },
  });
};

// Journal Entries with lines
export const useJournalEntries = () => {
  return useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data: entries } = await supabase
        .from('journal_entries')
        .select(`
          *,
          journal_lines (
            *,
            accounts (code, name, type)
          )
        `);

      return z.array(JournalEntrySchema.extend({
        journal_lines: z.array(JournalLineSchema.extend({
          accounts: AccountSchema.pick({ code: true, name: true, type: true })
        }))
      })).parse(entries);
    },
  });
};

// Create Journal Entry mutation
export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      date,
      description,
      lines,
    }: {
      date: string;
      description: string;
      lines: Array<{
        account_id: string;
        debit: number;
        credit: number;
      }>;
    }) => {
      // Validate debit = credit
      const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error('Debits must equal credits');
      }

      // Create entry
      const { data: entry } = await supabase
        .from('journal_entries')
        .insert({ date, description })
        .select()
        .single();

      if (!entry) throw new Error('Failed to create entry');

      // Create lines
      const lineInserts = lines.map(l => ({
        entry_id: entry.id,
        account_id: l.account_id,
        debit: l.debit,
        credit: l.credit,
      }));

      const { error } = await supabase.from('journal_lines').insert(lineInserts);
      if (error) throw error;

      // Update account balances
      for (const line of lines) {
        const newBalance = (await supabase
          .from('accounts')
          .select('balance')
          .eq('id', line.account_id)
          .single()).data.balance + line.debit - line.credit;

        await supabase
          .from('accounts')
          .update({ balance: newBalance })
          .eq('id', line.account_id);
      }

      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      toast({ title: 'Journal entry created successfully' });
    },
    onError: (err) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });
};


import { KpiCard } from "@/components/KpiCard";
import { BankingKpis } from "@/types";
import { TrendingUp, TrendingDown, Users, DollarSign, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BankingKpiCardsProps {
  kpis: BankingKpis | undefined;
}

export function BankingKpiCards({ kpis }: BankingKpiCardsProps) {
  if (!kpis) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard 
        title="Total Deposits" 
        value={kpis.total_deposits.toLocaleString()} 
        change="+12%" 
        trend="up" 
        icon={DollarSign}
      />
      <KpiCard 
        title="Active Accounts" 
        value={kpis.active_accounts.toLocaleString()} 
        change="+5%" 
        trend="up" 
        icon={Users}
      />
      <KpiCard 
        title="Total Loans" 
        value={kpis.total_loans.toLocaleString()} 
        change="+8%" 
        trend="up" 
        icon={DollarSign}
      />
      <KpiCard 
        title="Liquidity Ratio" 
        value={kpis.liquidity_ratio.toFixed(1) + '%'} 
        change="+2.1%" 
        trend="up" 
        icon={TrendingUp}
      />
      <KpiCard 
        title="Islamic Financing" 
        value={kpis.total_islamic_financing.toLocaleString()} 
        change="+15%" 
        trend="up" 
        icon={DollarSign}
      />
      <KpiCard 
        title="High Risk Alerts" 
        value={kpis.high_risk_flags.toLocaleString()} 
        change="+3" 
        trend="down" 
        icon={AlertCircle}
      />
    </div>
  );
}


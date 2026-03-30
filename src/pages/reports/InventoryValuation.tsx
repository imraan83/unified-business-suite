import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReports } from "@/hooks/useReports";
import { TrendingUp, TrendingDown, Package } from "lucide-react";

export default function InventoryValuation() {
  const { inventory, isLoading } = useReports();
  
  const fallbackData = [
    { item_name: "Steel Rods", quantity: 1000, unit_cost: 15.50, unit: "kg", category: "Raw Materials", total_value: 15500, stock_status: "OK" },
    { item_name: "Plastic Granules", quantity: 2500, unit_cost: 8.75, unit: "kg", category: "Raw Materials", total_value: 21875, stock_status: "OK" },
    { item_name: "Electronic Components", quantity: 5000, unit_cost: 2.30, unit: "pcs", category: "Raw Materials", total_value: 11500, stock_status: "OK" },
    { item_name: "Finished Product A", quantity: 500, unit_cost: 45.00, unit: "pcs", category: "Finished Goods", total_value: 22500, stock_status: "OK" },
    { item_name: "Finished Product B", quantity: 300, unit_cost: 65.00, unit: "pcs", category: "Finished Goods", total_value: 19500, stock_status: "OK" },
    { item_name: "Work in Process", quantity: 800, unit_cost: 25.00, unit: "pcs", category: "WIP", total_value: 20000, stock_status: "OK" },
  ];

  const data = inventory || fallbackData;

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

  const totalValue = data.reduce((sum, item) => sum + item.total_value, 0);
  const lowStockItems = data.filter(item => item.stock_status === 'LOW');

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Inventory Valuation" 
        description="Detailed inventory listing and valuation" 
        icon={Package} 
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Inventory Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Inventory Value</p>
              <p className="text-2xl font-bold">PKR {totalValue.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Number of Items</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold {lowStockItems.length > 0 ? 'text-destructive' : 'text-success'}">
                {lowStockItems.length}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Categories</p>
              <p className="text-2xl font-bold">
                {[...new Set(data.map(item => item.category))].length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Inventory by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Raw Materials', color: 'hsl(220, 70%, 45%)' },
                { name: 'Finished Goods', color: 'hsl(170, 60%, 40%)' },
                { name: 'WIP', color: 'hsl(38, 92%, 50%)' },
                { name: 'Other', color: 'hsl(0, 72%, 51%)' }
              ].map((category, index) => {
                const value = data
                  .filter(item => item.category === category.name)
                  .reduce((sum, item) => sum + item.total_value, 0);
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm">{category.name}</span>
                    <span className="ml-auto text-sm font-medium">PKR {value.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle className="text-base">Inventory Details</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.item_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity.toLocaleString()} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">PKR {item.unit_cost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">PKR {item.total_value.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-0.5 text-xs rounded ${item.stock_status === 'LOW' ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'}`}>
                        {item.stock_status}
                      </span>
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
import { PageHeader } from "@/components/PageHeader";
import { DataTable, StatusBadge } from "@/components/DataTable";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const users = [
  { name: "John Doe", email: "john@enterprise.com", role: "Admin", department: "Management", lastLogin: "Mar 28, 2024", status: "Active" },
  { name: "Sarah Chen", email: "sarah@enterprise.com", role: "Accountant", department: "Finance", lastLogin: "Mar 28, 2024", status: "Active" },
  { name: "Mike Johnson", email: "mike@enterprise.com", role: "Manager", department: "Production", lastLogin: "Mar 27, 2024", status: "Active" },
  { name: "Emily Davis", email: "emily@enterprise.com", role: "Operator", department: "Production", lastLogin: "Mar 26, 2024", status: "Active" },
  { name: "Tom Wilson", email: "tom@enterprise.com", role: "Manager", department: "Sales", lastLogin: "Mar 25, 2024", status: "Active" },
  { name: "Lisa Park", email: "lisa@enterprise.com", role: "Accountant", department: "Finance", lastLogin: "Mar 20, 2024", status: "Active" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role", render: (v: string) => <Badge variant="outline">{v}</Badge> },
  { key: "department", label: "Department" },
  { key: "lastLogin", label: "Last Login" },
  { key: "status", label: "Status", render: (v: string) => <StatusBadge status={v} /> },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users & Roles" description="Manage user accounts, roles, and permissions" icon={Users} action="Add User" />
      <DataTable columns={columns} data={users} />
    </div>
  );
}

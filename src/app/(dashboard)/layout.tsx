import DashboardLayoutClient from "@/components/DashboardLayoutClient";
import QueryProvider from "@/lib/QueryProvider/QueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </QueryProvider>
  );
}

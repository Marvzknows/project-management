import DashboardLayoutClient from "@/components/DashboardLayoutClient";
import QueryProvider from "@/lib/QueryProvider/QueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutClient>
      <QueryProvider>{children}</QueryProvider>
    </DashboardLayoutClient>
  );
}

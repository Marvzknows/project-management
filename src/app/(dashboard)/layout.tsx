"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  // Call the Me API here
  // Store in the Context API the Me API user's important data

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      toast.error(error.message || "Something went wrong");
    } else {
      toast.success("Signed out successfully");
      setTimeout(() => {
        router.replace("/sign-in");
      }, 1000);
    }
  };

  // split pathname: "/projects" -> ["projects"]
  const segments = pathname.split("/").filter(Boolean);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              {segments.length === 0 ? (
                // fallback if user is at "/"
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                segments.map((segment, index) => {
                  const href = "/" + segments.slice(0, index + 1).join("/");
                  const isLast = index === segments.length - 1;
                  const label =
                    segment.charAt(0).toUpperCase() + segment.slice(1);

                  return (
                    <BreadcrumbItem key={href}>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink asChild>
                            <Link href={href}>{label}</Link>
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </BreadcrumbItem>
                  );
                })
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto space-x-1">
            <ThemeToggle />
            <Button onClick={handleSignOut} className="ml-auto" variant="ghost">
              <LogOut />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col mx-auto w-full">{children}</div>
      </SidebarInset>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}

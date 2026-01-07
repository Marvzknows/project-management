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
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import FullPageLoader from "./FullPageLoader";
import FullPageError from "./FullPageError";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth/AuthContext";
import ProfileDropdowMenu from "./ProfileDropdownMenu";
import { MeApi } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { meApi } from "@/lib/axios/api/auth";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUserAuth } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const { data, isFetching, error, refetch } = useQuery<MeApi>({
    queryKey: ["meApi"],
    queryFn: async () => await meApi(),
  });

  // Store session and user data in context when available
  useEffect(() => {
    if (data) {
      setUserAuth(data || null);
    }
  }, [data, setUserAuth]);

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

  if (isFetching) {
    return <FullPageLoader />;
  }

  if (error) {
    return <FullPageError onRetry={refetch} />;
  }

  // split pathname: "/projects" -> ["projects"]
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
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

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <ProfileDropdowMenu handleSignOut={handleSignOut} />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col mx-auto w-full min-h-0 overflow-hidden">
          {children}
        </div>
      </SidebarInset>
      <Toaster richColors position="bottom-right" />
    </SidebarProvider>
  );
}

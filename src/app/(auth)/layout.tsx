import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
const AuthLayout = async ({ children }: Props) => {
  const session = await getServerSession();
  if (session?.user) redirect("/dashboard");

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default AuthLayout;

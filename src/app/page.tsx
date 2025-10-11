import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="border-8  min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-1">
        <Button variant={"outline"}>
          <Link href={"/sign-in"}>Sign-in</Link>
        </Button>
        <Button>
          <Link href={"/sign-up"}>Sign-up</Link>
        </Button>
      </div>
    </div>
  );
}

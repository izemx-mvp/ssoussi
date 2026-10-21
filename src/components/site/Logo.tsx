import logo from "@/assets/ssoussi-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={logo.url} alt="SSOUSSI — Artisanat marocain" width={541} height={545} className={cn("w-auto mix-blend-multiply", className)} />;
}
export const logoUrl = logo.url;

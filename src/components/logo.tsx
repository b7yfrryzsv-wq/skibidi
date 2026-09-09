import Image from "next/image";

import { cn } from "@/lib/utils";

/** Official EDF logo, served from /public/brand. */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/edf-logo.webp"
      alt="EDF"
      width={3840}
      height={1634}
      priority={priority}
      className={cn("h-9 w-auto sm:h-10", className)}
    />
  );
}

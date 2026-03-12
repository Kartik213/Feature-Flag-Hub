{/* <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div> */}

import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput({ className, type, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
        <input
            type={showPassword ? "text" : "password"}
            data-slot="input"
            className={cn(
                "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className
            )}
            {...props}
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
        >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
    </div>
  )
}

export { PasswordInput }

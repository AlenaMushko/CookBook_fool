import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full",
        "border border-transparent p-[3px] transition-colors outline-none",
        "after:absolute after:-inset-x-2 after:-inset-y-2.5",
        "focus-visible:ring-[3px] focus-visible:ring-ring/35",
        "data-[size=default]:h-[22px] data-[size=default]:w-10",
        "data-[size=sm]:h-[18px] data-[size=sm]:w-8 data-[size=sm]:p-0.5",
        "data-checked:bg-primary",
        "data-unchecked:bg-border",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:ring-[3px] aria-invalid:ring-error/30",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0",
          "group-data-[size=default]/switch:data-checked:translate-x-[18px]",
          "group-data-[size=sm]/switch:size-3.5",
          "group-data-[size=sm]/switch:data-unchecked:translate-x-0",
          "group-data-[size=sm]/switch:data-checked:translate-x-[14px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

import type { ReactNode } from 'react'

export function SectionCard({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-[22px]">
      {title ? (
        <h2 className="font-sans text-[11px] font-medium tracking-[0.07em] text-muted-foreground uppercase">
          {title}
        </h2>
      ) : null}
      <div className={title ? 'pt-4' : undefined}>{children}</div>
    </section>
  )
}

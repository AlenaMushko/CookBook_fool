import type { ReactNode } from 'react'

export const SectionCard = ({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) => {
  return (
    <section className="rounded-lg border border-border bg-card p-[22px]">
      {title ? (
        <h2 className="font-serif text-[22px] leading-7 font-medium text-foreground">
          {title}
        </h2>
      ) : null}
      <div className={title ? 'pt-4' : undefined}>{children}</div>
    </section>
  )
}

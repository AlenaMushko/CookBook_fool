export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden border-t-[0.75px] border-secondary-border bg-card px-7 py-5 text-center md:block">
      <p className="type-caption text-accent-foreground">
        © {currentYear} Cookbook. All rights reserved.
      </p>
    </footer>
  )
}

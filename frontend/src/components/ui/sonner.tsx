import { Toaster as Sonner, type ToasterProps } from "sonner";

const placeholder = <span className='text-xs font-bold'>!!!</span>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme='light'
      className='toaster group'
      icons={{
        success: placeholder,
        info: placeholder,
        warning: placeholder,
        error: placeholder,
        loading: placeholder,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

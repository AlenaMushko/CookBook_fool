import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className='w-[90%] max-w-[600px] gap-0 rounded-xl border-border bg-card p-6 shadow-[var(--shadow-modal)] md:max-w-[900px]'
      >
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          className='absolute top-3 right-3'
          onClick={onClose}
          aria-label='Close'
        >
          !!!
        </Button>

        {title ? (
          <DialogHeader className='mb-4'>
            <DialogTitle className='text-center font-serif text-lg font-normal'>
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : null}

        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;

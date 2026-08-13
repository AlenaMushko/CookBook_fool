import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useTranslation } from "react-i18next";

interface IConfirmationPopup {
  title?: string;
  message?: string;
  secondaryMessage?: string;
  highlightedMessage?: string;
  isOpenModal: boolean;
  onClose: () => void;
  onConfirmClick: () => void;
  additionalText?: string;
}

const ConfirmationPopup: React.FC<IConfirmationPopup> = ({
  title,
  message,
  secondaryMessage,
  highlightedMessage,
  isOpenModal,
  onClose,
  onConfirmClick,
  additionalText,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpenModal} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className='max-w-sm gap-4 rounded-xl border-border bg-card sm:max-w-md'>
        {title ? (
          <DialogHeader>
            <DialogTitle className='text-center text-xl font-bold'>
              {title}
            </DialogTitle>
          </DialogHeader>
        ) : null}

        {(message || highlightedMessage) && (
          <p className='text-center text-base text-foreground'>
            {message ? <span>{message} </span> : null}
            {highlightedMessage ? (
              <span className='font-bold text-info'>{highlightedMessage}</span>
            ) : null}
            {secondaryMessage ? <span> {secondaryMessage}</span> : "?"}
          </p>
        )}

        {additionalText ? (
          <p className='text-center text-sm text-destructive'>{additionalText}</p>
        ) : null}

        <DialogFooter className='flex w-full flex-row gap-2 sm:justify-center'>
          <Button
            type='button'
            variant='secondary'
            className='flex-1 bg-brand-soft text-foreground hover:bg-brand hover:text-brand-foreground'
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button
            type='button'
            className='flex-1 bg-primary hover:bg-primary-hover'
            onClick={onConfirmClick}
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationPopup;

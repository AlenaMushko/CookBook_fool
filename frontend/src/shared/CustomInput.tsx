import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import React from "react";

export interface CustomInputProps {
  formik: FormikProps<any>;
  isInvalid: boolean | undefined;
  name: string;
  helpText?: string;
  type: string;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  h?: string | number;
  fontWeight?: number | string;
  fontSize?: string;
  maxLength?: number;
  currencyIcon?: string;
  onHandleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: number | string;
  pattern?: string;
  background?: string;
  formErrorPosition?: "absolute" | "relative" | "static";
  password?: boolean;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
  show?: boolean;
  mb?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  formik,
  isInvalid,
  name,
  helpText,
  type,
  label,
  placeholder = "",
  isRequired,
  h,
  maxLength = 60,
  onHandleChange,
  onHandleBlur,
  value,
  pattern,
  currencyIcon,
  password = false,
  setShow,
  show,
  formErrorPosition,
  mb = 0,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!pattern || newValue.match(pattern) || newValue === "") {
      if (onHandleChange) {
        onHandleChange(e);
      } else {
        formik.setFieldValue(name, newValue);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onHandleBlur) {
      onHandleBlur(e);
    } else {
      formik.handleBlur(e);
    }
  };

  const inputValue = value !== undefined ? value : formik.values[name];
  const errorText = isInvalid ? (formik.errors[name] as string) : helpText;

  return (
    <div className='relative w-full' style={{ marginBottom: mb }}>
      {label && (
        <Label
          htmlFor={name}
          className='mb-1.5 text-xs font-semibold text-foreground'
        >
          {label}
          {isRequired ? <span className='ml-0.5 text-destructive'>*</span> : null}
        </Label>
      )}
      <div className='relative'>
        {currencyIcon ? (
          <span className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground'>
            {currencyIcon}
          </span>
        ) : null}
        <Input
          id={name}
          name={name}
          type={password && setShow ? (show ? "text" : "password") : type}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-invalid={Boolean(isInvalid)}
          className={cn(
            "h-11 rounded-md border-border bg-card text-sm text-foreground",
            "placeholder:text-subtle",
            "hover:border-primary-muted",
            "focus-visible:border-primary focus-visible:ring-primary/30",
            currencyIcon && "pl-8",
            password && setShow && "pr-10",
            isInvalid &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
          )}
          style={h ? { height: h } : undefined}
        />
        {password && setShow ? (
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            className='absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground'
            onClick={() => setShow(!show)}
            aria-label='toggle password visibility'
          >
            !!!
          </Button>
        ) : null}
      </div>
      {errorText ? (
        <p
          className={cn(
            "mt-1 text-xs",
            isInvalid ? "text-destructive" : "text-muted-foreground",
            formErrorPosition === "absolute" && "absolute"
          )}
        >
          {errorText}
        </p>
      ) : null}
    </div>
  );
};

export default CustomInput;

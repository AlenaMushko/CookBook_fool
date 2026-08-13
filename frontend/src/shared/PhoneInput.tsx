import "react-phone-input-2/lib/style.css";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormikErrors, FormikTouched, getIn } from "formik";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";

interface CustomPhoneInputProps {
  label: string;
  fieldName: string;
  formikValues: any;
  formikTouched: FormikTouched<any>;
  formikErrors: FormikErrors<any>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  isRequired?: boolean;
  defaultCountry?: string;
  disabled?: boolean;
  mb?: number;
  mr?: number;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  label,
  fieldName,
  formikValues,
  formikTouched,
  formikErrors,
  setFieldValue,
  isRequired = false,
  defaultCountry = "us",
  disabled = false,
  mb = 2,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const value = getIn(formikValues, fieldName);
  const touched = getIn(formikTouched, fieldName);
  const error = getIn(formikErrors, fieldName);
  const isError = touched && error;
  const borderColor = isError
    ? "var(--destructive)"
    : isFocused
      ? "var(--brand-soft)"
      : "var(--brand-pressed)";

  return (
    <div className='relative w-full' style={{ marginBottom: mb }}>
      {label ? (
        <Label
          htmlFor={fieldName}
          className='mb-1.5 text-xs font-semibold text-foreground'
        >
          {label}
          {isRequired ? <span className='ml-0.5 text-destructive'>*</span> : null}
        </Label>
      ) : null}
      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={(phone) => setFieldValue(fieldName, `+${phone}`)}
        inputStyle={{
          width: "100%",
          height: "44px",
          fontSize: "14px",
          borderRadius: "7px",
          border: `1px solid ${borderColor}`,
          paddingLeft: "48px",
          backgroundColor: "var(--card)",
          color: "var(--foreground)",
        }}
        containerStyle={{
          borderRadius: "7px",
        }}
        inputProps={{
          name: fieldName,
          required: isRequired,
          disabled: disabled,
          id: fieldName,
        }}
        buttonStyle={{
          border: "none",
          borderLeft: `1px solid ${borderColor}`,
          borderRight: `1px solid ${borderColor}`,
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          borderRadius: "7px 0 0 7px",
          backgroundColor: "var(--secondary)",
        }}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {isError ? (
        <p className={cn("mt-1 text-xs text-destructive")}>{error}</p>
      ) : null}
    </div>
  );
};

export default CustomPhoneInput;

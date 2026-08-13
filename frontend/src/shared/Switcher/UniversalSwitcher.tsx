import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

interface UniversalSwitcherProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const UniversalSwitcher: React.FC<UniversalSwitcherProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <div className='flex items-center gap-2'>
      <Switch
        checked={checked}
        onCheckedChange={(next) => {
          onChange({
            target: { checked: next },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        aria-label='universal switch'
      />
      <Label className='text-sm font-bold'>{label}</Label>
    </div>
  );
};

export default UniversalSwitcher;

import { forwardRef, ReactNode, SelectHTMLAttributes } from "react";
import "./EnhanceSelect.css";
import { cn } from "~/utils/utils";

type SelectProps = {
  defaultValue?: string | string[] | number;
  className?: string;
  arrayOption: {
    label: string;
    value: string | number;
  }[];
  children?: ReactNode;
  size?: number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
} & SelectHTMLAttributes<HTMLSelectElement>;

const EnhanceSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, defaultValue, arrayOption, children, multiple = false, onChange, ...rest }, ref) => {
    return (
      <select
        className={cn("border h-6 m-1 text-sm pl-1", className)}
        onChange={onChange}
        defaultValue={defaultValue}
        multiple={multiple}
        ref={ref}
        {...rest}
      >
        {arrayOption.map((item, index) => {
          return (
            <option key={item.value + index.toString()} value={item.value}>
              {item.label}
            </option>
          );
        })}
        {children}
      </select>
    );
  },
);

EnhanceSelect.displayName = "EnhanceSelect";

export default EnhanceSelect;

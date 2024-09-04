import { forwardRef, ReactNode, SelectHTMLAttributes } from "react";
import "./Select.css";
import { cn } from "~/utils/utils";

type SelectProps = {
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
  size?: number;
} & SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, defaultValue = "", children, ...rest }, ref) => {
  return (
    <select className={cn("border h-6 m-1 text-sm pl-1", className)} defaultValue={defaultValue} ref={ref} {...rest}>
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "~/utils/utils";

type PropsComponent = {
  className?: string;
  type?: string;
  name?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, PropsComponent>(({ className, defaultValue = "", name, type = "text", ...rest }, ref) => {
  return <input type={type} name={name} defaultValue={defaultValue} className={cn("h-6 border m-1 text-sm pl-1", className)} ref={ref} {...rest} />;
});

Input.displayName = "Input";

export default Input;

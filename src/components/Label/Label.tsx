import React from "react";
import { cn } from "~/utils/utils";

type PropsComponent = {
  name?: string;
  htmlFor?: string;
  className?: string;
  classNameLabel?: string;
  children?: React.ReactNode;
  isRequired?: boolean;
};
const Label: React.FC<PropsComponent> = ({ name, htmlFor, className, classNameLabel, children, isRequired = false }) => {
  return (
    <label htmlFor={htmlFor} className={cn("text-xs text-gray-rain font-bold p-1.5", className)}>
      <span className={cn("flex gap-1 w-[175px] justify-end", classNameLabel)}>
        {name}
        {isRequired && <span className="text-[red]">*</span>}
      </span>

      {children}
    </label>
  );
};

export default Label;

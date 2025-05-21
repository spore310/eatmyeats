"use client";
import { ComponentPropsWithoutRef, ReactNode, Ref, forwardRef } from "react";

enum BODYTYPE {
  default = "form",
}
type FormProps = ComponentPropsWithoutRef<"form"> & {
  children: ReactNode;
  varation?: "default" | null;
};

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, varation, ...props }, ref) => {
    const Component = varation ? BODYTYPE[varation] : "form";
    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

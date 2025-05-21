import { ReactNode } from "react";

interface customPTagProps {
  children?: ReactNode;
  className?: string | string[] | { [key: string]: boolean };
}
const customPTag = ({ children, className }: customPTagProps): ReactNode => {
  return <p className={`${className}`}>{children}</p>;
};

export default customPTag;

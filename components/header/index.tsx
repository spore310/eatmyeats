import { ReactNode } from "react";
import P from "@/components/common/typography/p";

interface HeaderProps {}

const Header = ({}: HeaderProps): ReactNode => {
  return (
    <div className="h-24 bg-blue-300 min-w-[500px] border border-lime-500 pt-2 pl-4">
      <div className="border border-red-500 w-full flex whitespace-nowrap overflow-x-hidden">
        <P>{`Heading`}</P>
        <P>{`Content`}</P>
      </div>
    </div>
  );
};

export default Header;

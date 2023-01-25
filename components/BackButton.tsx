import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
interface BackButtonProps {
  text?: string;
  href?: string;
}

export const BackButton = ({ text = "Back", href = "/" }) => {
  return (
    <Link href={href} className="-mx-1 flex items-center align-baseline space-x-0.5 text-sm">
      <FaChevronLeft></FaChevronLeft>
      <div>{text}</div>
    </Link>
  );
};

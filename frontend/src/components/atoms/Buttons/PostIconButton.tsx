import React from "react";
interface PostIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}
export default function PostIconButton({ children, className = "", ...props }: PostIconButtonProps) {
  return (
    <button
      {...props}
      className={`bg-white transition-all duration-200 p-0 outline-none border-none focus:outline-none focus:ring-0 ${className}`}
      style={{ outline: "none", border: "none", boxShadow: "none", background: "transparent", lineHeight: 0 }}
    >{children}</button>
  );
}

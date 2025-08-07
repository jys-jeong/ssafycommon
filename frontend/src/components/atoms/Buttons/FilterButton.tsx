export function FilterButton({ children, color = "primary", ...props }) {
  // color별 class 조합 등 props 확장 가능
  return (
    <button className="px-3 py-[2px] rounded-full text-[13px] font-bold ..." {...props}>
      {children}
    </button>
  );
}
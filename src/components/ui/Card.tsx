interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      className={`bg-white rounded-2xl shadow-sm ${paddingMap[padding]} ${
        onClick
          ? "w-full text-left cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

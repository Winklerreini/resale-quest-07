interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg px-3 py-1",
    md: "text-xl px-4 py-2", 
    lg: "text-2xl px-6 py-3"
  };

  return (
    <div className={`inline-flex items-center justify-center bg-gradient-logo rounded-lg shadow-lg ${className}`}>
      <span className={`font-bold text-white tracking-wide ${sizeClasses[size]}`}>
        ResaleHub
      </span>
    </div>
  );
}
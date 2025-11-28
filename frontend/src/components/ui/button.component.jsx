export default function Button({
  variant = "neutral",
  type = "",
  className = "",
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${type ? `btn-${type}` : ""} ${className}`}
    >
      {children}
    </button>
  );
}

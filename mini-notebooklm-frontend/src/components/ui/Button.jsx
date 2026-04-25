export default function Button({ children, variant = "primary", size = "md", className = "", type = "button", ...props }) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} type={type} {...props}>
      {children}
    </button>
  );
}

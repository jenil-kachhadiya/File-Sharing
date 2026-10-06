function ActionButton({ icon, children, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-40 h-14 rounded-xl flex items-center justify-center gap-2 transition font-medium ${className}`}>
      {icon} 
      <span>{children}</span>
    </button>
  );
}

export default ActionButton;
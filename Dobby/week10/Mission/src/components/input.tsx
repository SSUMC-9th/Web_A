interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Input = ({ value, onChange, placeholder, className }: InputProps) => {
  return (
    <input
      type="text"
      autoComplete="off"
      className={`w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${className ?? ''}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Input;

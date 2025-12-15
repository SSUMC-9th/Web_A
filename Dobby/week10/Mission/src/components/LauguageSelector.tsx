interface LanguageOption {
  value: string;
  label: string;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: LanguageOption[];
  className?: string;
}

export const LanguageSelector = ({
  value,
  onChange,
  options,
  className = '',
}: LanguageSelectorProps) => {
  return (
    <select
      className={`w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-neutral-100 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;

interface SelectBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id?: string;
  className?: string;
}

export const SelectBox = ({
  checked,
  onChange,
  label,
  id = 'checkbox',
  className,
}: SelectBoxProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-white/20 bg-black/30 text-indigo-500 focus:ring-indigo-400"
      />
      <label htmlFor={id} className="ml-2 text-sm font-semibold text-neutral-200">
        {label}
      </label>
    </div>
  );
};

export default SelectBox;

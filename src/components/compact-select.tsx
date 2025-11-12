import Select from 'react-select';

type Option = { value: string; label: string };

interface CompactSelectProps {
  value: string | undefined;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

export default function CompactSelect({
  value,
  onChange,
  options,
  placeholder = 'בחר...',
  disabled = false,
}: CompactSelectProps) {
  const opts: Option[] = options.map(o => ({ value: o, label: o }));

  return (
    <Select
      value={opts.find(o => o.value === value) ?? null}
      onChange={(opt) => onChange((opt as Option).value)}
      options={opts}
      placeholder={placeholder}
      isDisabled={disabled}
      menuPortalTarget={document.body}
      menuPosition="fixed" 
      styles={{
        menuPortal: base => ({ ...base, zIndex: 9999 }), 
        menu: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          textAlign: 'right',
          direction: 'rtl',
          overflowY: 'auto',
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: '6px',
          border: '1px solid #ddd',
        }),
        menuList: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          textAlign: 'right',
          direction: 'rtl',
          maxHeight: 160,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 0,
        }),
        control: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          direction: 'rtl',
          minHeight: '2.2rem',
          height: '2.2rem',
          zIndex: 1,
          border: '1px solid #ddd',
          borderRadius: '6px',
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          opacity: disabled ? 0.6 : 1,
        }),
        input: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          color: '#333',
        }),
        placeholder: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          color: '#666',
          textAlign: 'right',
        }),
        option: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          textAlign: 'right',
          direction: 'rtl',
          padding: '0.5rem',
          color: '#333',
          backgroundColor: base.isSelected ? '#007bff' : base.isFocused ? '#f7f7f7' : 'white',
        }),
        singleValue: base => ({
          ...base,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important",
          fontSize: '0.85rem',
          textAlign: 'right',
          color: '#333',
        }),
        dropdownIndicator: base => ({
          ...base,
          color: '#666',
          opacity: disabled ? 0.6 : 1,
        }),
      }}
    />
  );
}
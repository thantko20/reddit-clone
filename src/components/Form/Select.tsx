import { Listbox } from '@headlessui/react';
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';

export type SelectOptionType = { label: string; value: string };

export interface SelectProps {
  name: string;
  options: Array<SelectOptionType>;
  defaultOption?: SelectOptionType | null;
  label?: string;
}

export const Select = ({
  name,
  options,
  label = '',
  defaultOption = null,
}: SelectProps) => {
  const { setFieldValue } = useFormikContext();
  const [option, setOption] = useState<SelectOptionType>({
    label: label,
    value: '',
  });

  const handleOptionsOnChange = useCallback(
    (option: SelectOptionType) => {
      setFieldValue(name, option);
      setOption(option);
    },
    [name, setFieldValue],
  );

  useEffect(() => {
    if (defaultOption) {
      handleOptionsOnChange(defaultOption);
    }
  }, [defaultOption, handleOptionsOnChange]);

  return (
    <div>
      <Listbox value={option} onChange={handleOptionsOnChange}>
        <div className='relative w-full max-w-xs font-semibold'>
          <Listbox.Button className='w-full bg-zinc-700 px-4 py-2 rounded'>
            {option.label}
          </Listbox.Button>
          <div className='absolute top-full w-full bg-zinc-800 rounded overflow-auto max-h-32'>
            <Listbox.Options>
              {options.length !== 0 &&
                options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    value={opt}
                    className='px-4 py-2 cursor-pointer hover:bg-zinc-900'
                  >
                    {opt.label}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </div>
        </div>
      </Listbox>
    </div>
  );
};

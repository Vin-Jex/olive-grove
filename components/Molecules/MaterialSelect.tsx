import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SignupType } from '@/pages/auth/path/students/signup';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleSelect({
  options,
  name,
  onChange,
}: {
  options: { name: string; value: string }[];
  name: string;
  onChange: React.Dispatch<React.SetStateAction<SignupType>>;
}) {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onChange((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleRemove = (id: string, name: string) => {
    setPersonName((prev) => prev.filter((item) => item !== id));
    onChange((prev) => ({
      ...prev,
      [name]: (prev[name as keyof SignupType] as string[]).filter(
        (item) => item !== id
      ),
    }));
  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id='demo-multiple-name-label'>Subjects</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          id='demo-multiple-name'
          multiple
          name={name}
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label='enrolledSubjects' />}
          MenuProps={MenuProps}
        >
          {options.map((name) => (
            <MenuItem
              key={name.name}
              value={name.value}
              style={getStyles(name.name, personName, theme)}
            >
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className='mt-9 mb-4'>
        {personName
          .map((id) => options.find((option) => option.value === id))
          .map(
            (obj) =>
              obj && (
                <Label
                  key={obj.value}
                  id={obj.value}
                  formName={name}
                  remove={handleRemove}
                  name={obj.name}
                />
              )
          )}
      </div>
    </div>
  );
}

function Label(props: { name: string; id: string; formName: string; remove: (id: string, name: string) => void }) {
  return (
    <span className='px-5 py-3 flex items-center w-fit gap-3 rounded-full border'>
      {props.name}{' '}
      <button onClick={() => props.remove(props.id, props.formName)}>
        <CancelIcon />
      </button>
    </span>
  );
}

function CancelIcon() {
  return (
    <svg
      width='11'
      height='12'
      className='h-5'
      viewBox='0 0 11 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M3.09766 8.40276L5.5007 5.99972L7.90374 8.40276M7.90374 3.59668L5.50024 5.99972L3.09766 3.59668'
        stroke='#1E1E1E'
        strokeOpacity='0.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export const colorStyles = {
  multiValue: (styles: any) => {
    return {
      ...styles,
      backgroundColor: '#D6e8FC',
      color: '#3886E2',
      borderRadius: 5,
      border: '1px solid #3886E2',
    };
  },
  multiValueLabel: (styles: any) => {
    return {
      ...styles,
      color: '#3886E2',
    };
  },
  multiValueRemove: (styles: any) => {
    return {
      ...styles,
      color: '#3886E2',
      cursor: 'pointer',
      ':hover': {
        color: '#fff',
        backgroundColor: '#3886E2',
        borderRadius: 3,
      },
      borderRadius: 5,
    };
  },
  placeholder: (base: any) => ({
    ...base,
    fontSize: '0.75rem',
  }),
};

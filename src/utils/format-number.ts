type InputValue = string | number | null | undefined;

export function fCurrency(inputValue: InputValue) {
  if (inputValue === null || inputValue === undefined || inputValue === '') return '';

  const number = Number(inputValue);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
}

export function fData(inputValue: InputValue) {
  if (inputValue === null || inputValue === undefined || inputValue === '') return '';

  if (inputValue === 0) return '0 Bytes';

  const units = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];
  const decimal = 2;
  const baseValue = 1024;
  const number = Number(inputValue);
  const index = Math.floor(Math.log(number) / Math.log(baseValue));

  return `${parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;
}

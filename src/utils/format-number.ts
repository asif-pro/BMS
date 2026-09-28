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

import type { ITransactionItem } from '@/interfaces/account.interface';

export function getTransactionMonthOptions(transactions: ITransactionItem[]) {
  const keys = new Set<string>();

  transactions.forEach((item) => {
    const year = item.date.getFullYear();
    const month = item.date.getMonth();
    keys.add(`${year}-${month}`);
  });

  return Array.from(keys)
    .map((key) => {
      const [year, month] = key.split('-').map(Number);
      const label = new Date(year, month, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });

      return { value: key, label, year, month };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

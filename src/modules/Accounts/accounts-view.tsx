import sumBy from 'lodash/sumBy';
import { useMemo } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { paths } from '@/routes/paths';
import { useTranslation } from 'react-i18next';

import Scrollbar from '@/components/scrollbar';
import { useSettingsContext } from '@/components/settings';
import CustomBreadcrumbs from '@/components/custom-breadcrumbs';

import { EXPENSE_CATEGORIES } from '@/constants/account.constant';
import {
  useGetAccountTrends,
  useGetStaffSalaries,
  useGetTransactions,
  useGetWalletCards,
} from '@/hooks/useGetAccounts.hook';
import AccountAnalytic from './account-analytic';
import AccountBalanceCard from './account-balance-card';
import AccountStaffSalary from './account-staff-salary';
import AccountWidgetSummary from './account-widget-summary';
import AccountBalanceStatistics from './account-balance-statistics';
import AccountExpenseCategories from './account-expense-categories';
import AccountRecentTransactions from './account-recent-transactions';
import AccountTransactionsTable from './account-transactions-table';

// ----------------------------------------------------------------------

export default function AccountsView() {
  const theme = useTheme();
  const { t } = useTranslation('index');

  const settings = useSettingsContext();
  const { data: transactionList = [] } = useGetTransactions();
  const { data: staffSalaryList = [] } = useGetStaffSalaries();
  const { data: walletCards = [] } = useGetWalletCards();
  const { data: trends } = useGetAccountTrends();
  const incomeTrend = trends?.incomeTrend ?? [];
  const expenseTrend = trends?.expenseTrend ?? [];
  const balanceStatistics = trends?.balanceStatistics ?? {
    categories: [],
    series: [],
  };

  const stats = useMemo(() => {
    const income = transactionList.filter((item) => item.type === 'Income');
    const expense = transactionList.filter((item) => item.type === 'Expense');
    const pending = transactionList.filter((item) => item.status === 'pending');
    const completed = transactionList.filter((item) => item.status === 'completed');

    const completedIncome = sumBy(
      income.filter((item) => item.status === 'completed'),
      'amount'
    );
    const completedExpense = sumBy(
      expense.filter((item) => item.status === 'completed'),
      'amount'
    );

    return {
      all: { count: transactionList.length, amount: sumBy(transactionList, 'amount') },
      income: { count: income.length, amount: sumBy(income, 'amount') },
      expense: { count: expense.length, amount: sumBy(expense, 'amount') },
      pending: { count: pending.length, amount: sumBy(pending, 'amount') },
      net: {
        count: completed.length,
        amount: completedIncome - completedExpense,
        percent: completedIncome ? ((completedIncome - completedExpense) / completedIncome) * 100 : 0,
      },
      completedIncome,
      completedExpense,
    };
  }, [transactionList]);

  const getPercent = (count: number) => (count / stats.all.count) * 100;

  const expenseSeries = EXPENSE_CATEGORIES.map((category) => ({
    label: category,
    value: sumBy(
      transactionList.filter(
        (item) =>
          item.type === 'Expense' && item.category === category && item.status === 'completed'
      ),
      'amount'
    ),
  }));

  const recentTransactions = [...transactionList]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} disableGutters>
      <CustomBreadcrumbs
        heading="ACCOUNTS"
        links={[{ name: 'NAV_DASHBOARD', href: paths.dashboard.root }, { name: 'NAV_ACCOUNTS' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={7}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <AccountWidgetSummary
              title={t('INCOME')}
              icon="eva:diagonal-arrow-left-down-fill"
              percent={2.6}
              total={stats.completedIncome}
              chart={{ series: incomeTrend }}
            />

            <AccountWidgetSummary
              title={t('EXPENSES')}
              color="warning"
              icon="eva:diagonal-arrow-right-up-fill"
              percent={-0.5}
              total={stats.completedExpense}
              chart={{ series: expenseTrend }}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={5}>
          {walletCards[0] && <AccountBalanceCard card={walletCards[0]} />}
        </Grid>

        <Grid xs={12}>
          <Card>
            <Scrollbar>
              <Stack
                direction="row"
                divider={
                  <Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />
                }
                sx={{ py: 2 }}
              >
                <AccountAnalytic
                  title={t('TOTAL')}
                  total={stats.all.count}
                  percent={100}
                  price={stats.all.amount}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.info.main}
                />

                <AccountAnalytic
                  title={t('INCOME')}
                  total={stats.income.count}
                  percent={getPercent(stats.income.count)}
                  price={stats.income.amount}
                  icon="solar:file-check-bold-duotone"
                  color={theme.palette.success.main}
                />

                <AccountAnalytic
                  title={t('EXPENSES')}
                  total={stats.expense.count}
                  percent={getPercent(stats.expense.count)}
                  price={stats.expense.amount}
                  icon="solar:bell-bing-bold-duotone"
                  color={theme.palette.error.main}
                />

                <AccountAnalytic
                  title={t('PENDING')}
                  total={stats.pending.count}
                  percent={getPercent(stats.pending.count)}
                  price={stats.pending.amount}
                  icon="solar:sort-by-time-bold-duotone"
                  color={theme.palette.warning.main}
                />

                <AccountAnalytic
                  title={t('NET')}
                  total={stats.net.count}
                  percent={Math.max(0, stats.net.percent)}
                  price={stats.net.amount}
                  icon="solar:wallet-money-bold-duotone"
                  color={theme.palette.primary.main}
                />
              </Stack>
            </Scrollbar>
          </Card>
        </Grid>

        <Grid xs={12}>
          <AccountTransactionsTable tableData={transactionList} />
        </Grid>

        <Grid xs={12} md={5}>
          <AccountExpenseCategories
            title={t('EXPENSE_CATEGORIES')}
            chart={{
              series: expenseSeries,
              colors: [
                theme.palette.primary.main,
                theme.palette.warning.dark,
                theme.palette.success.darker,
                theme.palette.error.main,
                theme.palette.info.dark,
                theme.palette.info.darker,
                theme.palette.success.main,
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={7}>
          <AccountRecentTransactions
            title={t('RECENT_TRANSACTIONS')}
            tableData={recentTransactions}
          />
        </Grid>

        <Grid xs={12}>
          <AccountStaffSalary tableData={staffSalaryList} />
        </Grid>

        <Grid xs={12}>
          <AccountBalanceStatistics
            title={t('BALANCE_STATISTICS')}
            subheader={t('BALANCE_STATISTICS_SUBHEADER')}
            chart={{
              categories: balanceStatistics.categories,
              series: balanceStatistics.series,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

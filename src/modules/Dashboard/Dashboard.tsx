import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation('index');

  return (
    <Box mb="14px">
      <Typography variant="h4">{t('DASHBOARD')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('HI')}
      </Typography>
    </Box>
  );
};

export default Dashboard;

import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { t } = useTranslation('index');

  return (
    <Box>
      <Typography variant="h4">{t('SETTINGS')}</Typography>
    </Box>
  );
};

export default Settings;

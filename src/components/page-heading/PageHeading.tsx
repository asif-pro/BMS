import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type PageHeadingProps = {
  title: string;
};

export default function PageHeading({ title }: PageHeadingProps) {
  const { t } = useTranslation('index');

  return (
    <Box>
      <Typography variant="h4">{t(title)}</Typography>
    </Box>
  );
}

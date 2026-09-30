import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  const { t } = useTranslation('index');

  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        {t('NOT_FOUND')}
      </Typography>

      <Typography variant="body2">
        {t('NO_RESULTS_FOUND_FOR')} &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> {t('SEARCH_NOT_FOUND_HINT')}
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      {t('PLEASE_ENTER_KEYWORDS')}
    </Typography>
  );
}

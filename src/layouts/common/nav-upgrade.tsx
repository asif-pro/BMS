import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { paths } from '@/routes/paths';
import { useMockedUser } from '@/hooks/use-mocked-user';

import Label from '@/components/label';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { t } = useTranslation('index');
  const { user } = useMockedUser();

  return (
    <Stack
      sx={{
        px: 2,
        py: 4,
        textAlign: 'center',
      }}
    >
      <Stack
        alignItems="center"
        sx={{
          p: 2.5,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 'bold',
            }}
          >
            {user?.displayName?.charAt(0).toUpperCase()}
          </Avatar>

          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {t('FREE')}
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button variant="contained" href={paths.minimalUI} target="_blank" rel="noopener">
          {t('UPGRADE_TO_PRO')}
        </Button>
      </Stack>
    </Stack>
  );
}

import { Box, Modal, Typography } from '@mui/material';
import { alpha } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { COMMON } from '@/hooks/useCustomTheme/colors/commonColorPalette';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export type ProfileActions = 'profileDetails' | 'editPassword' | '2FASettings';

const Profile = ({ open, setOpen }: Props) => {
  const handleClose = () => setOpen(false);

  return open ? (
    <Modal
      open={open}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: alpha(COMMON.black, 0.5) },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '468px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography variant="h6">Profile</Typography>
      </Box>
    </Modal>
  ) : null;
};

export default Profile;

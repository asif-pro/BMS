import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';

import Iconify from '@/components/iconify';
import Label from '@/components/label';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

type Workspace = {
  id: string;
  name: string;
  plan: 'Free' | 'Pro';
  icon: string;
  color: string;
};

const WORKSPACES: Workspace[] = [
  { id: 'team-1', name: 'Team 1', plan: 'Free', icon: 'solar:hexagon-bold', color: '#5B4DFF' },
  { id: 'team-2', name: 'Team 2', plan: 'Pro', icon: 'solar:star-fall-bold', color: '#FF4D8D' },
  { id: 'team-3', name: 'Team 3', plan: 'Pro', icon: 'solar:smile-circle-bold', color: '#FF6A3D' },
];

// ----------------------------------------------------------------------

export default function WorkspacesPopover() {
  const { t } = useTranslation('index');
  const popover = usePopover();

  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const handleChangeWorkspace = useCallback(
    (newValue: Workspace) => {
      setWorkspace(newValue);
      popover.onClose();
    },
    [popover]
  );

  return (
    <>
      <ButtonBase
        onClick={popover.onOpen}
        sx={{
          py: 0.5,
          pl: 0.75,
          pr: 1,
          gap: 1,
          borderRadius: 1.25,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <WorkspaceLogo workspace={workspace} />

        <Box
          component="span"
          sx={{ typography: 'subtitle2', display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {workspace.name}
        </Box>

        <Label
          color={workspace.plan === 'Free' ? 'default' : 'info'}
          sx={{ height: 22, display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {workspace.plan}
        </Label>
      </ButtonBase>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-left"
        sx={{ width: 240, p: 0.5 }}
      >
        {WORKSPACES.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === workspace.id}
            onClick={() => handleChangeWorkspace(option)}
            sx={{ height: 48, gap: 1, borderRadius: 1, '& svg': { mr: 0 } }}
          >
            <WorkspaceLogo workspace={option} />

            <Box component="span" sx={{ flexGrow: 1, typography: 'body2' }}>
              {option.name}
            </Box>

            <Label color={option.plan === 'Free' ? 'default' : 'info'}>{option.plan}</Label>
          </MenuItem>
        ))}

        <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />

        <MenuItem
          onClick={popover.onClose}
          sx={{ height: 44, gap: 1, borderRadius: 1, color: 'text.secondary', '& svg': { mr: 0 } }}
        >
          <Iconify icon="mingcute:add-line" width={18} />
          {t('CREATE_WORKSPACE')}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

function WorkspaceLogo({ workspace }: { workspace: Workspace }) {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        flexShrink: 0,
        display: 'flex',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'common.white',
        bgcolor: workspace.color,
      }}
    >
      <Iconify icon={workspace.icon} width={14} />
    </Box>
  );
}

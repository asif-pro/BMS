import { m } from 'framer-motion';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { appLanguages, setSystemLanguage } from '@/configs/i18n.config';
import Iconify from '@/components/iconify';
import { varHover } from '@/components/animate';
import CustomPopover, { usePopover } from '@/components/custom-popover';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const popover = usePopover();

  const { i18n } = useTranslation();

  const currentLang =
    appLanguages.find((lang) => lang.value === i18n.resolvedLanguage) ||
    appLanguages.find((lang) => lang.value === i18n.language) ||
    appLanguages[0];

  const handleChangeLang = useCallback(
    (newLang: string) => {
      setSystemLanguage(newLang);
      popover.onClose();
    },
    [popover]
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Iconify icon={currentLang.icon} sx={{ borderRadius: 0.65, width: 24, height: 24 }} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 180 }}>
        {appLanguages.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 22, height: 22, mr: 1.5 }} />

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

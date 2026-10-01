import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Image from '@/components/image';
import Iconify from '@/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: React.ReactNode;
  file?: string | File | null;
  onDrop: (acceptedFiles: File[]) => void;
};

export default function StaffAvatarUpload({
  error,
  file,
  disabled,
  readOnly,
  helperText,
  onDrop,
}: Props) {
  const { t } = useTranslation('index');
  const inactive = disabled || readOnly;

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    multiple: false,
    disabled: inactive,
    accept: { 'image/*': [] },
    onDrop,
  });

  const hasFile = !!file;
  const hasError = isDragReject || !!error;
  const imgUrl = typeof file === 'string' ? file : file ? URL.createObjectURL(file) : undefined;

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          p: 1,
          m: 'auto',
          width: 144,
          height: 144,
          cursor: inactive ? 'default' : 'pointer',
          overflow: 'hidden',
          borderRadius: '50%',
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
          ...(readOnly && { pointerEvents: 'none' }),
          ...(hasError && { borderColor: 'error.main' }),
          ...(hasFile &&
            !readOnly && {
              '&:hover .upload-placeholder': { opacity: 1 },
            }),
        }}
      >
        <input {...getInputProps()} />

        <Box sx={{ width: 1, height: 1, overflow: 'hidden', borderRadius: '50%', position: 'relative' }}>
          {hasFile && imgUrl && (
            <Image alt="avatar" src={imgUrl} sx={{ width: 1, height: 1, borderRadius: '50%' }} />
          )}

          {!readOnly && (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1}
              className="upload-placeholder"
              sx={{
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                zIndex: 9,
                borderRadius: '50%',
                position: 'absolute',
                color: 'text.disabled',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                transition: (theme) =>
                  theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                '&:hover': { opacity: 0.72 },
                ...(hasError && {
                  color: 'error.main',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                }),
                ...(hasFile && {
                  zIndex: 9,
                  opacity: 0,
                  color: 'common.white',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
                }),
              }}
            >
              <Iconify icon="solar:camera-add-bold" width={32} />
              <Typography variant="caption">{file ? t('UPDATE_PHOTO') : t('UPLOAD_PHOTO')}</Typography>
            </Stack>
          )}
        </Box>
      </Box>

      {helperText}
    </>
  );
}

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const RATIO: Record<string, string> = {
  '4/3': 'calc(100% / 4 * 3)',
  '3/4': 'calc(100% / 3 * 4)',
  '6/4': 'calc(100% / 6 * 4)',
  '4/6': 'calc(100% / 4 * 6)',
  '16/9': 'calc(100% / 16 * 9)',
  '9/16': 'calc(100% / 9 * 16)',
  '1/1': '100%',
};

type ImageProps = {
  alt?: string;
  src?: string;
  ratio?: string;
  sx?: SxProps<Theme>;
};

const Image = forwardRef<HTMLSpanElement, ImageProps>(({ alt, src, ratio, sx }, ref) => (
  <Box
    ref={ref}
    component="span"
    sx={{
      overflow: 'hidden',
      position: 'relative',
      verticalAlign: 'bottom',
      display: 'inline-block',
      lineHeight: 0,
      ...(ratio && {
        width: 1,
        display: 'block',
      }),
      ...sx,
    }}
  >
    {ratio && <Box component="span" sx={{ display: 'block', pt: RATIO[ratio] || '100%' }} />}

    <Box
      component="img"
      alt={alt}
      src={src}
      sx={{
        width: 1,
        height: 1,
        objectFit: 'cover',
        verticalAlign: 'bottom',
        ...(ratio && {
          top: 0,
          left: 0,
          position: 'absolute',
        }),
      }}
    />
  </Box>
));

export default Image;

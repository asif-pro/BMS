import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from '@/routes/components';

// ----------------------------------------------------------------------

export type LogoVariant = 'icon' | 'stacked' | 'full';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  variant?: LogoVariant;
}

const LOGO_SRC: Record<LogoVariant, string> = {
  icon: '/assets/images/logo/ATBL-1.png',
  stacked: '/assets/images/logo/ATBL-2.png',
  full: '/assets/images/logo/ATBL-3.png',
};

const LOGO_SIZE: Record<LogoVariant, { width: number; height: number }> = {
  icon: { width: 56, height: 56 },
  stacked: { width: 140, height: 140 },
  full: { width: 180, height: 56 },
};

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, variant = 'full', sx, ...other }, ref) => {
    const size = LOGO_SIZE[variant];

    const logo = (
      <Box
        ref={ref}
        component="img"
        src={LOGO_SRC[variant]}
        alt="Air Travel"
        sx={{
          width: size.width,
          height: size.height,
          display: 'inline-block',
          objectFit: 'contain',
          ...sx,
        }}
        {...other}
      />
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;

import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';
import { alpha, type Theme } from '@mui/material/styles';

export function table(theme: Theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          position: 'relative',
          zIndex: 1,
          boxShadow: `0 1px 0 0 ${alpha(theme.palette.grey[500], 0.16)}, 0 4px 12px -4px ${alpha(
            theme.palette.grey[500],
            0.2
          )}`,
          [`& .${tableCellClasses.head}`]: {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          lineHeight: '54px',
          [`&.${tableRowClasses.selected}`]: {
            backgroundColor: alpha(theme.palette.primary.dark, 0.04),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.dark, 0.08),
            },
          },
          '&:last-of-type': {
            [`& .${tableCellClasses.root}`]: {
              borderColor: 'transparent',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          minHeight: '54px',
          lineHeight: '1',
          borderBottomStyle: 'solid',
          borderColor: theme.palette.grey[300],
          whiteSpace: 'nowrap',
          height: '54px',
          maxWidth: '240px',
          paddingTop: '8px',
          paddingBottom: '8px',
        },
        head: {
          fontSize: 14,
          color: theme.palette.text.primary,
          fontWeight: theme.typography.fontWeightSemiBold,
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          '& .MuiTableSortLabel-root': {
            color: 'inherit',
            '&:hover': {
              color: theme.palette.text.primary,
            },
            '&.Mui-active': {
              color: theme.palette.text.primary,
              '& .MuiTableSortLabel-icon': {
                color: `${theme.palette.text.primary} !important`,
              },
            },
          },
        },
        stickyHeader: {
          backgroundColor:
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          backgroundImage: 'none',
        },
        paddingCheckbox: {
          paddingLeft: theme.spacing(1),
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          width: '100%',
        },
        toolbar: {
          height: 56,
        },
        actions: {
          marginRight: 8,
        },
        select: {
          paddingLeft: 8,
          '&:focus': {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          right: 4,
          width: 16,
          height: 16,
          top: 'calc(50% - 8px)',
        },
      },
    },
  };
}

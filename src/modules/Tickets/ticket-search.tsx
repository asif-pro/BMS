import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';

import { useRouter } from '@/routes/hooks';

import Iconify from '@/components/iconify';
import SearchNotFound from '@/components/search-not-found';
import { match, parse } from '@/utils/highlight-match';

import type { TicketItem } from './types';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: TicketItem[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function TicketSearch({ query, results, onSearch, hrefItem }: Props) {
  const { t } = useTranslation('index');
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(hrefItem(id));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query && event.key === 'Enter') {
      const selected = results.find((ticket) => ticket.name === query);

      if (selected) {
        handleClick(selected.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 520 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('SEARCH_PLACEHOLDER')}
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, ticket, { inputValue }) => {
        const matches = match(ticket.name, inputValue);
        const parts = parse(ticket.name, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(ticket.id)} key={ticket.id}>
            <Avatar
              alt={ticket.name}
              src={ticket.images[0]}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div>
              {parts.map((part, index) => (
                <Typography
                  key={`${part.text}-${index}`}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}

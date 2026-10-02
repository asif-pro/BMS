import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next';

import Iconify from '@/components/iconify';
import SearchNotFound from '@/components/search-not-found';
import { match, parse } from '@/utils/highlight-match';

import type { IOrganizationItem } from '@/interfaces/organization.interface';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: IOrganizationItem[];
  onSearch: (inputValue: string) => void;
  onSelect: (id: string) => void;
};

export default function OrganizationSearch({ query, results, onSearch, onSelect }: Props) {
  const { t } = useTranslation('index');

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query && event.key === 'Enter') {
      const selected = results.find((item) => item.title === query);
      if (selected) {
        onSelect(selected.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 420, md: 520 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(_event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
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
      renderOption={(props, organization, { inputValue }) => {
        const matches = match(organization.title, inputValue);
        const parts = parse(organization.title, matches);

        return (
          <Box
            component="li"
            {...props}
            onClick={() => onSelect(organization.id)}
            key={organization.id}
          >
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
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

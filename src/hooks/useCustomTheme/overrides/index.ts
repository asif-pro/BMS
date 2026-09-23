import { type Theme } from '@mui/material/styles';
import merge from 'lodash/merge';
import { backdrop } from './components/backdrop';
import { breadcrumbs } from './components/breadcrumbs';
import { button } from './components/button';
import { card } from './components/card';
import { table } from './components/table';
import { tabs } from './components/tabs';
import { textField } from './components/textfield';
import { typography } from './components/typography';
import { defaultProps } from './default-props';
import { dialog } from './components/dialog';
import { checkbox } from './components/checkbox';
import { autocomplete } from './components/autoComplete';
import { stepper } from './components/stepper';
import { switches } from './components/switch';

const componentsOverrides = (theme: Theme) => {
  const components = merge(
    defaultProps(theme),
    autocomplete(theme),
    breadcrumbs(theme),
    typography(theme),
    textField(theme),
    backdrop(theme),
    checkbox(theme),
    switches(theme),
    stepper(theme),
    dialog(theme),
    button(theme),
    table(theme),
    tabs(theme),
    card(theme)
  );

  return components;
};
export default componentsOverrides;

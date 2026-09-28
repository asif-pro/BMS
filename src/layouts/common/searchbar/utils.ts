import { flattenArray } from '@/utils/flatten-array';
import { NavProps, NavItemBaseProps } from '@/components/nav-section';

// ----------------------------------------------------------------------

type ItemProps = {
  group: string;
  title: string;
  path: string;
};

export function getAllItems({ data }: NavProps) {
  const reduceItems = data.map((list) => handleLoop(list.items, list.subheader)).flat();

  const items = flattenArray(reduceItems).map((option) => {
    const group = splitPath(reduceItems, option.path);

    return {
      group: group && group.length > 1 ? group[0] : option.subheader || 'Pages',
      title: option.title,
      path: option.path,
    };
  });

  return items;
}

// ----------------------------------------------------------------------

type FilterProps = {
  inputData: ItemProps[];
  query: string;
};

export function applyFilter({ inputData, query }: FilterProps) {
  if (query) {
    return inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function splitPath(array: NavItemBaseProps[], key: string) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const popped = stack.pop();
    if (!popped) break;
    const { path, currItem } = popped;

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item: NavItemBaseProps) => ({
          path: path.concat(item.title),
          currItem: item,
        }))
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function handleLoop(array: NavItemBaseProps[], subheader?: string): NavItemBaseProps[] {
  return (
    array?.map((list) => ({
      subheader,
      ...list,
      ...(list.children && {
        children: handleLoop(list.children, subheader),
      }),
    })) || []
  );
}

// ----------------------------------------------------------------------

type GroupsProps = {
  [key: string]: ItemProps[];
};

export function groupedData(array: ItemProps[]) {
  const group = array.reduce<GroupsProps>((acc, item) => {
    const current = acc[item.group] || [];
    return {
      ...acc,
      [item.group]: [...current, item],
    };
  }, {});

  return group;
}

// ----------------------------------------------------------------------

type OrderProps = {
  [key: string]: number;
};

export function orderData(array: GroupsProps) {
  return Object.keys(array).reduce<OrderProps>((acc, key) => {
    return {
      ...acc,
      [key]: array[key].length,
    };
  }, {});
}

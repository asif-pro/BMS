// ----------------------------------------------------------------------

export function flattenArray<T extends Record<string, unknown>>(list: T[], key = 'children'): T[] {
  let children: T[] = [];

  const flatten = list?.map((item) => {
    const itemChildren = item[key];
    if (Array.isArray(itemChildren) && itemChildren.length) {
      children = [...children, ...itemChildren];
    }
    return item;
  });

  return flatten?.concat(children.length ? flattenArray(children, key) : children);
}

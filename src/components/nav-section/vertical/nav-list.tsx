import { useState, useEffect, useCallback } from 'react';
import { matchPath } from 'react-router-dom';

import Collapse from '@mui/material/Collapse';

import { usePathname } from '@/routes/hooks';
import { useActiveLink } from '@/routes/hooks/use-active-link';

import NavItem from './nav-item';
import { NavItemBaseProps, NavListProps, NavSubListProps } from '../types';

// ----------------------------------------------------------------------

function hasActiveChild(children: NavItemBaseProps[] | undefined, pathname: string): boolean {
  if (!children?.length) {
    return false;
  }

  return children.some((child) => {
    const exact = child.path ? !!matchPath({ path: child.path, end: true }, pathname) : false;
    const deep = child.path ? !!matchPath({ path: child.path, end: false }, pathname) : false;

    return exact || deep || hasActiveChild(child.children, pathname);
  });
}

export default function NavList({ data, depth, slotProps }: NavListProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children) || hasActiveChild(data.children, pathname);

  const [openMenu, setOpenMenu] = useState(active);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  useEffect(() => {
    // Sync expand/collapse to the active route after navigation only.
    // Do not depend on openMenu — that immediately collapses a just-opened item.
    setOpenMenu(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <NavItem
        open={openMenu}
        onClick={handleToggleMenu}
        //
        title={data.title}
        path={data.path}
        icon={data.icon}
        info={data.info}
        roles={data.roles}
        caption={data.caption}
        disabled={data.disabled}
        //
        depth={depth}
        hasChild={!!data.children}
        externalLink={data.path.includes('http')}
        currentRole={slotProps?.currentRole}
        //
        active={active}
        className={active ? 'active' : ''}
        sx={{
          mb: `${slotProps?.gap}px`,
          ...(depth === 1 ? slotProps?.rootItem : slotProps?.subItem),
        }}
      />

      {!!data.children && (
        <Collapse in={openMenu} unmountOnExit>
          <NavSubList data={data.children} depth={depth} slotProps={slotProps} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, depth, slotProps }: NavSubListProps) {
  return (
    <>
      {data.map((list) => (
        <NavList key={list.title} data={list} depth={depth + 1} slotProps={slotProps} />
      ))}
    </>
  );
}

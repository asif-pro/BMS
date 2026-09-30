import { useState, useEffect, useCallback } from 'react';

import Collapse from '@mui/material/Collapse';

import { usePathname } from '@/routes/hooks';
import { useActiveLink } from '@/routes/hooks/use-active-link';

import NavItem from './nav-item';
import { NavListProps, NavSubListProps } from '../types';

// ----------------------------------------------------------------------

export default function NavList({ data, depth, slotProps }: NavListProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

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

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { renderRootProvider } from '@/components/RootProviderTest/RootProviderTest';

describe('Profile', () => {
  it('does not render modal when open is false', () => {
    renderRootProvider(<Profile open={false} setOpen={() => {}} />);

    const modal = screen.queryByRole('dialog');
    expect(modal).not.toBeInTheDocument();
  });

  it('calls setOpen to close the modal when the close button is clicked', async () => {
    const setOpen = vi.fn();
    renderRootProvider(<Profile open={true} setOpen={setOpen} />);

    await waitFor(() => screen.getByRole('button'));

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('switches from profileDetails to editPassword view when edit password is clicked', async () => {
    renderRootProvider(<Profile open={true} setOpen={() => {}} />);

    await waitFor(() => screen.getByText('SALUTATION'));

    const editPasswordIcon = screen.getByTestId('ModeEditOutlineIcon');
    expect(editPasswordIcon).toBeInTheDocument();

    fireEvent.click(editPasswordIcon);

    await waitFor(() => screen.getByText('UPDATE'));
  });
});

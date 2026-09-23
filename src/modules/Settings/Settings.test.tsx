import { describe, it, expect, vi } from 'vitest';
import Settings from './Settings';
import { renderRootProvider } from '@/components/RootProviderTest/RootProviderTest';
import { screen } from '@testing-library/react';

vi.mock('./components/UploadLogo/UploadLogo', () => ({
  default: () => <div data-testid="upload-logo" />,
}));
vi.mock('./components/OrderProcessing/OrderProcessing', () => ({
  default: () => <div data-testid="order-processing" />,
}));
vi.mock('./components/CommunicationSettings/CommunicationSettings', () => ({
  default: () => <div data-testid="communication-settings" />,
}));
vi.mock('./components/CommunicationSettingsTable/CommunicationSettingsTable', () => ({
  default: () => <div data-testid="communication-settings-table" />,
}));

describe('Settings', () => {
  it('renders Settings heading and child components', () => {
    renderRootProvider(<Settings />);

    expect(screen.getByText('SETTINGS')).toBeInTheDocument();
    expect(screen.getByTestId('communication-settings')).toBeInTheDocument();
    expect(screen.getByTestId('communication-settings-table')).toBeInTheDocument();
    expect(screen.getByTestId('order-processing')).toBeInTheDocument();
    expect(screen.getByTestId('upload-logo')).toBeInTheDocument();
    expect(
      screen.getByText('COMMUNICATION_SETTINGS_FOR_UNASSIGNED_PROPERTIES')
    ).toBeInTheDocument();
    expect(screen.getByText('FOR_ALL_PROPERTIES_THAT_ARE...')).toBeInTheDocument();
  });
});

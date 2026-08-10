import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TabBar } from './TabBar';
import { type TabItemData } from './TabItem';

const sampleTabs: TabItemData[] = [
  { id: 'tab-1', title: 'Main.hx', icon: 'file-code', isDirty: false },
  { id: 'tab-2', title: 'Player.block', icon: 'block', isDirty: true },
];

describe('TabBar & TabItem Component Suite', () => {
  it('should render tab items and handle selection', () => {
    const handleSelect = vi.fn();
    render(<TabBar tabs={sampleTabs} activeTabId="tab-1" onTabSelect={handleSelect} />);

    expect(screen.getByText('Main.hx')).toBeInTheDocument();
    expect(screen.getByText('Player.block')).toBeInTheDocument();

    const secondTab = screen.getByText('Player.block');
    fireEvent.click(secondTab);

    expect(handleSelect).toHaveBeenCalledWith('tab-2');
  });

  it('should render dirty unsaved dot when isDirty is true', () => {
    render(<TabBar tabs={sampleTabs} activeTabId="tab-1" onTabSelect={() => {}} />);
    expect(screen.getByTestId('tab-dirty-dot')).toBeInTheDocument();
  });

  it('should fire onTabClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <TabBar
        tabs={sampleTabs}
        activeTabId="tab-1"
        onTabSelect={() => {}}
        onTabClose={handleClose}
      />
    );

    const closeBtn = screen.getByLabelText('Close tab Main.hx');
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledWith('tab-1');
  });

  it('should fire onNewTab when plus button is clicked', () => {
    const handleNewTab = vi.fn();
    render(
      <TabBar
        tabs={sampleTabs}
        activeTabId="tab-1"
        onTabSelect={() => {}}
        onNewTab={handleNewTab}
      />
    );

    const plusBtn = screen.getByLabelText('New tab');
    fireEvent.click(plusBtn);

    expect(handleNewTab).toHaveBeenCalledTimes(1);
  });
});

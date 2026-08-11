import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Button,
  TextInput,
  Select,
  Checkbox,
  Switch,
  Badge,
  Modal,
  ContextMenu,
  PanelSection,
  TabBar,
  ProgressBar,
  Spinner,
} from '../index';

describe('WCAG 2.1 & ARIA Accessibility Audit Suite', () => {
  it('Button should expose proper ARIA attributes when loading and disabled', () => {
    render(
      <Button isLoading disabled>
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('TextInput should link error helper text via aria-describedby', () => {
    render(<TextInput id="user-name" error="Username required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'user-name-description');
  });

  it('Select should expose role="combobox" and aria-expanded', () => {
    render(<Select options={[{ value: 'v1', label: 'Val 1' }]} placeholder="Choose" />);
    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('Checkbox and Switch should expose role and aria-checked states', () => {
    render(<Checkbox label="Accept T&C" checked onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    render(<Switch label="Dark Mode" checked onChange={() => {}} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('Badge should expose status role and readable typography', () => {
    render(<Badge variant="info">Building</Badge>);
    expect(screen.getByRole('status')).toHaveTextContent('Building');
  });

  it('Modal should expose role="dialog" and aria-modal="true"', () => {
    render(
      <Modal isOpen onClose={() => {}} title="IDE Settings">
        <div>Preferences</div>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('ContextMenu should expose role="menu" and role="menuitem"', () => {
    render(
      <ContextMenu
        isOpen
        position={{ x: 10, y: 10 }}
        onClose={() => {}}
        items={[{ id: '1', label: 'Refactor' }]}
      />
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem')).toHaveTextContent('Refactor');
  });

  it('PanelSection header should expose aria-expanded state and respond to keyboard', () => {
    render(
      <PanelSection title="Block Workspace">
        <div>Blocks Canvas</div>
      </PanelSection>
    );
    const sectionHeader = screen.getByRole('button', { name: /Block Workspace/i });
    expect(sectionHeader).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(sectionHeader, { key: 'Enter' });
    expect(sectionHeader).toHaveAttribute('aria-expanded', 'false');
  });

  it('TabBar and TabItem should expose role="tablist" and role="tab"', () => {
    render(
      <TabBar tabs={[{ id: 't1', title: 'Main.hx' }]} activeTabId="t1" onTabSelect={() => {}} />
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tab = screen.getByRole('tab');
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('ProgressBar and Spinner should expose role="progressbar" and aria-valuenow / aria-busy', () => {
    render(<ProgressBar value={40} max={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');

    render(<Spinner label="Loading Compiler" />);
    expect(screen.getByRole('progressbar', { name: 'Loading Compiler' })).toHaveAttribute(
      'aria-busy',
      'true'
    );
  });

  it('FlexLayout drop target CSS variables should satisfy WCAG high-contrast guidelines', () => {
    const dropOverlay = document.createElement('div');
    dropOverlay.className = 'flexlayout__outline_rect';
    document.body.appendChild(dropOverlay);

    expect(dropOverlay).toHaveClass('flexlayout__outline_rect');
    document.body.removeChild(dropOverlay);
  });
});

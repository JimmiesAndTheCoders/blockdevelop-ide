import React, { useState } from 'react';
import { IDE_METADATA, useLayoutStore, useUIStore } from '@blockdevelop/core';
import { BlocklyCanvas } from '@blockdevelop/block-engine';
import {
  PanelHeader,
  PanelSection,
  Button,
  SearchInput,
  Select,
  Switch,
  Badge,
  Kbd,
  ProgressBar,
  Spinner,
  Tooltip,
  ContextMenu,
  useContextMenu,
  useTheme,
  useKeyboardShortcuts,
  type UITheme,
  type TabItemData,
  TabBar,
  LAYOUT_PRESETS,
  LayoutModelFactory,
  LayoutPersistenceManager,
  type LayoutPresetType,
  type LayoutPresetMetadata,
} from '@blockdevelop/ui';

export const App: React.FC = () => {
  // Mount global keyboard navigation shortcuts (Ctrl+B, Ctrl+`, Ctrl+Shift+E, Ctrl+W)
  useKeyboardShortcuts();

  const { theme, setTheme } = useTheme();
  const [targetPlatform, setTargetPlatform] = useState('html5');
  const [activePreset, setActivePreset] = useState<LayoutPresetType>('default');
  const [isBuilding, setIsBuilding] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [tabs, setTabs] = useState<TabItemData[]>([
    { id: 'tab-1', title: 'Main.block', icon: 'block', isDirty: false },
    { id: 'tab-2', title: 'Player.block', icon: 'block', isDirty: true },
  ]);

  const { isOpen, position, handleContextMenu, closeContextMenu } = useContextMenu();

  const handleBuild = () => {
    setIsBuilding(true);
    setTimeout(() => setIsBuilding(false), 2000);
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTab === tabId) {
      const remaining = tabs.filter((t) => t.id !== tabId);
      setActiveTab(remaining[0]?.id || '');
    }
  };

  const handlePresetChange = (presetKey: string) => {
    const key = presetKey as LayoutPresetType;
    setActivePreset(key);

    const presetJson = LayoutModelFactory.createPresetJson(key);
    type LoadLayoutParam = Parameters<ReturnType<typeof useLayoutStore.getState>['loadLayout']>[0];
    useLayoutStore.getState().loadLayout(presetJson as unknown as LoadLayoutParam);
  };

  const handleResetLayout = () => {
    LayoutPersistenceManager.clearSavedLayout();
    const defaultJson = LayoutModelFactory.createDefaultJson();
    type ResetLayoutParam = Parameters<ReturnType<typeof useLayoutStore.getState>['resetLayout']>[0];
    useLayoutStore.getState().resetLayout(defaultJson as unknown as ResetLayoutParam);
    setActivePreset('default');
    useUIStore.getState().setStatusMessage('Workspace window layout reset to default.');
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className="flex flex-col h-screen bg-workspace-dark text-gray-200 font-sans overflow-hidden select-none"
    >
      {/* Top Application Header */}
      <PanelHeader
        title={IDE_METADATA.NAME}
        icon="box"
        badge={<Badge variant="haxe">v{IDE_METADATA.VERSION}</Badge>}
        actions={
          <div className="flex items-center gap-2">
            {/* Workspace Layout Preset Switcher */}
            <Select
              size="xs"
              value={activePreset}
              onChange={handlePresetChange}
              leftIcon="layers"
              options={(Object.values(LAYOUT_PRESETS) as LayoutPresetMetadata[]).map(
                (preset: LayoutPresetMetadata) => ({
                  value: preset.id,
                  label: preset.name,
                  description: preset.description,
                  icon: preset.icon,
                })
              )}
              className="w-44"
            />

            {/* Reset Window Layout Quick Button */}
            <Tooltip content="Reset Window Layout">
              <Button
                variant="ghost"
                size="xs"
                leftIcon="refresh"
                onClick={handleResetLayout}
                aria-label="Reset Window Layout"
              />
            </Tooltip>

            {/* UI Theme Switcher */}
            <Select
              size="xs"
              value={theme}
              onChange={(val) => setTheme(val as UITheme)}
              options={[
                { value: 'dark', label: 'Dark Theme' },
                { value: 'light', label: 'Light Theme' },
                { value: 'high-contrast', label: 'High Contrast' },
                { value: 'system', label: 'System Theme' },
              ]}
              className="w-36"
            />

            <Tooltip content="Quick Command Palette" shortcut="Ctrl+Shift+P">
              <Kbd shortcut="Ctrl+P" />
            </Tooltip>
          </div>
        }
      />

      {/* Editor Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTab}
        onTabSelect={setActiveTab}
        onTabClose={handleTabClose}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="platform" size="xs">
              {targetPlatform.toUpperCase()}
            </Badge>
            <Button
              variant="accent"
              size="xs"
              leftIcon="play"
              isLoading={isBuilding}
              onClick={handleBuild}
            >
              Compile & Run
            </Button>
          </div>
        }
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex p-2 gap-2 overflow-hidden">
        {/* Sidebar Panel */}
        <aside className="w-64 bg-workspace-panel border border-workspace-border rounded-lg flex flex-col shrink-0 shadow-lg overflow-y-auto">
          <PanelHeader title="Project Explorer" icon="folder" />

          <PanelSection title="Target Platform" icon="globe">
            <Select
              size="sm"
              value={targetPlatform}
              onChange={setTargetPlatform}
              options={[
                { value: 'html5', label: 'HTML5 Web App' },
                { value: 'node', label: 'Node.js Server' },
                { value: 'python', label: 'Python Engine' },
                { value: 'haxe', label: 'Haxe Compiler' },
                { value: 'cpp', label: 'C++ Native' },
                { value: 'arduino', label: 'Arduino Board' },
              ]}
            />
          </PanelSection>

          <PanelSection title="Editor Preferences" icon="settings">
            <div className="space-y-3 pt-1">
              <Switch
                label="Auto-Save Files"
                description="Automatically save unsaved tabs"
                checked={autoSave}
                onChange={setAutoSave}
              />
              <SearchInput size="sm" placeholder="Search preferences..." />
            </div>
          </PanelSection>

          <PanelSection title="Build Status" icon="cpu">
            <div className="space-y-2">
              <ProgressBar
                value={isBuilding ? undefined : 100}
                variant={isBuilding ? 'haxe' : 'success'}
                size="sm"
                label={isBuilding ? 'Compiling Haxe code...' : 'Build Ready'}
                showPercentage={!isBuilding}
              />
              {isBuilding && (
                <div className="flex items-center gap-2 text-2xs text-brand-haxeOrange font-mono pt-1">
                  <Spinner size="xs" variant="haxe" /> Executing compiler...
                </div>
              )}
            </div>
          </PanelSection>
        </aside>

        {/* Central Workspace - Interactive Blockly Canvas */}
        <section className="flex-1 bg-workspace-panel border border-workspace-border rounded-lg shadow-xl relative overflow-hidden flex flex-col">
          <BlocklyCanvas
            fileId={activeTab}
            showZoomControls={true}
            showMinimap={true}
            showGridControls={true}
            className="w-full h-full relative"
          />
        </section>
      </main>

      {/* Right-Click Context Menu */}
      <ContextMenu
        isOpen={isOpen}
        position={position}
        onClose={closeContextMenu}
        items={[
          { id: 'run', label: 'Compile & Run', icon: 'play', shortcut: 'F5', onClick: handleBuild },
          { id: 'div-1', divider: true },
          { id: 'copy', label: 'Copy Block', icon: 'copy', shortcut: 'Ctrl+C' },
          { id: 'paste', label: 'Paste Block', icon: 'copy', shortcut: 'Ctrl+V', disabled: true },
          { id: 'div-2', divider: true },
          { id: 'reset-layout', label: 'Reset Window Layout', icon: 'refresh', onClick: handleResetLayout },
          { id: 'div-3', divider: true },
          { id: 'delete', label: 'Delete Selected', icon: 'trash', danger: true },
        ]}
      />
    </div>
  );
};

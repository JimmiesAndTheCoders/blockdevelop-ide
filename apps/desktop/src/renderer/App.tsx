import React, { useState } from 'react';
import { IDE_METADATA } from '@blockdevelop/core';
import { initializeBlockEngine } from '@blockdevelop/block-engine';
import { getGeneratorVersion } from '@blockdevelop/code-gen';
import {
  PanelHeader,
  PanelSection,
  Button,
  TextInput,
  SearchInput,
  Select,
  Switch,
  Badge,
  Tag,
  Kbd,
  ProgressBar,
  Spinner,
  Tooltip,
  ContextMenu,
  useContextMenu,
  useTheme,
  type UITheme,
  type TabItemData,
  TabBar,
} from '@blockdevelop/ui';

export const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [targetPlatform, setTargetPlatform] = useState('html5');
  const [isBuilding, setIsBuilding] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [activeTab, setActiveTab] = useState('tab-1');

  const { isOpen, position, handleContextMenu, closeContextMenu } = useContextMenu();

  const sampleTabs: TabItemData[] = [
    { id: 'tab-1', title: 'Main.hx', icon: 'file-code', isDirty: false },
    { id: 'tab-2', title: 'Player.block', icon: 'block', isDirty: true },
  ];

  const handleBuild = () => {
    setIsBuilding(true);
    setTimeout(() => setIsBuilding(false), 2000);
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
        tabs={sampleTabs}
        activeTabId={activeTab}
        onTabSelect={setActiveTab}
        actions={
          <Badge variant="platform" size="xs">
            {targetPlatform.toUpperCase()}
          </Badge>
        }
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 flex p-4 gap-4 overflow-auto">
        {/* Sidebar Panel */}
        <aside className="w-72 bg-workspace-panel border border-workspace-border rounded-lg flex flex-col shrink-0 shadow-lg">
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
                  <Spinner size="xs" variant="haxe" /> Executing Haxe compiler pipeline...
                </div>
              )}
            </div>
          </PanelSection>
        </aside>

        {/* Central Workspace Canvas */}
        <section className="flex-1 bg-workspace-panel border border-workspace-border rounded-lg p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                <Tag variant="brand">Phase 2: Design System Active</Tag>
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon="play"
                  isLoading={isBuilding}
                  onClick={handleBuild}
                >
                  Compile & Run
                </Button>
              </div>
            </div>

            <p className="text-gray-400 text-xs mb-6">
              Right-click anywhere on the workspace canvas to trigger the custom IDE Context Menu.
            </p>

            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border text-emerald-400">
                ✓ {initializeBlockEngine()}
              </div>
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border text-amber-400">
                ✓ {getGeneratorVersion()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TextInput size="sm" defaultValue="main.hx" variant="code" className="max-w-xs" />
              <Tooltip content="Save Document" shortcut="Ctrl+S">
                <Button variant="secondary" size="sm" leftIcon="file-code">
                  Save
                </Button>
              </Tooltip>
            </div>
          </div>
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
          { id: 'delete', label: 'Delete Selected', icon: 'trash', danger: true },
        ]}
      />
    </div>
  );
};

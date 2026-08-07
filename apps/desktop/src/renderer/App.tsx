import React, { useEffect, useState } from 'react';
import { IDE_METADATA } from '@blockdevelop/core';
import { initializeBlockEngine } from '@blockdevelop/block-engine';
import { getGeneratorVersion } from '@blockdevelop/code-gen';
import { Box, Code, Cpu, FileCode, FolderOpen, Terminal } from 'lucide-react';

export const App: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<{
    appVersion: string;
    electronVersion: string;
    nodeVersion: string;
  } | null>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [processLog, setProcessLog] = useState<string[]>([]);

  useEffect(() => {
    if (window.blockDevelopAPI?.system) {
      window.blockDevelopAPI.system.getSystemInfo().then(setSystemInfo);
    }
  }, []);

  const handleOpenFile = async () => {
    if (!window.blockDevelopAPI?.dialog) {
      console.warn('IPC Dialog API not available yet');
      return;
    }
    const file = await window.blockDevelopAPI.dialog.openFile({
      title: 'Select a Block Project File',
      filters: [{ name: 'BlockDevelop Projects', extensions: ['blockproj', 'json'] }],
    });
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleTestProcess = async () => {
    if (!window.blockDevelopAPI?.process) {
      console.warn('IPC Process API not available yet');
      return;
    }
    setProcessLog((prev) => [...prev, 'Spawning test ping process...']);
    const pid = await window.blockDevelopAPI.process.spawn({
      command: 'node',
      args: ['-v'],
    });

    if (pid) {
      window.blockDevelopAPI.process.onData((event) => {
        setProcessLog((prev) => [...prev, `[PID ${event.pid}] ${event.type}: ${event.data}`]);
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-workspace-dark text-gray-200">
      <header className="h-10 bg-workspace-header border-b border-workspace-border flex items-center px-4 justify-between">
        <div className="flex items-center space-x-2 font-bold text-workspace-accent">
          <Box className="w-5 h-5 text-workspace-accent" />
          <span>{IDE_METADATA.NAME}</span>
          <span className="text-xs text-gray-400 font-normal">v{IDE_METADATA.VERSION}</span>
        </div>
        <div className="text-xs text-gray-400">Phase 0.4: Safe IPC Bridge Engaged</div>
      </header>

      <main className="flex-1 flex p-6 gap-6 overflow-auto">
        <div className="flex-1 bg-workspace-panel border border-workspace-border rounded-lg p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
              <Cpu className="text-workspace-accent" /> Visual Block Develop IDE
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Inspired by FlashDevelop & HaxeDevelop — Safe IPC Bridges Activated (`fs`, `dialog`, `process`, `system`).
            </p>

            <div className="space-y-3 font-mono text-sm mb-6">
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-400" />
                <span className="text-gray-300">{initializeBlockEngine()}</span>
              </div>
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                <span className="text-gray-300">{getGeneratorVersion()}</span>
              </div>
            </div>

            {/* Test Interactive IPC API Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleOpenFile}
                className="px-4 py-2 bg-workspace-accent hover:bg-workspace-accentHover text-white text-xs font-semibold rounded flex items-center gap-2 transition"
              >
                <FolderOpen className="w-4 h-4" /> Test Native Dialog (`dialog.openFile`)
              </button>
              <button
                onClick={handleTestProcess}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded flex items-center gap-2 transition"
              >
                <Terminal className="w-4 h-4 text-emerald-400" /> Test Process Spawn (`process.spawn`)
              </button>
            </div>

            {selectedFile && (
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border text-xs font-mono text-cyan-400 mb-4 flex items-center gap-2">
                <FileCode className="w-4 h-4" /> Selected File: {selectedFile}
              </div>
            )}

            {processLog.length > 0 && (
              <div className="p-3 bg-workspace-dark rounded border border-workspace-border text-xs font-mono text-gray-300 max-h-32 overflow-y-auto space-y-1">
                {processLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>

          {systemInfo && (
            <div className="border-t border-workspace-border pt-4 flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-workspace-accent" /> Electron v{systemInfo.electronVersion}
              </span>
              <span>Node v{systemInfo.nodeVersion}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

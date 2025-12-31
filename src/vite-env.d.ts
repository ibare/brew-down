/// <reference types="vite/client" />

interface FileData {
  filePath: string
  content: string
  fileName: string
}

interface ElectronAPI {
  openFileDialog: () => Promise<FileData | null>
  readFile: (filePath: string) => Promise<FileData | null>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}

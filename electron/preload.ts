import { contextBridge, ipcRenderer } from 'electron'

export interface FileData {
  filePath: string
  content: string
  fileName: string
}

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: (): Promise<FileData | null> =>
    ipcRenderer.invoke('open-file-dialog'),
  readFile: (filePath: string): Promise<FileData | null> =>
    ipcRenderer.invoke('read-file', filePath),
})

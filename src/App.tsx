import { useState, useCallback } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FileState {
  content: string
  fileName: string
  filePath: string
}

function App() {
  const [file, setFile] = useState<FileState | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleOpenFile = useCallback(async () => {
    const result = await window.electronAPI.openFileDialog()
    if (result) {
      setFile(result)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const filePath = (droppedFile as unknown as { path: string }).path
      if (filePath) {
        const result = await window.electronAPI.readFile(filePath)
        if (result) {
          setFile(result)
        }
      }
    }
  }, [])

  if (!file) {
    return (
      <div
        className={`empty-state ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="empty-content">
          <div className="icon">📄</div>
          <h1>Brew Down</h1>
          <p>마크다운 파일을 열어보세요</p>
          <button onClick={handleOpenFile}>파일 열기</button>
          <span className="hint">또는 파일을 여기에 드래그하세요</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="viewer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="titlebar">
        <span className="filename">{file.fileName}</span>
        <button className="open-btn" onClick={handleOpenFile}>
          열기
        </button>
      </header>
      <main className={`content ${isDragging ? 'dragging' : ''}`}>
        <article className="markdown-body">
          <Markdown remarkPlugins={[remarkGfm]}>
            {file.content}
          </Markdown>
        </article>
      </main>
    </div>
  )
}

export default App

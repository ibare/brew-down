import { useState, useCallback } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FileState {
  content: string
  fileName: string
  filePath: string
}

function App() {
  const [tabs, setTabs] = useState<FileState[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const activeFile = tabs[activeTabIndex] || null

  const addOrSelectTab = useCallback((newFile: FileState) => {
    setTabs(prevTabs => {
      const existingIndex = prevTabs.findIndex(t => t.filePath === newFile.filePath)
      if (existingIndex >= 0) {
        setActiveTabIndex(existingIndex)
        return prevTabs
      }
      setActiveTabIndex(prevTabs.length)
      return [...prevTabs, newFile]
    })
  }, [])

  const handleOpenFile = useCallback(async () => {
    const result = await window.electronAPI.openFileDialog()
    if (result) {
      addOrSelectTab(result)
    }
  }, [addOrSelectTab])

  const handleRefresh = useCallback(async () => {
    if (activeFile?.filePath) {
      const result = await window.electronAPI.readFile(activeFile.filePath)
      if (result) {
        setTabs(prevTabs =>
          prevTabs.map((tab, i) => i === activeTabIndex ? result : tab)
        )
      }
    }
  }, [activeFile?.filePath, activeTabIndex])

  const handleCloseTab = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setTabs(prevTabs => prevTabs.filter((_, i) => i !== index))
    setActiveTabIndex(prev => {
      if (index < prev) return prev - 1
      if (index === prev && prev > 0) return prev - 1
      return 0
    })
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
          addOrSelectTab(result)
        }
      }
    }
  }, [addOrSelectTab])

  if (tabs.length === 0) {
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
        <div className="tabs">
          {tabs.map((tab, index) => (
            <div
              key={tab.filePath}
              className={`tab ${index === activeTabIndex ? 'active' : ''}`}
              onClick={() => setActiveTabIndex(index)}
            >
              <span className="tab-name">{tab.fileName}</span>
              <button
                className="tab-close"
                onClick={(e) => handleCloseTab(index, e)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="titlebar-buttons">
          <button className="refresh-btn" onClick={handleRefresh}>
            새로고침
          </button>
          <button className="open-btn" onClick={handleOpenFile}>
            열기
          </button>
        </div>
      </header>
      <main className={`content ${isDragging ? 'dragging' : ''}`}>
        {activeFile && (
          <article className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>
              {activeFile.content}
            </Markdown>
          </article>
        )}
      </main>
    </div>
  )
}

export default App

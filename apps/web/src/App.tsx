import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { EditorPage } from './pages/editor/EditorPage'
import { ImageEditorPage } from './pages/image-editor/ImageEditorPage'
import { LivePage } from './pages/live/LivePage'
import { HomePage } from './pages/home/HomePage'

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:id?" element={<EditorPage />} />
        <Route path="/image-editor/:id?" element={<ImageEditorPage />} />
        <Route path="/live/:id?" element={<LivePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

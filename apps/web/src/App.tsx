import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { EditorPage } from './pages/editor/EditorPage'
import { ImageEditorPage } from './pages/image-editor/ImageEditorPage'
import { PreviewPage } from './pages/preview/PreviewPage'
import { HomePage } from './pages/home/HomePage'

export default function App() {
  return (
    <Routes>
      {/* Preview has its own minimal layout */}
      <Route path="/preview/:shareId" element={<PreviewPage />} />
      {/* Everything else uses AppLayout */}
      <Route path="/*" element={
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor/:id?" element={<EditorPage />} />
            <Route path="/image-editor/:id?" element={<ImageEditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      } />
    </Routes>
  )
}

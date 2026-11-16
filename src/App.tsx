import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Site from './site/Site'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Eski "Studio OS" masaüstü sürümü, geri dönüş için saklanıyor. */}
        <Route path="/masaustu" element={<HomePage />} />
        <Route path="*" element={<Site />} />
      </Routes>
    </BrowserRouter>
  )
}

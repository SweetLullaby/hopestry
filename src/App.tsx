import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/pear"
          element={
            <ProductPage
              name="Pear"
              blurb="Yeni bir ürün. Yakında daha fazlası."
            />
          }
        />
        <Route
          path="/blindo"
          element={
            <ProductPage
              name="Blindo"
              blurb="Tanışma deneyimini yeniden düşünen bir uygulama."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Band from './components/Band'
import ShowTypes from './components/ShowTypes'
import Musicians from './components/Musicians'
import BookingSection from './components/booking/BookingSection'
import Gallery from './components/Gallery'
import Presentaciones from './components/Presentaciones'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* textura sutil de fondo */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-[0.05]" aria-hidden="true" />

      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-tinta-900"
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Band />
        <ShowTypes />
        <Musicians />
        <BookingSection />
        <Gallery />
        <Presentaciones />
        <FAQ />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}

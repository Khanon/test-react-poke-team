import { ErrorBoundary } from './components/error-boundary'
import { Footer } from './components/footer'
import { Header } from './components/header'
import { PokemonList } from './components/pokemon-list'
import { TeamPanel } from './components/team-panel'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <main>
          {/* Wraps only the list: if it fails, the header and the panel keep working. */}
          <ErrorBoundary>
            <PokemonList />
          </ErrorBoundary>
        </main>
        <TeamPanel />
      </div>
      <Footer />
    </div>
  )
}

export default App

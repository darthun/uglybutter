export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-yellow-50">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-center">Welcome to Ugly Butter</h1>
      <p className="text-xl sm:text-2xl mb-8 sm:mb-12 text-center">Your butter is ugly, let me rate it.</p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-lg sm:text-xl">
        Upload Your Butter
      </button>
    </main>
  )
}
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-yellow-50">
      <h1 className="text-6xl font-bold mb-6 text-center">Welcome to Ugly Butter</h1>
      <p className="text-2xl mb-12 text-center">Your butter is ugly, let me rate it.</p>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-xl">
        Upload Your Butter
      </button>
    </main>
  )
}
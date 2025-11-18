import MediaPlayer from "./components/MediaPlayer"

function App() {

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">

      <div className="absolute inset-0 bg-cover bg-center bg-[url('/assets/images/bg-image.png')] blur-lg scale-110"/>

      <h1 className="relative text-4xl text-shadow-black text-[#ffff00]">OSRS Music Randomizer</h1>

      <div className="relative gap-1 flex flex-col items-center z-10 bg-[#312a25] p-4 outline outline-[#736559]">

        <h1 className="text-2xl text-shadow-black text-[#ffff00]">Now Playing</h1>

        <MediaPlayer/>

        <p className="pt-2 text-[#ffff00] text-md max-w-lg text-center text-shadow-black">Old School RuneScape and all associated music, names, and content are the property of Jagex Ltd. This project is not affiliated with or endorsed by Jagex Ltd.</p>
      </div>
    </div>
  )
}

export default App
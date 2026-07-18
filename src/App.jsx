import FluidBlobCursor from "./components/FluidBlobCursor";

export default function App() {
  return (
    <>
      <FluidBlobCursor />

      <main className="min-h-screen bg-black text-white overflow-hidden">

        <section className="relative h-screen flex items-center justify-center">

          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

          <div className="relative z-10 max-w-7xl px-10 w-full">

            <p
              className="
              text-cyan-400
              uppercase
              tracking-[0.4em]
              text-sm
              mb-8
              "
            >
              UI/UX DESIGNER • FRONTEND DEVELOPER
            </p>

            <h1
              className="
              text-[12vw]
              font-black
              leading-none
              tracking-tight
              "
            >
              ATHARVA
            </h1>

            <h1
              className="
              text-[12vw]
              font-black
              leading-none
              tracking-tight
              "
            >
              BULBULE
            </h1>

            <p
              className="
              mt-10
              max-w-2xl
              text-zinc-400
              text-xl
              "
            >
              Crafting cinematic digital experiences through
              design, code and visual storytelling.
            </p>

            <button
              className="
              mt-12
              px-8
              py-4
              rounded-full
              border
              border-white/15
              bg-white/5
              backdrop-blur-xl
              transition-all
              duration-500
              hover:bg-white/10
              "
            >
              Explore Work
            </button>

          </div>
        </section>

      </main>
    </>
  );
}
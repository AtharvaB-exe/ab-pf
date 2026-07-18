import FluidBlobCursor from "./components/FluidBlobCursor";

export default function App() {
  return (
    <>
      <FluidBlobCursor />

      <main className="min-h-screen text-white overflow-hidden">

        {/* Background */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/bg.png')",
          }}
        />

        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/50" />

        {/* Hero */}
        <section className="relative h-screen flex items-center">

          <div className="relative z-10 max-w-7xl mx-auto px-10 w-full">

            <p
              className="
              text-cyan-300
              uppercase
              tracking-[0.45em]
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
              text-zinc-300
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
              border-white/20
              bg-white/10
              backdrop-blur-3xl
              transition-all
              duration-500
              hover:bg-white/20
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
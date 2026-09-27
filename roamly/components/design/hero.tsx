import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Background Image with Boat / Ocean */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=1441&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Yacht on blue ocean water"
          fill
          priority
          className="object-cover object-center brightness-90"
        />
        {/* Subtle gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between px-8 py-12 md:px-16 md:py-16">
        
        {/* Top Spacer to offset navbar height */}
        <div className="h-16" />

        {/* Main Headline */}
        <div className="max-w-3xl">
          <h1 className="text-5xl font-light tracking-tight text-white sm:text-7xl md:text-8xl leading-[1.05]">
            The adventure <br />
            starts here
          </h1>
        </div>

        {/* Bottom Bar: Text (Left) + CTA (Right) */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          {/* Subtext */}
          <p className="max-w-md text-sm sm:text-base font-light text-white/90 leading-relaxed">
            Take the first step toward a more exciting journey. From local recommendations 
            to money-saving tips — everything you need to make your trip memorable.
          </p>

          {/* CTA Button */}
          <a
            href="#booking"
            className="inline-flex items-center justify-center rounded-none bg-white/90 px-7 py-3 text-sm font-medium text-slate-900 transition-opacity hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-md backdrop-blur-sm"
          >
            Book Your Trip
          </a>
        </div>
      </div>
    </section>
  );
}
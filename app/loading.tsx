export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e3d9ce] overflow-hidden">
      {/* HERO SECTION Skeleton */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-28 pb-16 md:pt-20 md:pb-12 bg-[#2e3d30] rounded-b-[2.5rem] md:rounded-b-[5rem] z-20">
        <div className="container max-w-screen-2xl px-5 md:px-12 mx-auto grid lg:grid-cols-12 gap-10 md:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col items-start w-full">
            {/* Badge Skeleton */}
            <div className="h-8 md:h-10 w-48 bg-[#e3d9ce]/10 rounded-full animate-pulse" />

            {/* Title Skeleton */}
            <div className="w-full space-y-4">
              <div className="h-14 md:h-20 lg:h-24 w-[80%] bg-[#e3d9ce]/10 rounded-2xl animate-pulse" />
              <div className="h-14 md:h-20 lg:h-24 w-[60%] bg-[#e3d9ce]/10 rounded-2xl animate-pulse" />
              <div className="h-14 md:h-20 lg:h-24 w-[75%] hidden sm:block bg-[#e3d9ce]/10 rounded-2xl animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="w-full space-y-3 max-w-lg">
              <div className="h-4 md:h-5 w-full bg-[#e3d9ce]/10 rounded-md animate-pulse" />
              <div className="h-4 md:h-5 w-[90%] bg-[#e3d9ce]/10 rounded-md animate-pulse" />
              <div className="h-4 md:h-5 w-[70%] bg-[#e3d9ce]/10 rounded-md animate-pulse" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-6 w-full sm:w-auto">
              <div className="h-14 w-full sm:w-56 bg-[#e3d9ce]/10 rounded-full animate-pulse" />
              <div className="h-14 w-full sm:w-48 bg-[#e3d9ce]/5 border border-[#e3d9ce]/10 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Hero Image Skeleton - Arched */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[75vh] w-full hidden sm:block mt-8 lg:mt-0">
            <div className="relative h-full w-full rounded-t-full overflow-hidden bg-[#e3d9ce]/5 border-4 border-[#2e3d30] animate-pulse" />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION Skeleton */}
      <section className="py-20 md:py-40 relative z-10">
        <div className="container max-w-7xl px-5 md:px-12 mx-auto">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-12 md:gap-24 items-start">
            {/* Image Skeleton - Inverted Arch */}
            <div className="w-full h-full relative">
              <div className="relative aspect-3/4 w-[80%] md:w-full max-w-md mx-auto">
                <div className="h-full w-full rounded-b-full bg-[#bfa086]/20 border-8 border-[#e3d9ce]/50 animate-pulse" />
              </div>
            </div>

            {/* Text Column Skeleton */}
            <div className="space-y-6 md:space-y-8 pt-4 md:pt-10 w-full">
              <div className="h-4 w-24 bg-[#bfa086]/30 rounded-md animate-pulse" />

              <div className="space-y-4">
                <div className="h-12 md:h-16 w-[70%] bg-[#bfa086]/20 rounded-xl animate-pulse" />
                <div className="h-12 md:h-16 w-[50%] bg-[#bfa086]/20 rounded-xl animate-pulse" />
              </div>

              <div className="space-y-3 w-full">
                <div className="h-5 w-full bg-[#bfa086]/20 rounded-md animate-pulse" />
                <div className="h-5 w-[90%] bg-[#bfa086]/20 rounded-md animate-pulse" />
                <div className="h-5 w-[95%] bg-[#bfa086]/20 rounded-md animate-pulse" />
                <div className="h-5 w-[60%] bg-[#bfa086]/20 rounded-md animate-pulse" />
              </div>

              <div className="pt-2 md:pt-4">
                <div className="h-6 w-48 bg-[#bfa086]/30 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION Skeleton */}
      <section className="py-20 md:py-32 bg-[#2e3d30] rounded-t-[2.5rem] md:rounded-t-[5rem]">
        <div className="container max-w-7xl px-5 md:px-12 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8 border-b border-[#e3d9ce]/10 pb-8 md:pb-12">
            <div className="space-y-3 md:space-y-4 w-full max-w-2xl">
              <div className="h-4 w-24 bg-[#e3d9ce]/10 rounded-md animate-pulse" />
              <div className="h-12 md:h-16 w-[60%] bg-[#e3d9ce]/10 rounded-xl animate-pulse" />
            </div>
            <div className="h-12 w-full md:w-56 bg-[#e3d9ce]/10 rounded-full animate-pulse" />
          </div>

          <div className="flex overflow-hidden md:grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-24 -mx-5 px-5 md:mx-0 md:px-0">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="min-w-[85vw] md:min-w-0 bg-[#e3d9ce]/5 p-6 md:p-8 rounded-3xl animate-pulse"
              >
                <div className="h-10 w-10 bg-[#e3d9ce]/10 rounded-lg mb-6" />
                <div className="space-y-3 mb-8">
                  <div className="h-6 w-full bg-[#e3d9ce]/10 rounded-md" />
                  <div className="h-6 w-[90%] bg-[#e3d9ce]/10 rounded-md" />
                  <div className="h-6 w-[60%] bg-[#e3d9ce]/10 rounded-md" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 md:h-14 md:w-14 bg-[#e3d9ce]/10 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-[#e3d9ce]/10 rounded-md" />
                    <div className="h-3 w-16 bg-[#e3d9ce]/5 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PortfolioLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e3d9ce] overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto">
        {/* Header Skeleton - Estilo Editorial */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 space-y-4">
          <div className="h-3 w-32 bg-[#87381e]/20 rounded-full animate-pulse" />
          <div className="space-y-3 w-full max-w-2xl">
            <div className="h-12 md:h-16 w-[70%] bg-[#2e3d30]/10 rounded-2xl mx-auto animate-pulse" />
            <div className="h-12 md:h-16 w-[50%] bg-[#2e3d30]/10 rounded-2xl mx-auto animate-pulse" />
          </div>
        </div>

        {/* Portfolio Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`flex flex-col rounded-3xl overflow-hidden bg-[#bfa086]/5 border border-[#bfa086]/20 animate-pulse ${
                i % 3 === 0 ? "lg:row-span-1" : ""
              }`}
            >
              {/* Image Area Skeleton */}
              <div className="aspect-4/5 w-full bg-[#bfa086]/10" />

              {/* Content Skeleton */}
              <div className="p-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <div className="h-5 w-20 bg-[#2e3d30]/10 rounded-full" />
                  <div className="h-5 w-24 bg-[#2e3d30]/10 rounded-full" />
                </div>

                <div className="space-y-3">
                  <div className="h-7 w-3/4 bg-[#2e3d30]/15 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#756d47]/10 rounded-md" />
                    <div className="h-4 w-[90%] bg-[#756d47]/10 rounded-md" />
                    <div className="h-4 w-[60%] bg-[#756d47]/10 rounded-md" />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div className="h-4 w-24 bg-[#87381e]/10 rounded-md" />
                  <div className="h-8 w-8 bg-[#bfa086]/20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

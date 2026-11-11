export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#e3d9ce] pt-16 pb-24">
      <div className="container max-w-screen-xl px-6 md:px-12 mx-auto">
        <div className="space-y-4 border-b border-[#bfa086]/30 pb-8 md:pb-12 mb-16 md:mb-24 max-w-2xl">
          <div className="h-3 w-16 bg-[#87381e]/20 rounded-full animate-pulse" />
          <div className="h-12 md:h-16 w-[80%] bg-[#2e3d30]/10 rounded-2xl animate-pulse" />
          <div className="h-4 w-full bg-[#756d47]/10 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-10 md:gap-y-16">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="aspect-[4/3] w-full bg-[#bfa086]/10 mb-6" />
              <div className="h-3 w-24 bg-[#87381e]/10 rounded-md mb-4" />
              <div className="h-7 w-3/4 bg-[#2e3d30]/15 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-[#756d47]/10 rounded-md" />
                <div className="h-4 w-[85%] bg-[#756d47]/10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

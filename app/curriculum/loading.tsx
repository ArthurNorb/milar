export default function CurriculumLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#e3d9ce] overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32">
      <div className="container max-w-screen-2xl px-6 md:px-12 mx-auto">
        {/* Header Skeleton Editorial */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24 space-y-4">
          <div className="h-3 w-32 bg-[#87381e]/20 rounded-full animate-pulse" />
          <div className="space-y-3 w-full max-w-2xl">
            <div className="h-12 md:h-16 w-[70%] bg-[#2e3d30]/10 rounded-2xl mx-auto animate-pulse" />
            <div className="h-12 md:h-16 w-[50%] bg-[#2e3d30]/10 rounded-2xl mx-auto animate-pulse" />
          </div>
          <div className="h-6 w-48 bg-[#bfa086]/20 rounded-full mx-auto animate-pulse pt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 items-start">
          {/* Coluna Principal (Trajetória) */}
          <div className="lg:col-span-2 space-y-16">
            {/* Seção Educação / Experiência Skeleton */}
            {[1, 2].map((section) => (
              <div key={section} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#87381e]/10 animate-pulse" />
                  <div className="h-6 w-56 bg-[#2e3d30]/10 rounded-lg animate-pulse" />
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="p-8 rounded-3xl border border-[#bfa086]/20 bg-[#bfa086]/5 space-y-4 animate-pulse"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="h-6 w-48 bg-[#2e3d30]/15 rounded-md" />
                          <div className="h-4 w-64 bg-[#756d47]/10 rounded-md" />
                        </div>
                        <div className="h-5 w-24 bg-[#bfa086]/30 rounded-full" />
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="h-4 w-full bg-[#756d47]/5 rounded-md" />
                        <div className="h-4 w-[90%] bg-[#756d47]/5 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna Lateral (Infos & Skills) */}
          <div className="space-y-12">
            {/* Quem Sou Skeleton */}
            <div className="p-8 rounded-3xl bg-[#2e3d30] text-[#e3d9ce] space-y-6 animate-pulse">
              <div className="h-5 w-32 bg-[#bfa086]/20 rounded-md" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#e3d9ce]/10 rounded-md" />
                <div className="h-4 w-full bg-[#e3d9ce]/10 rounded-md" />
                <div className="h-4 w-[60%] bg-[#e3d9ce]/10 rounded-md" />
              </div>
              <div className="pt-4 space-y-3">
                <div className="h-4 w-40 bg-[#e3d9ce]/20 rounded-md" />
                <div className="h-4 w-48 bg-[#e3d9ce]/20 rounded-md" />
              </div>
            </div>

            {/* Hard Skills Skeleton */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#756d47]/10 animate-pulse" />
                <div className="h-6 w-40 bg-[#2e3d30]/10 rounded-lg animate-pulse" />
              </div>

              <div className="p-8 rounded-3xl border border-[#bfa086]/30 bg-transparent space-y-6 animate-pulse">
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((skill) => (
                    <div
                      key={skill}
                      className="h-8 w-20 md:w-24 bg-[#bfa086]/20 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

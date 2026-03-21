export default function CurriculumLoading() {
  return (
    <div className="py-24 md:py-32">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="h-12 w-64 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-muted rounded mx-auto mb-6 animate-pulse" />
            <div className="h-10 w-48 bg-muted rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column skeleton */}
            <div className="lg:col-span-2 space-y-12">
              {/* Education skeleton */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-muted">
                    <div className="h-5 w-5" />
                  </div>
                  <div className="h-7 w-64 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border-border/50 bg-muted/30 rounded-lg p-6 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-6 w-48 bg-muted rounded" />
                          <div className="h-4 w-64 bg-muted rounded" />
                        </div>
                        <div className="h-6 w-32 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experience skeleton */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-muted">
                    <div className="h-5 w-5" />
                  </div>
                  <div className="h-7 w-72 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-border/50 bg-muted/30 rounded-lg p-6 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="h-6 w-56 bg-muted rounded" />
                          <div className="h-4 w-80 bg-muted rounded" />
                        </div>
                        <div className="h-6 w-32 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column skeleton */}
            <div className="space-y-12">
              {/* Skills skeleton */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-full bg-muted">
                    <div className="h-5 w-5" />
                  </div>
                  <div className="h-7 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="border-border/50 bg-muted/30 rounded-lg p-6 animate-pulse">
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-8 w-24 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              </section>

              {/* About skeleton */}
              <section>
                <div className="border-border/50 bg-muted/30 rounded-lg p-6 animate-pulse">
                  <div className="h-7 w-48 bg-muted rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-64 bg-muted rounded mt-6" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
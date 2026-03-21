export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      {/* Hero Section skeleton */}
      <section className="relative overflow-hidden py-32 md:py-48">
        <div className="container relative z-10 max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="h-16 w-96 bg-muted rounded mx-auto mb-6 animate-pulse" />
            <div className="h-10 w-80 bg-muted rounded mx-auto mb-8 animate-pulse" />
            <div className="h-6 w-2/3 bg-muted rounded mx-auto mb-10 animate-pulse" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-64 bg-muted rounded animate-pulse" />
              <div className="h-12 w-64 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </section>

      {/* About Section skeleton */}
      <section className="py-32 md:py-48 border-t border-border/40">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="h-12 w-3/4 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-full bg-muted rounded animate-pulse" />
                  <div className="h-5 w-full bg-muted rounded animate-pulse" />
                  <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-10 w-48 bg-muted rounded animate-pulse" />
              </div>
              <div className="relative">
                <div className="aspect-square w-full max-w-xs mx-auto bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section skeleton */}
      <section className="py-32 md:py-48 border-t border-border/40 bg-muted/20">
        <div className="container max-w-screen-2xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <div className="h-12 w-64 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border-border/60 bg-muted/30 rounded-lg p-8 animate-pulse"
              >
                <div className="h-10 w-10 bg-muted rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-5 w-full bg-muted rounded" />
                  <div className="h-5 w-full bg-muted rounded" />
                  <div className="h-5 w-2/3 bg-muted rounded" />
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div>
                    <div className="h-5 w-32 bg-muted rounded mb-1" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 mx-auto max-w-2xl">
            <div className="border-border/60 bg-muted/30 rounded-lg p-8 animate-pulse">
              <div className="h-7 w-64 bg-muted rounded mb-6" />
              <div className="space-y-4">
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-32 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
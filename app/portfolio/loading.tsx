export default function PortfolioLoading() {
  return (
    <div className="py-24 md:py-32">
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="h-12 w-64 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-muted rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-min">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`border-border/50 bg-muted/30 rounded-lg overflow-hidden animate-pulse ${i % 3 === 0 ? 'lg:row-span-2' : ''}`}
            >
              <div className="aspect-[3/4] bg-muted" />
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-20 bg-muted rounded" />
                  <div className="h-6 w-24 bg-muted rounded" />
                </div>
                <div className="h-7 w-3/4 bg-muted rounded" />
                <div className="h-5 w-full bg-muted rounded" />
                <div className="h-5 w-2/3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
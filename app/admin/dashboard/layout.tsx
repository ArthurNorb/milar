export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-screen-2xl px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-heading font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciar portfólio, depoimentos e currículo
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
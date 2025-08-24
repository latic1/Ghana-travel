import Header from "./Header"
import Footer from "./Footer"

interface PageLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export default function PageLayout({ children, showFooter = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

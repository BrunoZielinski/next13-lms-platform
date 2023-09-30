import { Navbar } from './_components/navbar'
import { Sidebar } from './_components/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full">
        <Navbar />
      </div>

      <div className="fixed inset-y-0 z-50 flex-col hidden w-56 h-full md:flex">
        <Sidebar />
      </div>

      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  )
}

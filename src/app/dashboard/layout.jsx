import { SidebarProvider } from "@/components/ui/sidebar"
// import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/section/App-Sidebar"

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                {/* <SidebarTrigger /> */}
                {children}
            </main>
        </SidebarProvider>
    )
}
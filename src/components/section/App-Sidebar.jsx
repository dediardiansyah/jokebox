import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <h1>Header</h1>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <h2>Link H2</h2>
                <h2>Link H3</h2>
                <h2>Link H4</h2>
                <h2>Link H5</h2>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
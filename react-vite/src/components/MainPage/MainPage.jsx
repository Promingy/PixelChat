import { Outlet } from "react-router-dom"
import OuterNavbar from "../OuterNavbar"
import InnerNavbar from "../InnerNavbar/InnerNavbar"

export default function MainPage() {
    return (
        <>
            <Outlet />
            <OuterNavbar />
            <InnerNavbar />
        </>
    )
}

import { Outlet } from "react-router-dom"
import OuterNavbar from "../OuterNavbar"

export default function MainPage() {
    return (
        <>
            <Outlet />
            <OuterNavbar />
        </>
    )
}

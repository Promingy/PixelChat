import { Outlet } from "react-router-dom"
export default function MainPage() {
    return(
    <>
        <Outlet />
        <h1>Hi from MainPage</h1>
    </>
    )
}

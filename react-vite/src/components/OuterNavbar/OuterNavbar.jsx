import { useParams, Link } from "react-router-dom"
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { useState } from "react";
import { useSelector } from 'react-redux'

export default function OuterNavbar() {

    const sessionUser = useSelector((state) => state.session.user)
    const server = useSelector((state) => state.server)

    return (

        <div className="outer-navbar-wrapper">
            <div className="outer-navbar-top">
                <div className="server-img-wrapper"><img href={server.image_url} /></div>
            </div>
            <div className="outer-navbar-bottom">

                <Link to='/new-server' className="create-new-server">
                    <i class="fa-solid fa-plus"></i>
                </Link>
                <div className="open-profile-wrapper">
                    <OpenModalButton >
                        <div className="user-img-wrapper"><img href={sessionUser.image_url} /></div>
                    </OpenModalButton>
                </div>
            </div>

        </div>
    )
}
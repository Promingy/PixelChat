import { useEffect } from "react"

export default function OAuthPopup() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage("oauth-success", "*")
            window.close()
        }
    }, [])

    return(
        <div>
        </div>
    )
}
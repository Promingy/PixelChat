import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Redirect.css"

export default function Redirect() {
    const navigate = useNavigate()
    const [time, setTime] = useState(5)


    useEffect(() => {
        function reduceTime() {
            const newTime = time - 1
            setTime(newTime)
        }
        setTimeout(reduceTime, 1000)

        if (!time) {
            navigate('/landing')
        }

    }, [time, navigate, reduceTime])

    return (
        <div className='redirect'>
            <h1>Error 404: The page you are looking for does not exist or has been deleted.</h1>
            <h3>Redirecting back to the <Link
                to='/landing'
                onClick={() => clearTimeout(reduceTime)}>home page</Link> in {time}</h3>
        </div>
    )
}

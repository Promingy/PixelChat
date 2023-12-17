export default function ServerCreation() {

    onSubmit = () => {
        // handle form submission
    }

    return (
        <form className="server-creation-form" onSubmit={onSubmit}>
            <h1 className="server-creation-header">{`What's the name of your server?`}</h1>
            <h2 className="server-creation-subheader">This will be the name of your PixelChat server - choose something that your team will recognize</h2>
            <input type='text' className="server-creation-input" placeholder="Ex: Acme Marketing or Acme Co " />
            <h1 className="server-creation-header">Describe your server</h1>
            <h2 className="server-creation-subheader">Provide a short description of your server (optional)</h2>
            <input type='text' className="server-creation-input" placeholder="Ex: Official PixelChat server for the Acme marketing team " />
            <h1 className="server-creation-header">Upload an icon for your server</h1>
            <h2 className="server-creation-subheader">Choose an image to represent your server (optional)</h2>
            --Placeholder for file upload--
            <input type='submit' className="submit-server" value="Create New Server" />
        </form>
    )
}
import { h } from "preact";

import Header from "./components/header";
import Home from "./routes/home";
import RemoteJoin from "./routes/remote-join";

const App = () => {
    const postUrl = window.location.href.split(window.location.origin)[1];
    const id = postUrl.split("?g=")[1];

    return (
        <div id="app">
            <Header />
            {id ? <RemoteJoin id={id} /> : <Home />}
        </div>
    );
};

export default App;

import { h } from "preact";
import { Route, Router } from "preact-router";

import Header from "./components/header";
import Home from "./routes/home";
import RemoteJoin from "./routes/remote-join";

const App = () => (
    <div id="app">
        <Header />
        <Router>
            <Route path="/" component={Home} />
            <Route path="/:id" component={RemoteJoin} />
        </Router>
    </div>
);

export default App;

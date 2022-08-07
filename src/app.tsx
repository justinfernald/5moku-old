import { h } from "preact";
import { Route, Router } from "preact-router";

import Header from "./components/header";

import Home from "./routes/home";

const App = () => (
    <div id="app">
        <Header />
        <Router>
            <Route path="/" component={Home} />
        </Router>
    </div>
);

export default App;

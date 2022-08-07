import { h } from "preact";
import { Route, Router } from "preact-router";

import Header from "./components/header";
import Home from "./routes/home";
import RemoteJoin from "./routes/remote-join";

// import { Peer } from "peerjs";
// import { v4 as uuid } from "uuid";

// const id = uuid();

// const peer = new Peer(id);

// peer.on("connection", (conn) => {
//     conn.on("data", (data) => {
//         console.log(data);
//     });

//     conn.on("open", () => {
//         conn.send("hello!");
//     });
// });

// const peer2 = new Peer();
// console.log({ peer2 });
// setTimeout(() => {
//     const conn2 = peer2.connect("id-" + id);
//     conn2.on("open", () => {
//         conn2.send("hi!");
//     });
// }, 1000);

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

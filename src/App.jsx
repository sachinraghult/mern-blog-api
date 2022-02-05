import Topbar from "./component/topbar/Topbar";
import Home from "./pages/home/Home"
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import ConfirmDelete from "./pages/confirmDelete/ConfirmDelete";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";

function App() {

    const {user} = useContext(Context);

    return (
        <div className="App">
          <Router>
            <Topbar/>
            <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route path="/register" element={user ? <Home/> : <Register/>} />
              <Route path="/login" element={user ? <Home/> : <Login/>} />
              <Route path="/write" element={user ? <Write/> : <Home/>} />
              <Route path="/settings" element={user ? <Settings/> : <Home/>} />
              <Route path="/post/:postID" element={<Single/>} />
              <Route path="/confirmation" element={user ? <ConfirmDelete/> : <Home/>} />
            </Routes>
          </Router>
        </div>
    );
}

export default App;

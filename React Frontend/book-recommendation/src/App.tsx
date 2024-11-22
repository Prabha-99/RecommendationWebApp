import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Books from "./features/Books";
import Dashboard from "./Layout/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Non-Authenticated Routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
          {/* <Route path="/" element={<Dashboard />} /> */}

          {/* Authenticated Routes */}
          <Route path="/*" element={<Dashboard/>}>
            <Route path="books" element={<Books/>} />
          </Route>
        </Routes>
      </Router>
      {/* <Toaster position="bottom-right" /> */}
    </>
  );
}

export default App;

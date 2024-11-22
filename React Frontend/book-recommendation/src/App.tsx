import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Books from "./features/Books";
import Dashboard from "./Layout/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/*" element={<Dashboard />}>
            <Route path="books" element={<Books />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;

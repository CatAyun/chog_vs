import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Play } from "./pages/Play";
export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

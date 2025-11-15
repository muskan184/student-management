import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AiAssistant from "../components/demo";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AiAssistant />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

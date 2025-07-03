import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyProfile from "./Pages/CompanyProfile";
import PostJob from "./Pages/PostJob";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/companyProfile" element={<CompanyProfile />} />
        <Route path="/postJob" element={<PostJob />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default Index;

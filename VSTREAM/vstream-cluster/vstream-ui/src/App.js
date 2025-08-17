import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import LoginSignup from "./components/login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import VideoPlayer from "./components/VideoPlayer";
import AdminPage from "./components/AdminPage";
import VideoUploadTrend from "./components/VideoUploadTrend";
import UploadCountByUser from "./components/UploadCountByUser";
import ViewsVsLikes from "./components/ViewsVsLikes";
import LikeCountDist from "./components/LikeCountDist";
import AuditPage from "./components/AuditPage"
import UserDashboard from "./components/User";
const App = () => {
  return (
    <div className="App">
      <Navbar />        
        <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<LoginSignup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/videoUploadTrend" element={<VideoUploadTrend />} />
        <Route path="/admin/viewsVsLikes" element={<ViewsVsLikes />} />
        <Route path="/admin/uploadCountByUser" element={<UploadCountByUser />} />
        <Route path="/admin/likeCountDist" element={<LikeCountDist />} />
        <Route path="/admin/audit" element={<AuditPage />} />
        </Routes>
    </div>
  );
};

export default App;

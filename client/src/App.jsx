import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// ===== Public Pages =====
import Home from './pages/Home.jsx';
import People from './pages/People.jsx';
import FacultyProfile from './pages/FacultyProfile.jsx';
import Programs from './pages/Programs.jsx';
import Newsletter from './pages/Newsletter.jsx';
import Achievements from './pages/Achievements.jsx';
import Events from './pages/Events.jsx';
import News from './pages/News.jsx';
import NewsDetail from './pages/NewsDetail.jsx';
import Directory from './pages/Directory.jsx';
import Research from './pages/Research.jsx';
import Facilities from './pages/Facilities.jsx';

// ===== Admin Pages =====
import AdminLogin from './pages/Admin/Login.jsx';
import AdminLayout from './pages/Admin/Layout.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import SliderManagement from './pages/Admin/SliderManagement.jsx';
import PeopleManagement from './pages/Admin/PeopleManagement.jsx';
import ProgramsManagement from './pages/Admin/ProgramsManagement.jsx';
import NewsManagement from './pages/Admin/NewsManagement.jsx';
import EventsManagement from './pages/Admin/EventsManagement.jsx';
import AchievementsManagement from './pages/Admin/AchievementsManagement.jsx';
import NewsletterManagement from './pages/Admin/NewsletterManagement.jsx';
import DirectoryManagement from './pages/Admin/DirectoryManagement.jsx';
import InfoBlocksManagement from './pages/Admin/InfoBlocksManagement.jsx';
import ResearchManagement from './pages/Admin/ResearchManagement.jsx';
import FacilitiesManagement from './pages/Admin/FacilitiesManagement.jsx';

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/people" element={
          <>
            <Navbar />
            <People />
            <Footer />
          </>
        } />
        
        {/* Faculty Profile Route (MUST BE AFTER /people list route) */}
        <Route path="/people/:slug" element={
          <>
            <Navbar />
            <FacultyProfile />
            <Footer />
          </>
        } />
        
        <Route path="/programs" element={
          <>
            <Navbar />
            <Programs />
            <Footer />
          </>
        } />

        <Route path="/research" element={
          <>
            <Navbar />
            <Research />
            <Footer />
          </>
        } />

        <Route path="/facilities" element={
          <>
            <Navbar />
            <Facilities />
            <Footer />
          </>
        } />

        <Route path="/newsletter" element={
          <>
            <Navbar />
            <Newsletter />
            <Footer />
          </>
        } />

        <Route path="/achievements" element={
          <>
            <Navbar />
            <Achievements />
            <Footer />
          </>
        } />

        <Route path="/events" element={
          <>
            <Navbar />
            <Events />
            <Footer />
          </>
        } />

        <Route path="/news" element={
          <>
            <Navbar />
            <News />
            <Footer />
          </>
        } />

        <Route path="/news/:id" element={
          <>
            <Navbar />
            <NewsDetail />
            <Footer />
          </>
        } />

        <Route path="/directory" element={
          <>
            <Navbar />
            <Directory />
            <Footer />
          </>
        } />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sliders" element={<SliderManagement />} />
          <Route path="people" element={<PeopleManagement />} />
          <Route path="programs" element={<ProgramsManagement />} />
          <Route path="research" element={<ResearchManagement />} />
          <Route path="facilities" element={<FacilitiesManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="events" element={<EventsManagement />} />
          <Route path="achievements" element={<AchievementsManagement />} />
          <Route path="newsletters" element={<NewsletterManagement />} />
          <Route path="directory" element={<DirectoryManagement />} />
          <Route path="info-blocks" element={<InfoBlocksManagement />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
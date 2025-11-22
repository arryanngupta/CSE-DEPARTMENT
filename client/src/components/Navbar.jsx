import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaChevronDown,
  FaEllipsisH,
} from "react-icons/fa";
import logo from "../assets/images/lnmiit_transparent_logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // mobile open
  const [activeDropdown, setActiveDropdown] = useState(null); // desktop hover
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close menus when path changes
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // each item has a stable id (string). For the three-dot menu we use id: 'more'
  const navLinks = [
    { id: "home", label: "Home", path: "/" },
    { id: "people", label: "People", path: "/people" },
    { id: "programs", label: "Programs", path: "/programs" },
    {
      id: "research",
      label: "Research",
      path: "/research",
      dropdown: [
        { label: "Research Areas", path: "/research?type=Area" },
        { label: "Publications", path: "/research?type=Publication" },
        { label: "Projects", path: "/research?type=Project" },
        { label: "Patents", path: "/research?type=Patent" },
      ],
    },
    {
      id: "facilities",
      label: "Facilities",
      path: "/facilities",
      dropdown: [
        { label: "Laboratories", path: "/facilities?category=Laboratory" },
        { label: "Infrastructure", path: "/facilities?category=Infrastructure" },
        { label: "Equipment", path: "/facilities?category=Equipment" },
        { label: "Software", path: "/facilities?category=Software" },
      ],
    },
    {
      id: "events",
      label: "Events",
      path: "/events",
      dropdown: [
        { label: "Upcoming Events", path: "/events?type=upcoming" },
        { label: "Past Events", path: "/events?type=past" },
      ],
    },
    // compact "More" menu (three dots)
    {
      id: "more",
      label: "Others",
      dropdown: [
        { label: "News", path: "/news" },
        { label: "Achievements", path: "/achievements" },
        { label: "Newsletter", path: "/newsletter" },
        { label: "Directory", path: "/directory" },
      ],
    },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#8B0000] text-white">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6 text-sm">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
              <a href="tel:01412688090" className="hover:text-gray-200 flex items-center gap-1.5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="hidden sm:inline">0141 268 8090</span>
              </a>

              <a href="mailto:info.lnmiit@lnmiit.ac.in" className="hover:text-gray-200 flex items-center gap-1.5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="hidden md:inline">info.lnmiit@lnmiit.ac.in</span>
              </a>
            </div>

            <div className="flex gap-4 text-lg">
              <a href="https://www.instagram.com/lnmiit.official/" target="_blank" rel="noreferrer" className="hover:text-gray-200"><FaInstagram /></a>
              <a href="https://www.youtube.com/@lnmiitjaipur" target="_blank" rel="noreferrer" className="hover:text-gray-200"><FaYoutube /></a>
              <a href="https://www.facebook.com/lnmiit.official" target="_blank" rel="noreferrer" className="hover:text-gray-200"><FaFacebookF /></a>
              <a href="https://twitter.com/lnmiit_jaipur" target="_blank" rel="noreferrer" className="hover:text-gray-200"><FaTwitter /></a>
              <a href="https://www.linkedin.com/school/lnmiit-jaipur/" target="_blank" rel="noreferrer" className="hover:text-gray-200"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? "shadow-lg" : "shadow-md"}`}>
        <div className="w-full">
          <div className="flex justify-between items-center py-3 lg:py-4 px-6">
            <div className="hidden sm:block">
              <div className="text-[#8B0000] font-bold text-base sm:text-lg lg:text-xl font-merriweather leading-tight">
                Computer Science &amp; Engineering
              </div>
              <div className="text-gray-600 text-xs lg:text-sm mt-0.5">
                The LNM Institute of Information Technology
              </div>
            </div>

            {/* Desktop center nav */}
            <div className="hidden lg:flex items-center gap-2 relative">
              {navLinks.map(({ id, path, label, dropdown }) => (
                <div
                  key={id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={path || "#"}
                    onClick={(e) => dropdown && e.preventDefault()}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive(path) ? "text-white bg-[#8B0000] shadow-md" : "text-gray-700 hover:text-[#8B0000] hover:bg-red-50"
                    }`}
                    aria-haspopup={dropdown ? "true" : undefined}
                    aria-expanded={activeDropdown === id}
                    title={id === "more" ? "More" : undefined}
                  >
                    {/* If label is element (three dots) render it; else text */}
                    {label}
                    {dropdown && <motion.span animate={{ rotate: activeDropdown === id ? 180 : 0 }} transition={{ duration: 0.2 }}><FaChevronDown className="w-3.5 h-3.5 ml-1" /></motion.span>}
                  </Link>

                  {/* Dropdown: for 'more' align right to avoid overflow */}
                  <AnimatePresence>
                    {dropdown && activeDropdown === id && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className={`absolute top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 ${id === "more" ? "right-0" : "left-0"}`}
                      >
                        {dropdown.map((item) => (
                          <Link key={item.path} to={item.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#8B0000]/10 hover:text-[#8B0000]" onClick={() => setActiveDropdown(null)}>
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Logo */}
            <Link to="/" aria-label="Go to homepage">
              <img src={logo} alt="LNMIIT Logo" className="h-12 sm:h-14 lg:h-16 w-auto" />
            </Link>

            {/* Mobile hamburger */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsOpen((v) => !v)} className="lg:hidden p-2 rounded-lg text-[#8B0000] hover:bg-red-50 transition-colors">
              {isOpen ? "✕" : "☰"}
            </motion.button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="lg:hidden overflow-hidden border-t border-gray-200 bg-white">
                <div className="py-4 space-y-1">
                  {navLinks.map(({ id, label, path, dropdown }) => (
                    <div key={id}>
                      <div className="flex justify-between items-center px-4 py-3">
                        <Link to={path || "#"} onClick={() => setIsOpen(false)} className={`font-medium ${isActive(path) ? "text-[#8B0000]" : "text-gray-700 hover:text-[#8B0000]"}`}>
                          {typeof label === "string" ? label : "More"}
                        </Link>

                        {dropdown && (
                          <button onClick={() => setOpenDropdown(openDropdown === id ? null : id)} aria-expanded={openDropdown === id}>
                            <FaChevronDown className={`w-4 h-4 transition-transform ${openDropdown === id ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>

                      {/* mobile submenu */}
                      <AnimatePresence>
                        {dropdown && openDropdown === id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }} className="pl-8 pb-2">
                            {dropdown.map((sub) => (
                              <Link key={sub.path} to={sub.path} onClick={() => setIsOpen(false)} className="block py-2 text-sm text-gray-600 hover:text-[#8B0000]">
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

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
} from "react-icons/fa";
import logo from "../assets/images/lnmiit_transparent_logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  /* ================= ONLY MENU STRUCTURE UPDATED ================= */
  const navLinks = [
    { id: "home", label: "Home", path: "/" },

    {
      id: "people",
      label: "People",
      path: "/people",
      dropdown: [
        { label: "Faculty", path: "/people?person_type=Faculty" },
        {
          label: "Staff",
          path: "/people?person_type=Staff",
          dropdown: [
            {
              label: "Research Scholars",
              path: "/people?person_type=Research Scholar",
            },
          ],
        },
        { label: "Prominent Alumni", path: "/people?person_type=Alumni" },
      ],
    },

    {
      id: "programs",
      label: "Programs",
      path: "/programs",
      dropdown: [
        { label: "Bachelors Programmes", path: "/programs#bachelors" },
        { label: "Masters Programmes", path: "/programs#masters" },
        { label: "Doctoral Programmes", path: "/programs#doctoral" },
      ],
    },

    {
      id: "research",
      label: "Research",
      path: "/research",
      dropdown: [
        { label: "Research Publications", path: "/research?type=Publication" },
        { label: "Research Projects", path: "/research?type=Project" },
        { label: "Patents", path: "/research?type=Patent" },
        { label: "Collaborations", path: "/research?type=Collaboration" },
      ],
    },

    {
      id: "facilities",
      label: "Facilities",
      path: "/facilities",
      dropdown: [
        { label: "Laboratories", path: "/facilities?category=Laboratory" },
        {
          label: "Infrastructure",
          path: "/facilities?category=Infrastructure",
        },
        { label: "Equipment", path: "/facilities?category=Equipment" },
        { label: "Software", path: "/facilities?category=Software" },
      ],
    },

    {
      id: "events",
      label: "Events",
      path: "/events",
    },

    {
      id: "more",
      label: "Others",
      dropdown: [
        { label: "News", path: "/news" },
        {
          label: "Achievements",
          dropdown: [
            { label: "Student Achievements", path: "/achievements/students" },
            { label: "Faculty Achievements", path: "/achievements/faculty" },
          ],
        },

        { label: "Newsletter", path: "/newsletter" },
        { label: "Departmental Directory", path: "/directory" },
        { label: "Opportunities", path: "/opportunities" },
      ],
    },
  ];
  /* =============================================================== */

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#8B0000] text-white">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6 text-sm">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
              <a
                href="tel:01412688090"
                className="hover:text-gray-200 flex items-center gap-1.5"
              >
                0141 268 8090
              </a>
              <a
                href="mailto:info.lnmiit@lnmiit.ac.in"
                className="hover:text-gray-200"
              >
                info.lnmiit@lnmiit.ac.in
              </a>
            </div>

            <div className="flex gap-4 text-lg">
              <FaInstagram />
              <FaYoutube />
              <FaFacebookF />
              <FaTwitter />
              <FaLinkedinIn />
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar (UNCHANGED UI) */}
      <nav
        className={`bg-white sticky top-0 z-50 transition-shadow ${isScrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="w-full">
          <div className="flex justify-between items-center py-3 lg:py-4 px-6">
            <div className="hidden sm:block">
              <div className="text-[#8B0000] font-bold text-lg">
                Computer Science & Engineering
              </div>
              <div className="text-gray-600 text-sm">
                The LNM Institute of Information Technology
              </div>
            </div>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-2 relative">
              {navLinks.map(({ id, path, label, dropdown }) => (
                <div
                  key={id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={path || "#"}
                    onClick={(e) => dropdown && e.preventDefault()}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive(path)
                        ? "text-white bg-[#8B0000]"
                        : "text-gray-700 hover:text-[#8B0000] hover:bg-red-50"
                    }`}
                  >
                    {label}
                    {dropdown && <FaChevronDown className="w-3 h-3" />}
                  </Link>

                  <AnimatePresence>
                    {dropdown && activeDropdown === id && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute top-full mt-2 w-56 bg-white border rounded-xl shadow-lg z-50"
                      >
                        {dropdown.map((item) => (
                          <div key={item.path} className="relative group">
                            <Link
                              to={item.path}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-[#8B0000]/10 hover:text-[#8B0000]"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {item.label}
                              {item.dropdown && (
                                <FaChevronDown className="w-3 h-3 ml-2" />
                              )}
                            </Link>

                            {/* Research Scholars (sub-level, NO UI change) */}
                            {item.dropdown && (
                              <div className="absolute left-full top-0 ml-1 hidden group-hover:block w-56 bg-white border rounded-xl shadow-lg">
                                {item.dropdown.map((sub) => (
                                  <Link
                                    key={sub.path}
                                    to={sub.path}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#8B0000]/10 hover:text-[#8B0000]"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Logo */}
            <Link to="/">
              <img src={logo} alt="LNMIIT Logo" className="h-14" />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

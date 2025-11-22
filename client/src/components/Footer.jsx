import logo from '../assets/images/lnmiit_logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* LNMIIT Logo + Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="LNMIIT logo"
                className="w-12 h-12 object-contain"
              />
              <div className="text-sm">
                <div className="font-bold text-white">The LNM Institute of</div>
                <div className="text-gray-300">Information Technology</div>
              </div>
            </div>

            <p className="text-gray-400 text-sm">
              Rupa ki Nangal, Post-Sumel, Via Jamdoli, Jaipur, Rajasthan 302031
            </p>
            <p className="text-gray-400 text-sm mt-2">📞 0141 268 8090</p>
            <p className="text-gray-400 text-sm">✉ info.lnmiit@lnmiit.ac.in</p>
          </div>

          {/* Explore LNMIIT */}
          <div>
            <h3 className="text-[#F9C349] font-semibold mb-4 text-lg">Explore LNMIIT</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://lnmiit.ac.in" className="text-gray-400 hover:text-white transition-colors">About LNMIIT</a></li>
              <li><a href="https://lnmiit.ac.in/campus-life" className="text-gray-400 hover:text-white transition-colors">Campus Life</a></li>
              <li><a href="https://lnmiit.ac.in/research" className="text-gray-400 hover:text-white transition-colors">Research</a></li>
              <li><a href="https://lnmiit.ac.in/events" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              <li><a href="https://lnmiit.ac.in/academics" className="text-gray-400 hover:text-white transition-colors">Academics</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F9C349] font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://lnmiit.ac.in/departments" className="text-gray-400 hover:text-white transition-colors">Departments</a></li>
              <li><a href="https://lnmiit.ac.in/center-of-excellence" className="text-gray-400 hover:text-white transition-colors">Center of Excellence</a></li>
              <li><a href="https://lnmiit.ac.in/tenders" className="text-gray-400 hover:text-white transition-colors">Tenders</a></li>
              <li><a href="https://lnmiit.ac.in/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="https://lnmiit.ac.in/fee-payment-link" className="text-gray-400 hover:text-white transition-colors">Fee Payment Link</a></li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-[#F9C349] font-semibold mb-4 text-lg">Other Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://lnmiit.ac.in/anti-ragging" className="text-gray-400 hover:text-white transition-colors">Anti-Ragging</a></li>
              <li><a href="https://lnmiit.ac.in/information-display-policy" className="text-gray-400 hover:text-white transition-colors">Information Display Policy</a></li>
              <li><a href="https://lnmiit.ac.in/rti" className="text-gray-400 hover:text-white transition-colors">RTI</a></li>
              <li><a href="https://lnmiit.ac.in/forms" className="text-gray-400 hover:text-white transition-colors">Forms</a></li>
              <li><a href="https://lnmiit.ac.in/contact-us" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Social */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex justify-center gap-6">
            <a aria-label="LNMIIT on Facebook" href="https://facebook.com/lnmiit" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073C0 18.063 4.388 23.027 10.125 23.927v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a aria-label="LNMIIT on Twitter" href="https://twitter.com/lnmiit" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209C23.006 24 27.95 16.504 27.95 7.45c0-.21 0-.42-.015-.63A9.935 9.935 0 0023.953 4.57z"/></svg>
            </a>
            <a aria-label="LNMIIT on LinkedIn" href="https://linkedin.com/school/lnmiit" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065C3.274 4.23 4.194 3.305 5.337 3.305c1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a aria-label="LNMIIT on YouTube" href="https://youtube.com/lnmiit" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>Copyright © 2023–25 LNMIIT · All rights reserved · Last updated on: Nov 03, 2025</p>
          <p className="mt-2">
            For web support: <a href="mailto:web.support@lnmiit.ac.in" className="text-[#A6192E] hover:text-[#7D0F22]">web.support@lnmiit.ac.in</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

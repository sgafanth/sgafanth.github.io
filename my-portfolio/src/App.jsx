import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { ArrowUp, Github, Linkedin, Mail, Menu, X } from "lucide-react";
import Home from "./pages/Home";
import { getTheme } from "./theme";
import "./App.css";

const HOME_SECTION_IDS = ["latest-projects", "professional-experience", "education", "skill-toolkit"];
const NO_SECTION_IDS = [];

function Layout({ darkMode, setDarkMode }) {
  const theme = getTheme(darkMode);
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const desktopActionTotal = 4;
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [visibleDesktopActions, setVisibleDesktopActions] = useState(0);
  const scrollToTop = () => {
    setActiveSection("");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  const sectionIds = isHomePage ? HOME_SECTION_IDS : NO_SECTION_IDS;
  const showSidebarActions = sectionIds.includes(activeSection);

  useEffect(() => {
    if (!isHomePage) {
      return;
    }

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 180;
      let currentSection = "";

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [isHomePage, sectionIds]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    const updateScrollButtonVisibility = () => {
      const scrollY = window.scrollY;
      const revealThresholds = [340, 520, 700, 880];
      const revealCount = revealThresholds.filter((threshold) => scrollY >= threshold).length;

      setShowScrollTopButton(scrollY > 280);
      setVisibleDesktopActions((prev) => (prev === revealCount ? prev : revealCount));
    };

    window.addEventListener("scroll", updateScrollButtonVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollButtonVisibility);
  }, []);

  const handleScrollToTopClick = () => {
    setActiveSection("");
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };
  const getSectionLinkClass = (sectionId) =>
    `nav-sublink ${theme.sidebarSubLink} ${activeSection === sectionId ? theme.sidebarLinkActive : ""}`;

  const getDesktopActionRevealClass = (index) =>
    visibleDesktopActions >= desktopActionTotal - index ? "is-visible" : "";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`app-shell ${theme.shell} ${theme.sidebarShell}`}>
      <header className={`mobile-nav ${theme.sidebar}`}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className={`mobile-menu-button ${theme.toggleButton} shadow-lg`}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileMenuOpen ? "Toggle navigation menu" : "Open navigation menu"}
        >
          <Menu size={18} />
          Menu
        </button>

        <div
          className={`mobile-drawer-backdrop ${mobileMenuOpen ? "is-open" : ""}`}
          onClick={closeMobileMenu}
          aria-hidden={!mobileMenuOpen}
        />

        <div
          id="mobile-navigation-drawer"
          className={`mobile-drawer ${theme.sidebarMobile} ${mobileMenuOpen ? "is-open" : ""}`}
          aria-hidden={!mobileMenuOpen}
        >
          <nav>
            {isHomePage && (
              <div className="nav-submenu">
                <NavLink
                  to="/"
                  end
                  onClick={() => {
                    scrollToTop();
                    closeMobileMenu();
                  }}
                  className={`nav-sublink ${theme.sidebarSubLink}`}
                >
                  Home
                </NavLink>
                <a
                  href="#latest-projects"
                  onClick={() => handleSectionClick("latest-projects")}
                  className={getSectionLinkClass("latest-projects")}
                >
                  Projects
                </a>
                <a
                  href="#professional-experience"
                  onClick={() => handleSectionClick("professional-experience")}
                  className={getSectionLinkClass("professional-experience")}
                >
                  Experience
                </a>
                <a
                  href="#education"
                  onClick={() => handleSectionClick("education")}
                  className={getSectionLinkClass("education")}
                >
                  Education
                </a>
                <a
                  href="#skill-toolkit"
                  onClick={() => handleSectionClick("skill-toolkit")}
                  className={getSectionLinkClass("skill-toolkit")}
                >
                  Skills
                </a>
              </div>
            )}
            {!isHomePage && (
              <NavLink
                to="/"
                end
                onClick={() => {
                  scrollToTop();
                  closeMobileMenu();
                }}
                className={`nav-sublink ${theme.sidebarSubLink}`}
              >
                Home
              </NavLink>
            )}
          </nav>

          {showSidebarActions && (
            <div className="sidebar-actions">
              <a
                href="/Andy-Fanthome-CV.pdf"
                download
                onClick={closeMobileMenu}
                className={`sidebar-action download-cv-action ${theme.primaryButton}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  CV
                </span>
                <span className="sidebar-action-label">Download CV</span>
              </a>
              <a
                href="https://www.linkedin.com/in/andyfanthome/"
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-action ${theme.sidebarAction}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Linkedin size={16} />
                </span>
                <span className="sidebar-action-label">LinkedIn</span>
              </a>
              <a
                href="https://github.com/sgafanth"
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-action ${theme.sidebarAction}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Github size={16} />
                </span>
                <span className="sidebar-action-label">GitHub</span>
              </a>
              <a href="mailto:fanthome.andy@gmail.com" className={`sidebar-action ${theme.sidebarAction}`}>
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Mail size={16} />
                </span>
                <span className="sidebar-action-label">Contact</span>
              </a>
            </div>
          )}

          <div className="mobile-drawer-footer">
            <button
              type="button"
              onClick={closeMobileMenu}
              className={`mobile-drawer-close ${theme.toggleButton}`}
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </header>

      <aside className={`sidebar desktop-sidebar ${theme.sidebar}`}>
        <div className="sidebar-inner">
          <nav>
            {isHomePage && (
              <div className="nav-submenu">
                <NavLink
                  to="/"
                  end
                  onClick={scrollToTop}
                  className={`nav-sublink ${theme.sidebarSubLink}`}
                >
                  Home
                </NavLink>
                <a
                  href="#latest-projects"
                  onClick={() => handleSectionClick("latest-projects")}
                  className={getSectionLinkClass("latest-projects")}
                >
                  Projects
                </a>
                <a
                  href="#professional-experience"
                  onClick={() => handleSectionClick("professional-experience")}
                  className={getSectionLinkClass("professional-experience")}
                >
                  Experience
                </a>
                <a
                  href="#education"
                  onClick={() => handleSectionClick("education")}
                  className={getSectionLinkClass("education")}
                >
                  Education
                </a>
                <a
                  href="#skill-toolkit"
                  onClick={() => handleSectionClick("skill-toolkit")}
                  className={getSectionLinkClass("skill-toolkit")}
                >
                  Skills
                </a>
              </div>
            )}
            {!isHomePage && (
              <NavLink
                to="/"
                end
                onClick={scrollToTop}
                className={`nav-sublink ${theme.sidebarSubLink}`}
              >
                Home
              </NavLink>
            )}
          </nav>

          {showSidebarActions && (
            <div className="sidebar-actions">
              <a
                href="/Andy-Fanthome-CV.pdf"
                download
                className={`sidebar-action desktop-action-reveal ${getDesktopActionRevealClass(0)} download-cv-action ${theme.primaryButton}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  CV
                </span>
                <span className="sidebar-action-label">Download CV</span>
              </a>
              <a
                href="https://www.linkedin.com/in/andyfanthome/"
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-action desktop-action-reveal ${getDesktopActionRevealClass(1)} ${theme.sidebarAction}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Linkedin size={16} />
                </span>
                <span className="sidebar-action-label">LinkedIn</span>
              </a>
              <a
                href="https://github.com/sgafanth"
                target="_blank"
                rel="noopener noreferrer"
                className={`sidebar-action desktop-action-reveal ${getDesktopActionRevealClass(2)} ${theme.sidebarAction}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Github size={16} />
                </span>
                <span className="sidebar-action-label">GitHub</span>
              </a>
              <a
                href="mailto:fanthome.andy@gmail.com"
                className={`sidebar-action desktop-action-reveal ${getDesktopActionRevealClass(3)} ${theme.sidebarAction}`}
              >
                <span className="sidebar-action-icon" aria-hidden="true">
                  <Mail size={16} />
                </span>
                <span className="sidebar-action-label">Contact</span>
              </a>
            </div>
          )}
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/work-experience" element={<Navigate to="/#professional-experience" replace />} />
        </Routes>
      </main>

      <button
        type="button"
        className={`scroll-top-button ${showScrollTopButton ? "is-visible" : ""} ${theme.primaryButton}`}
        onClick={handleScrollToTopClick}
        aria-label="Scroll to top"
      >
        <ArrowUp size={28} />
      </button>
    </div>
  );
}

function RoutedLayout(props) {
  const { pathname } = useLocation();
  return <Layout key={pathname} {...props} />;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#232020" : "#FEF8F5";
  }, [darkMode]);

  return (
    <BrowserRouter>
      <RoutedLayout darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}

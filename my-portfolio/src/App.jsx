import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import Home from "./pages/Home";
import { getTheme } from "./theme";
import "./App.css";

function Layout({ darkMode, setDarkMode }) {
  const theme = getTheme(darkMode);
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToTop = () => {
    setActiveSection("");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };
  const sectionIds = isHomePage
    ? ["latest-projects", "skill-toolkit", "professional-experience", "education"]
    : [];
  const showSidebarActions = sectionIds.includes(activeSection);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveSection("");
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
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileMenuOpen);
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileMenuOpen]);

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", closeMenuOnDesktop);
    return () => window.removeEventListener("resize", closeMenuOnDesktop);
  }, []);

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };
  const getSectionLinkClass = (sectionId) =>
    `nav-sublink ${theme.sidebarSubLink} ${activeSection === sectionId ? theme.sidebarLinkActive : ""}`;

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
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
                  href="#skill-toolkit"
                  onClick={() => handleSectionClick("skill-toolkit")}
                  className={getSectionLinkClass("skill-toolkit")}
                >
                  Skill Toolkit
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
                  href="#skill-toolkit"
                  onClick={() => handleSectionClick("skill-toolkit")}
                  className={getSectionLinkClass("skill-toolkit")}
                >
                  Skills
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
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/work-experience" element={<Navigate to="/#professional-experience" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#232020" : "#FEF8F5";
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
    </BrowserRouter>
  );
}

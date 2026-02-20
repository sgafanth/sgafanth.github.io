
import { useEffect, useState } from "react";
import { getTheme } from "../theme";
import { Sun, Moon, ExternalLink, TrendingUp } from "lucide-react";

const EmergingSignalsExplorer = ({ darkMode, setDarkMode }) => {
  const theme = getTheme(darkMode);

  const [filters, setFilters] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Load available predefined filters ---
  useEffect(() => {
    fetch("/data/filters.json")
      .then((res) => res.json())
      .then((data) => setFilters(data))
      .catch(() => {});
  }, []);

  // --- Load ranked articles when filter selected ---
  const handleFilterClick = async (filter) => {
    setSelectedFilter(filter);
    setLoading(true);

    try {
      const res = await fetch(`/data/filter_rankings/${filter}.json`);
      const rankedArticles = await res.json();
      setArticles(rankedArticles.slice(0, 20));
    } catch {
      setArticles([]);
    }

    setLoading(false);
  };

  return (
    <div className={`page-offset min-h-screen ${theme.page} transition-colors duration-300 font-sans`}>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-5 right-5 md:top-5 md:bottom-auto md:right-8 z-50 p-4 rounded-full ${theme.toggleButton} transition-all shadow-lg`}
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Header */}
      <section className="pt-24 pb-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme.heading}`}>
            Emerging Signals Explorer [In Progress]
          </h1>
          <p className={`text-lg max-w-2xl ${theme.bodyMuted}`}>
            Clustering and trend analysis of emerging technology and risk signals.
            Select a predefined signal to explore the most relevant recent articles.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-xl font-semibold mb-6 ${theme.heading}`}>
            Predefined Signals
          </h2>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => handleFilterClick(filter.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.slug
                    ? theme.primaryButton
                    : theme.outlineButton
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">

          {selectedFilter && (
            <h3 className={`text-2xl font-bold mb-8 ${theme.heading}`}>
              Top Articles — {selectedFilter.replace(/-/g, " ")}
            </h3>
          )}

          {loading && (
            <div className={`text-sm ${theme.bodyMuted}`}>Loading articles...</div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl transition-all ${theme.projectCard}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className={`font-semibold text-lg ${theme.heading}`}>
                    {article.headline}
                  </h4>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={theme.iconLink}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                <p className={`text-sm mb-4 ${theme.bodyMuted}`}>
                  {article.snippet}
                </p>

                <div className={`text-xs font-medium ${theme.bodySubtle}`}>
                  {article.source} •{" "}
                  {new Date(article.published_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {!loading && selectedFilter && articles.length === 0 && (
            <div className={`text-sm mt-6 ${theme.bodyMuted}`}>
              No articles found for this signal.
            </div>
          )}
        </div>
      </section>

      {/* Future Trends Placeholder */}
      <section className={`py-20 px-6 md:px-8 ${theme.sectionSoftBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={22} className={theme.skillIcon1} />
            <h2 className={`text-2xl font-bold ${theme.heading}`}>
              Topic Trends (Coming Soon)
            </h2>
          </div>
          <p className={`${theme.bodyMuted} max-w-2xl`}>
            Time-series analysis of emerging themes and signal intensity over time.
            Trend visualisations will be integrated here.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-8 ${theme.footer}`}>
        <div className={`max-w-7xl mx-auto text-center text-sm ${theme.footerText}`}>
          © 2026 Andy Fanthome. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default EmergingSignalsExplorer;

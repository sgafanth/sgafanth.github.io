import { useEffect, useState } from "react";
import { getTheme } from "../theme";
import { Sun, Moon, ExternalLink, TrendingUp, Loader, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SIGNAL_EMBEDDINGS } from '../signal_embeddings';

const PREDEFINED_SIGNALS = [
  { slug: "new-technology-threats", name: "New Technology Threats" },
  { slug: "emerging-technology", name: "Emerging Technology Signals" },
  { slug: "tech-in-research", name: "Technology in Research" },
];




const TAG_OPTIONS = [
  "artificial intelligence",
  "technology",
  "security",
  "ai companies and products",
  "cybersecurity",
  "ai models and tools",
  "computing",
  "infrastructure and cloud",
  "emerging technology",
  "government",
];

const WORKER_URL = "https://horizon-search.fanthome-andrew.workers.dev/";

const EmergingSignalsExplorer = ({ darkMode, setDarkMode }) => {
  const theme = getTheme(darkMode);

  const [selectedSignal, setSelectedSignal] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // password
  const [searchKey, setSearchKey] = useState("");

  // Free-text search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  // Total volume chart
  const [volumeData, setVolumeData] = useState([]);
  const [volumeLoading, setVolumeLoading] = useState(true);

  // Tag chart
  const [selectedTag, setSelectedTag] = useState(TAG_OPTIONS[0]);
  const [tagData, setTagData] = useState([]);
  const [tagLoading, setTagLoading] = useState(false);

  // Fetch total article volume on mount
  useEffect(() => {
    const fetchVolume = async () => {
      try {
        const res = await fetch(WORKER_URL);
        if (!res.ok) throw new Error("Failed to fetch volume data");
        const data = await res.json();
        setVolumeData(
          data.results.map(({ day, count }) => ({
            date: new Date(day).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
            count,
          }))
        );
      } catch (e) {
        console.error("Volume fetch failed:", e);
      } finally {
        setVolumeLoading(false);
      }
    };
    fetchVolume();
  }, []);

  // Fetch tag-filtered data whenever selectedTag changes
  useEffect(() => {
    const fetchTagData = async () => {
      setTagLoading(true);
      try {
        const res = await fetch(`${WORKER_URL}?tag=${encodeURIComponent(selectedTag)}`);
        if (!res.ok) throw new Error("Failed to fetch tag data");
        const data = await res.json();
        setTagData(
          data.results.map(({ day, count }) => ({
            date: new Date(day).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
            count,
          }))
        );
      } catch (e) {
        console.error("Tag fetch failed:", e);
        setTagData([]);
      } finally {
        setTagLoading(false);
      }
    };
    fetchTagData();
  }, [selectedTag]);

  // Handle predefined signal button click
  const handleSignalClick = async (signal) => {
    if (selectedSignal?.slug === signal.slug) return;
    setSelectedSignal(signal);
    setSearchActive(false);
    setSearchQuery("");
    setLoading(true);
    setError(null);
    setArticles([]);

    try {
      const embedding = SIGNAL_EMBEDDINGS[signal.slug];
      if (!embedding || embedding.length === 0) {
        throw new Error("Embedding not yet configured for this signal.");
      }

      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedding, slug: signal.slug }),
      });

      if (!res.ok) throw new Error("Failed to fetch articles.");
      const data = await res.json();
      setArticles(data.results.slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle free-text search
  const handleFreeTextSearch = async (e) => {
    e.preventDefault();
    if (!searchKey) {
      setError("Enter access key to use free-text search.");
      return;
    }
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setSelectedSignal(null);
    setSearchActive(true);
    setLoading(true);
    setError(null);
    setArticles([]);

    try {
      const res = await fetch(`${WORKER_URL}?key=${encodeURIComponent(searchKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) throw new Error("Search failed. Please try again.");
      const data = await res.json();
      setArticles(data.results.slice(0, 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const chartTooltipStyle = {
    background: "var(--tooltip-bg, #1a1a1a)",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
  };

  const renderLineChart = (data) => (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
          axisLine={false}
          tickLine={false}
          width={25}
        />
        <Tooltip
          cursor={{ opacity: 0.1 }}
          contentStyle={chartTooltipStyle}
          formatter={(value) => [value, "Articles"]}
          labelFormatter={(label) => label}
        />
        <Line
          type="monotone"
          dataKey="count"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          stroke="currentColor"
          opacity={0.8}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const resultsTitle = searchActive
    ? `Top 10 — "${searchQuery.trim()}"`
    : selectedSignal
    ? `Top 10 — ${selectedSignal.name}`
    : null;

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
            Emerging Signals Explorer
          </h1>
          <p className={`text-lg max-w-2xl ${theme.bodyMuted}`}>
            Select a signal below or search by keyword to surface the most
            semantically relevant articles from this week's horizon scan.
          </p>
        </div>
      </section>


      {/* Signal Selector + Free-text Search */}
      <section className="px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-xl font-semibold mb-6 ${theme.heading}`}>
            Predefined Signals
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {PREDEFINED_SIGNALS.map((signal) => (
              <button
                key={signal.slug}
                onClick={() => handleSignalClick(signal)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedSignal?.slug === signal.slug
                    ? theme.primaryButton
                    : theme.outlineButton
                }`}
              >
                {signal.name}
              </button>
            ))}
          </div>

          <h2 className={`text-xl font-semibold mb-4 ${theme.heading}`}>
            Free-text Search
          </h2>
          <form onSubmit={handleFreeTextSearch} className="flex flex-wrap gap-3 max-w-2xl">
            <input
              type="password"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Access key"
              className={`w-36 px-4 py-2.5 rounded-lg text-sm border ${theme.outlineButton} bg-transparent`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. quantum computing breakthroughs"
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm border ${theme.outlineButton} bg-transparent placeholder-opacity-50`}
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${theme.primaryButton} disabled:opacity-40`}
            >
              <Search size={14} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">

          {resultsTitle && !loading && articles.length > 0 && (
            <h3 className={`text-2xl font-bold mb-8 ${theme.heading}`}>
              {resultsTitle}
            </h3>
          )}

          {loading && (
            <div className={`flex items-center gap-3 text-sm ${theme.bodyMuted}`}>
              <Loader size={16} className="animate-spin" />
              Finding most relevant articles...
            </div>
          )}

          {error && (
            <div className={`text-sm mt-2 ${theme.bodyMuted}`}>
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl flex flex-col gap-3 transition-all ${theme.projectCard}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className={`text-xs font-bold mt-1 opacity-40 ${theme.heading}`}>
                      #{idx + 1}
                    </span>
                    <h4 className={`font-semibold text-base leading-snug ${theme.heading}`}>
                      {article.title}
                    </h4>
                  </div>
                  <a
                    href={article.article_url_raw}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 mt-0.5 ${theme.iconLink}`}
                    title="Open article"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                <p className={`text-sm leading-relaxed ${theme.bodyMuted}`}>
                  {article.summary_clean?.length > 200
                    ? article.summary_clean.slice(0, 200) + "\u2026"
                    : article.summary_clean}
                </p>

                <div className={`flex items-center justify-between text-xs mt-auto pt-2 border-t ${theme.bodySubtle} border-opacity-20`}>
                  <span>
                    {article.article_url_raw
                      ? new URL(article.article_url_raw).hostname
                      : "Unknown source"}
                  </span>
                  <span>
                    {article.published_iso
                      ? new Date(article.published_iso).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {!loading && (selectedSignal || searchActive) && articles.length === 0 && !error && (
            <div className={`text-sm mt-6 ${theme.bodyMuted}`}>
              No articles found for this signal.
            </div>
          )}

        </div>
      </section>

      {/* Article Volume Chart */}
      <section className={`py-16 px-6 md:px-8 ${theme.sectionSoftBg}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={22} className={theme.skillIcon1} />
            <h2 className={`text-2xl font-bold ${theme.heading}`}>
              Article Volume by Day
            </h2>
          </div>

          {volumeLoading ? (
            <div className={`flex items-center gap-3 text-sm ${theme.bodyMuted}`}>
              <Loader size={16} className="animate-spin" />
              Loading article volume...
            </div>
          ) : volumeData.length > 0 ? (
            renderLineChart(volumeData)
          ) : (
            <p className={`${theme.bodyMuted} text-sm`}>No volume data available.</p>
          )}
        </div>
      </section>

      {/* Tag Volume Chart */}
      <section className={`py-16 px-6 md:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <TrendingUp size={22} className={theme.skillIcon1} />
              <h2 className={`text-2xl font-bold ${theme.heading}`}>
                Volume by Tag
              </h2>
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${theme.outlineButton} bg-transparent cursor-pointer`}
            >
              {TAG_OPTIONS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {tagLoading ? (
            <div className={`flex items-center gap-3 text-sm ${theme.bodyMuted}`}>
              <Loader size={16} className="animate-spin" />
              Loading tag data...
            </div>
          ) : tagData.length > 0 ? (
            renderLineChart(tagData)
          ) : (
            <p className={`${theme.bodyMuted} text-sm`}>No data for this tag.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-8 ${theme.footer}`}>
        <div className={`max-w-7xl mx-auto text-center text-sm ${theme.footerText}`}>
          &copy; 2026 Andy Fanthome. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default EmergingSignalsExplorer;
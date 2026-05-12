import { useState } from "react";
import { getTheme } from "../theme";
import { Sun, Moon, Loader, Flame, Info } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
} from "recharts";

const LAMBDA_URL =
  "https://hlvcu2tgs56nu3ygzzr4fdu6oi0rtqjz.lambda-url.eu-west-2.on.aws";

const ANNUAL_GAS_BIN_OPTIONS = [
  { value: 0, label: "< 5,000 kWh/yr (very low)" },
  { value: 1, label: "5,000–11,000 kWh/yr (low–medium)" },
  { value: 2, label: "11,000–17,000 kWh/yr (medium–high)" },
  { value: 3, label: "> 17,000 kWh/yr (high)" },
];

const DEFAULT_FORM = {
  lat: "51.5074",
  lon: "-0.1278",
  forecast_days: 30,
  annual_gas_bin: 1,
  residents: 2,
  occupied_days: 5,
  hometype: "flat",
  room_count: 4,
  total_floor_area: 60,
  bath: false,
  gasfire: false,
  gashob: true,
  gasoven: true,
  shower: true,
};

const APPLIANCES = [
  { key: "gashob",   label: "Gas Hob" },
  { key: "gasoven",  label: "Gas Oven" },
  { key: "gasfire",  label: "Gas Fire" },
  { key: "bath",     label: "Bath" },
  { key: "shower",   label: "Shower" },
];


const OVERLAY_OPTIONS = [
  { key: "temp",     label: "Temperature",    dataKey: "temp",       hasBand: true,  unit: "°C",   tickFmt: (v) => `${v}°`,  color: "#f43f5e" },
  { key: "wind",     label: "Wind Speed",     dataKey: "wind_speed", hasBand: false, unit: "m/s",  tickFmt: (v) => `${v}`,   color: "#3b82f6" },
  { key: "solar",    label: "Solar Radiation",dataKey: "solar_rad",  hasBand: false, unit: "W/m²", tickFmt: (v) => `${v}`,   color: "#f59e0b" },
  { key: "humidity", label: "Humidity",       dataKey: "humidity",   hasBand: false, unit: "%",    tickFmt: (v) => `${v}%`,  color: "#10b981" },
];

const FIELD_RULES = {
  lat:              { min: -90,  max: 90,  label: "Latitude",      integer: false },
  lon:              { min: -180, max: 180, label: "Longitude",     integer: false },
  forecast_days:    { min: 1,    max: 154, label: "Forecast days", integer: true  },
  residents:        { min: 1,    max: 6,   label: "Residents",     integer: true  },
  occupied_days:    { min: 1,    max: 7,   label: "Occupied days", integer: true  },
  room_count:       { min: 1,    max: 15,  label: "Rooms",         integer: true  },
  total_floor_area: { min: 0,    max: 200, label: "Floor area",    integer: false },
};

const validateField = (key, value) => {
  const rule = FIELD_RULES[key];
  if (!rule) return null;
  const num = parseFloat(value);
  if (value === "" || isNaN(num)) return `${rule.label} is required`;
  if (rule.integer && !Number.isInteger(num)) return `${rule.label} must be a whole number`;
  if (num < rule.min || num > rule.max) return `Must be between ${rule.min} and ${rule.max}`;
  return null;
};

// Aggregate a chunk of daily rows into a single weekly row.
const aggregateWeek = (days) => {
  const avg = (key) =>
    parseFloat((days.reduce((s, d) => s + d[key], 0) / days.length).toFixed(1));
  return {
    isoDate:    days[0].isoDate,
    date:       days[0].date,
    gas_kwh:    parseFloat(days.reduce((s, d) => s + d.gas_kwh, 0).toFixed(2)),
    temp:       avg("temp"),
    temp_band:  [
      Math.min(...days.map((d) => d.temp_band[0])),
      Math.max(...days.map((d) => d.temp_band[1])),
    ],
    wind_speed: avg("wind_speed"),
    solar_rad:  avg("solar_rad"),
    humidity:   avg("humidity"),
  };
};

const GasForecaster = ({ darkMode, setDarkMode }) => {
  const theme = getTheme(darkMode);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [granularity, setGranularity] = useState("daily");   // "daily" | "weekly"
  const [chartType, setChartType] = useState("line");          // "bar" | "line"
  const [formErrors, setFormErrors] = useState({});
  const [postcode, setPostcode] = useState("");
  const [postcodeLoading, setPostcodeLoading] = useState(false);
  const [postcodeError, setPostcodeError] = useState(null);

  const handlePostcodeLookup = async () => {
    const trimmed = postcode.trim().toUpperCase();
    if (!trimmed) return;
    setPostcodeLoading(true);
    setPostcodeError(null);
    try {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();
      if (!res.ok || data.status !== 200) {
        throw new Error(data.error || "Invalid postcode");
      }
      setField("lat", data.result.latitude.toFixed(4));
      setField("lon", data.result.longitude.toFixed(4));
    } catch (err) {
      setPostcodeError(err.message);
    } finally {
      setPostcodeLoading(false);
    }
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const formIsValid = Object.keys(FIELD_RULES).every(
    (key) => validateField(key, form[key]) === null
  );

  const handleSubmit = async () => {
    if (!gdprAccepted || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
        forecast_days: parseInt(form.forecast_days, 10),
        annual_gas_bin: parseInt(form.annual_gas_bin, 10),
        residents: parseInt(form.residents, 10),
        occupied_days: parseInt(form.occupied_days, 10),
        room_count: parseInt(form.room_count, 10),
        total_floor_area: parseFloat(form.total_floor_area),
      };

      const res = await fetch(`${LAMBDA_URL}/forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed (${res.status})`);
      }

      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Chart data derivation ---

  const dailyChartData = result?.daily.map((d) => {
    let zone = "ensemble";
    if (result.ensemble_cutoff && d.date > result.ensemble_cutoff) {
      zone =
        result.subseasonal_cutoff && d.date > result.subseasonal_cutoff
          ? "seasonal"
          : "subseasonal";
    }
    const q10 = parseFloat((d.gas_wh_q10 / 1000).toFixed(3));
    const q90 = parseFloat((d.gas_wh_q90 / 1000).toFixed(3));
    return {
      isoDate:      d.date,
      date:         new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      gas_kwh_q10:  q10,
      gas_kwh_q50:  parseFloat((d.gas_wh_q50 / 1000).toFixed(3)),
      gas_kwh_q90:  q90,
      gas_band:     [q10, q90],
      temp:         d.temp,
      temp_band:    [d.temp_min, d.temp_max],
      wind_speed:   d.wind_speed,
      solar_rad:    d.solar_rad,
      humidity:     d.humidity,
    };
  }) ?? null;

  const weeklyChartData = (() => {
    if (!dailyChartData) return null;

    const weeks = [];

    for (let i = 0; i + 6 < dailyChartData.length; i += 7) {
        weeks.push(
        aggregateWeek(dailyChartData.slice(i, i + 7))
        );
    }

    return weeks;
    })();

  const chartData = granularity === "weekly" ? weeklyChartData : dailyChartData;

  // X-axis: tick on the 1st of each month. For weekly, find the week whose
  // start date falls closest to the 1st (must be an exact data key).
  const monthStartTicks = (() => {
    if (!chartData) return [];
    if (granularity === "daily") {
      return chartData
        .filter((d) => new Date(d.isoDate).getDate() === 1)
        .map((d) => d.date);
    }
    // Weekly: for each calendar month present, pick the week-start closest to the 1st.
    const monthsPresent = [...new Set(chartData.map((d) => d.isoDate.slice(0, 7)))];
    return [...new Set(
      monthsPresent.map((ym) => {
        const target = new Date(`${ym}-01`).getTime();
        return chartData.reduce((best, d) =>
          Math.abs(new Date(d.isoDate) - target) <
          Math.abs(new Date(best.isoDate) - target)
            ? d
            : best
        ).date;
      })
    )];
  })();

  // Y-axis: ticks every 5 kWh up to the nearest 5 above the q90 max.
  const yTicks = (() => {
    if (!chartData) return [];
    const maxGas = Math.max(...chartData.map((d) => d.gas_kwh_q90));
    const ceil5 = Math.ceil(maxGas / 5) * 5;
    return Array.from({ length: Math.floor(ceil5 / 5) + 1 }, (_, i) => i * 5);
  })();

  // Map an ISO cutoff date to the nearest formatted date string in chartData.
  const toChartDate = (isoDate) => {
    if (!isoDate || !chartData) return null;
    if (granularity === "daily") {
      return chartData.find((d) => d.isoDate === isoDate)?.date ?? null;
    }
    for (let i = 0; i < chartData.length - 1; i++) {
      if (chartData[i].isoDate <= isoDate && isoDate < chartData[i + 1].isoDate) {
        return chartData[i].date;
      }
    }
    return chartData[chartData.length - 1].date;
  };

  const ensembleBoundary    = toChartDate(result?.ensemble_cutoff);

  // Only meaningful if the cutoff falls strictly before the last forecast day.
  const singleBoundary =
    ensembleBoundary && result.ensemble_cutoff < result.period_end
      ? ensembleBoundary
      : null;

  // Transparent ReferenceAreas used solely for centered confidence labels.
  const confidenceRegions = (() => {
    if (!chartData || chartData.length === 0) return [];
    if (!singleBoundary) {
      return [{ label: "Higher confidence", x1: undefined, x2: undefined }];
    }
    return [
      { label: "Higher confidence", x1: undefined,       x2: singleBoundary },
      { label: "Lower confidence",  x1: singleBoundary,  x2: undefined      },
    ];
  })();

  // Single dashed vertical line at the boundary.
  const cutoffLines = singleBoundary ? [singleBoundary] : [];

  const activeOverlay = OVERLAY_OPTIONS.find((o) => o.key === selectedOverlay) ?? null;

  const handleOverlayToggle = (key) =>
    setSelectedOverlay((prev) => (prev === key ? null : key));

  const tooltipStyle = {
    background: darkMode ? "#1a1a1a" : "#ffffff",
    border: "1px solid rgba(128,128,128,0.2)",
    borderRadius: "8px",
    fontSize: "12px",
  };

  const tooltipFormatter = (value, name) => {
    const suffix = granularity === "weekly" ? " (week)" : "";
    switch (name) {
      case "gas_kwh_q50": return [`${value} kWh`, `Gas median${suffix}`];
      case "gas_band":    return [`${value[0]} – ${value[1]} kWh`, `80% interval${suffix}`];
      case "temp":        return [`${value}°C`, "Mean temp"];
      case "temp_band":   return [`${value[0]}°C – ${value[1]}°C`, "Daily range"];
      case "wind_speed":  return [`${value} m/s`, "Wind speed"];
      case "solar_rad":   return [`${value} W/m²`, "Solar radiation"];
      case "humidity":    return [`${value}%`, "Humidity"];
      default:            return [value, name];
    }
  };

  // --- Shared style tokens ---
  const inputCls = `w-full px-4 py-2.5 rounded-lg text-sm border ${theme.outlineButton} bg-transparent`;
  const labelCls = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme.bodySubtle}`;
  const pillBtn = (active) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all ${active ? theme.primaryButton : theme.outlineButton}`;

  return (
    <div className={`page-offset min-h-screen ${theme.page} transition-colors duration-300 font-sans`}>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-5 right-5 md:top-5 md:bottom-auto md:right-8 z-50 p-4 rounded-full ${theme.toggleButton} transition-all shadow-lg`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Header */}
      <section className="pt-24 pb-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            
            <h1 className={`text-4xl md:text-5xl font-bold ${theme.heading}`}>
              Gas Usage Forecaster
            </h1>
          </div>
          <p className={`text-lg max-w-2xl ${theme.bodyMuted}`}>
            Enter your household details to receive a daily gas usage forecast
            of up to 22 weeks. Powered by a gradient boosted decision tree model trained on
            the{" "}
            <a
              href="https://doi.org/10.1038/s41597-021-00921-y"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 ${theme.iconLink}`}
            >
              IDEAL household energy dataset
            </a>
            {" "}(Pullinger et al., 2021) and weather data from the{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline underline-offset-2 ${theme.iconLink}`}
            >
              Open-Meteo API
            </a>
            {" "}(Zippenfenig, 2023).
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className={`p-8 rounded-2xl ${theme.projectCard}`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {/* Location & forecast horizon */}
              <div className="space-y-4">
                <h3 className={`text-base font-bold ${theme.heading}`}>Location</h3>

                {/* Postcode lookup */}
                <div>
                  <label className={labelCls}>Postcode (optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value);
                        setPostcodeError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handlePostcodeLookup()}
                      className={inputCls}
                      placeholder="e.g. SW1A 1AA"
                      maxLength={8}
                    />
                    <button
                      onClick={handlePostcodeLookup}
                      disabled={!postcode.trim() || postcodeLoading}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 flex items-center gap-1.5 ${theme.primaryButton} disabled:opacity-40`}
                    >
                      {postcodeLoading ? <Loader size={13} className="animate-spin" /> : "Look up"}
                    </button>
                  </div>
                  {postcodeError && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{postcodeError}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lat}
                    onChange={(e) => setField("lat", e.target.value)}
                    className={inputCls}
                    placeholder="e.g. 51.5074"
                  />
                  {formErrors.lat && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.lat}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.lon}
                    onChange={(e) => setField("lon", e.target.value)}
                    className={inputCls}
                    placeholder="e.g. -0.1278"
                  />
                  {formErrors.lon && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.lon}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Forecast Days (1–154, best accuracy within 35)</label>
                  <input
                    type="number"
                    min={1}
                    max={154}
                    value={form.forecast_days}
                    onChange={(e) => setField("forecast_days", e.target.value)}
                    className={inputCls}
                  />
                  {formErrors.forecast_days && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.forecast_days}</p>
                  )}
                </div>
              </div>

              {/* Household */}
              <div className="space-y-4">
                <h3 className={`text-base font-bold ${theme.heading}`}>Household</h3>
                <div>
                  <label className={labelCls}>Property Type</label>
                  <select
                    value={form.hometype}
                    onChange={(e) => setField("hometype", e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="flat">Flat</option>
                    <option value="house_or_bungalow">House or Bungalow</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Number of Rooms (1–15)</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={form.room_count}
                    onChange={(e) => setField("room_count", e.target.value)}
                    className={inputCls}
                  />
                  {formErrors.room_count && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.room_count}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Floor Area m² (0–200)</label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    step={1}
                    value={form.total_floor_area}
                    onChange={(e) => setField("total_floor_area", e.target.value)}
                    className={inputCls}
                  />
                  {formErrors.total_floor_area && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.total_floor_area}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Annual Gas Usage</label>
                  <select
                    value={form.annual_gas_bin}
                    onChange={(e) => setField("annual_gas_bin", e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    {ANNUAL_GAS_BIN_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Occupancy & appliances */}
              <div className="space-y-4">
                <h3 className={`text-base font-bold ${theme.heading}`}>Occupancy & Appliances</h3>
                <div>
                  <label className={labelCls}>Residents (1–6)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={form.residents}
                    onChange={(e) => setField("residents", e.target.value)}
                    className={inputCls}
                  />
                  {formErrors.residents && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.residents}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Days Occupied per Week (1–7)</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={form.occupied_days}
                    onChange={(e) => setField("occupied_days", e.target.value)}
                    className={inputCls}
                  />
                  {formErrors.occupied_days && (
                    <p className={`mt-1.5 text-xs ${theme.bodyMuted}`}>{formErrors.occupied_days}</p>
                  )}
                </div>
                <div className="space-y-2 pt-1">
                  <label className={labelCls}>Appliances Present</label>
                  {APPLIANCES.map(({ key, label }) => (
                    <label
                      key={key}
                      className={`flex items-center gap-2 text-sm cursor-pointer ${theme.body}`}
                    >
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => setField(key, e.target.checked)}
                        className="rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* GDPR notice */}
            <div className={`mt-8 p-4 rounded-xl border ${theme.outlineButton} flex items-start gap-3`}>
              <Info size={16} className={`mt-0.5 shrink-0 ${theme.bodySubtle}`} />
              <div className="flex-1">
                <p className={`text-xs leading-relaxed ${theme.bodyMuted}`}>
                  Your household inputs (location, property details, appliance configuration) will
                  be sent to a cloud API to generate your forecast. No data is stored or logged.
                  By submitting, you consent to this processing.
                </p>
                <label className={`flex items-center gap-2 mt-3 text-sm cursor-pointer ${theme.body}`}>
                  <input
                    type="checkbox"
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="rounded"
                  />
                  I understand and consent
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <button
                onClick={handleSubmit}
                disabled={!gdprAccepted || loading || !formIsValid}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${theme.primaryButton} disabled:opacity-40`}
              >
                {loading ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Forecasting… (may take ~10s on first run)
                  </>
                ) : (
                  <>
                    Generate Forecast
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className={`mt-4 text-sm ${theme.bodyMuted}`}>Error: {error}</p>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      {result && chartData && (
        <section className={`py-12 px-6 md:px-8 ${theme.sectionSoftBg}`}>
          <div className="max-w-7xl mx-auto">

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div>
                <div className={`text-2xl font-bold mb-1 ${theme.heading}`}>
                  {result.total_kwh.toFixed(1)} kWh
                </div>
                <div className={`text-sm font-semibold ${theme.bodySubtle}`}>Total forecast gas</div>
              </div>
              <div>
                <div className={`text-2xl font-bold mb-1 ${theme.heading}`}>
                  {result.forecast_days} days
                </div>
                <div className={`text-sm font-semibold ${theme.bodySubtle}`}>Forecast period</div>
              </div>
              <div>
                <div className={`text-2xl font-bold mb-1 ${theme.heading}`}>
                  {new Date(result.period_start).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
                <div className={`text-sm font-semibold ${theme.bodySubtle}`}>Period start</div>
              </div>
              <div>
                <div className={`text-2xl font-bold mb-1 ${theme.heading}`}>
                  {new Date(result.period_end).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
                <div className={`text-sm font-semibold ${theme.bodySubtle}`}>Period end</div>
              </div>
            </div>

            {/* Chart controls */}
            <div className="flex flex-wrap gap-6 mb-6 items-center">
              <div className="flex gap-2">
                <button onClick={() => setGranularity("daily")}  className={pillBtn(granularity === "daily")}>Daily</button>
                <button onClick={() => setGranularity("weekly")} className={pillBtn(granularity === "weekly")}>Weekly</button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setChartType("bar")}  className={pillBtn(chartType === "bar")}>Bar</button>
                <button onClick={() => setChartType("line")} className={pillBtn(chartType === "line")}>Line</button>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={chartData} margin={{ top: 28, right: 20, left: 0, bottom: 0 }}>

                <CartesianGrid
                  vertical={false}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />

                {/* Transparent areas used only to render centered confidence labels */}
                {confidenceRegions.map(({ label, x1, x2 }) => (
                  <ReferenceArea
                    key={label}
                    x1={x1}
                    x2={x2}
                    yAxisId="gas"
                    fill="transparent"
                    strokeOpacity={0}
                    label={{
                      value: label,
                      position: "insideTop",
                      fontSize: 10,
                      fill: "currentColor",
                      opacity: 0.45,
                    }}
                  />
                ))}

                {/* Dashed vertical lines at each weather-model cutoff */}
                {cutoffLines.map((date) => (
                  <ReferenceLine
                    key={date}
                    x={date}
                    yAxisId="gas"
                    stroke="currentColor"
                    strokeOpacity={0.35}
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                  />
                ))}

                <XAxis
                  dataKey="date"
                  ticks={monthStartTicks}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="gas"
                  ticks={yTicks}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                  axisLine={false}
                  tickLine={false}
                  width={50}
                  tickFormatter={(v) => `${v}kWh`}
                />
                <YAxis
                  yAxisId="overlay"
                  orientation="right"
                  hide={!activeOverlay}
                  tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
                  axisLine={false}
                  tickLine={false}
                  width={activeOverlay ? 42 : 0}
                  tickFormatter={activeOverlay?.tickFmt}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />

                {chartType === "bar" ? (
                  <Bar
                    yAxisId="gas"
                    dataKey="gas_kwh_q50"
                    fill="rgba(99,102,241,0.55)"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={granularity === "weekly" ? 28 : 14}
                  />
                ) : (
                  <>
                    <Area
                      yAxisId="gas"
                      type="monotone"
                      dataKey="gas_band"
                      fill="rgba(99,102,241,0.12)"
                      stroke="none"
                      dot={false}
                      activeDot={false}
                      legendType="none"
                    />
                    <Line
                      yAxisId="gas"
                      type="monotone"
                      dataKey="gas_kwh_q50"
                      stroke="rgba(99,102,241,0.9)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </>
                )}

                {activeOverlay?.hasBand && (
                  <Area
                    yAxisId="overlay"
                    type="monotone"
                    dataKey="temp_band"
                    fill={`${activeOverlay.color}28`}
                    stroke="none"
                    dot={false}
                    activeDot={false}
                    legendType="none"
                  />
                )}

                {activeOverlay && (
                  <Line
                    yAxisId="overlay"
                    type="monotone"
                    dataKey={activeOverlay.dataKey}
                    stroke={activeOverlay.color}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}

              </ComposedChart>
            </ResponsiveContainer>

            {/* Overlay toggle buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {OVERLAY_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleOverlayToggle(opt.key)}
                  className={pillBtn(selectedOverlay === opt.key)}
                >
                  {opt.label}
                  {selectedOverlay === opt.key && (
                    <span className="ml-1.5 opacity-60 text-xs">({opt.unit})</span>
                  )}
                </button>
              ))}
            </div>

            <p className={`text-xs mt-4 ${theme.bodySubtle}`}>
              Gas usage on the left axis. Select a weather overlay to display on the right axis.
              Gas usage shows a median forecast line with a shaded 80% confidence interval based on the model's uncertainty.
              For temperature, the shaded band shows the daily high/low range.
              Dashed lines mark weather model boundaries - confidence decreases further into the future.
              Weekly view shows summed gas and averaged weather per 7-day period.
            </p>
            <p className={`text-xs mt-2 ${theme.bodySubtle}`}>
              Weather data by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline underline-offset-2 ${theme.iconLink}`}
              >
                Open-Meteo.com
              </a>
              , licensed under{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline underline-offset-2 ${theme.iconLink}`}
              >
                CC BY 4.0
              </a>
              .
            </p>

          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-8 px-8 ${theme.footer}`}>
        <div className={`max-w-7xl mx-auto text-center text-sm ${theme.footerText}`}>
          © 2026 Andy Fanthome. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GasForecaster;
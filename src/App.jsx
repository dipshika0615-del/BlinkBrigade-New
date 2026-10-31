
import { useEffect, useState, useRef } from "react";
import "./App.css";

const getSavedValue = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};
function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [blinkRate, setBlinkRate] = useState(16);
  const [eyeClosure, setEyeClosure] = useState(180);
  const [threshold, setThreshold] = useState(() => getSavedValue("blinkThreshold", 15));

const [history, setHistory] = useState(() =>
  getSavedValue("blinkHistory", [16, 18, 15, 20, 17, 14])
);

const [closureHistory, setClosureHistory] = useState(() =>
  getSavedValue("closureHistory", [180, 190, 165, 210, 175])
);

const [notifications, setNotifications] = useState(() =>
  getSavedValue("blinkNotifications", [])
);
const lastAlertTime = useRef(0);

const [totalBlinks, setTotalBlinks] = useState(() =>
  getSavedValue("totalBlinks", 0)
);36


const [sessionSeconds, setSessionSeconds] = useState(() =>
  getSavedValue("sessionSeconds", 0)
);
  // Automatically save application data
useEffect(() => {
  localStorage.setItem("blinkRate", JSON.stringify(blinkRate));
  localStorage.setItem("eyeClosure", JSON.stringify(eyeClosure));
  localStorage.setItem("blinkThreshold", JSON.stringify(threshold));
  localStorage.setItem("blinkHistory", JSON.stringify(history));
  localStorage.setItem("closureHistory", JSON.stringify(closureHistory));
  localStorage.setItem("blinkNotifications", JSON.stringify(notifications));
  localStorage.setItem("totalBlinks", JSON.stringify(totalBlinks));
  localStorage.setItem("sessionSeconds", JSON.stringify(sessionSeconds));
}, [
  blinkRate,
  eyeClosure,
  threshold,
  history,
  closureHistory,
  notifications,
  totalBlinks,
  sessionSeconds
]);

  // Demo data generator. Replace with real sensor input during hardware integration.
  useEffect(() => {
    if (!isMonitoring) return;

    const timer = setInterval(() => {
      const rate = Math.floor(Math.random() * 15) + 10;
      const closure = Math.floor(Math.random() * 180) + 120;

      setBlinkRate(rate);
      setEyeClosure(closure);
      setTotalBlinks((old) => old + (rate * 4) / 60);
      setSessionSeconds((old) => old + 4);

      setHistory((old) => [...old.slice(-11), rate]);
      setClosureHistory((old) => [...old.slice(-11), closure]);

      if (rate < threshold && Date.now() - lastAlertTime.current >= 30000) {
        lastAlertTime.current = Date.now();
        setNotifications((old) => [
          {
            id: Date.now(),
            message: `Low blink rate detected: ${rate} BPM`,
            time: new Date().toLocaleTimeString(),
            type: "warning",
          },
          ...old,
        ].slice(0, 30));
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [isMonitoring, threshold]);

  const navigation = [
    { name: "Dashboard", icon: "▦" },
    { name: "Blink Monitoring", icon: "◉" },
    { name: "Eye Closure", icon: "◉" },
    { name: "Analytics", icon: "▥" },
    { name: "Alerts", icon: "♧" },
    { name: "Device Status", icon: "⌘" },
    { name: "Settings", icon: "⚙" },
  ];

  const averageBlink =
    history.length > 0
      ? (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1)
      : 0;

  const averageClosure =
    closureHistory.length > 0
      ? Math.round(
          closureHistory.reduce((a, b) => a + b, 0) /
            closureHistory.length
        )
      : 0;

  function StatCard({ title, value, unit, description, color }) {
    return (
      <div className="stat-card">
        <div className="stat-top">
          <span>{title}</span>
          <span className={`stat-icon ${color}`}>◉</span>
        </div>
        <h2>{value} <small>{unit}</small></h2>
        <p>{description}</p>
        <span className="stat-note">Demo reading</span>
      </div>
    );
  }

  function ActivityChart({ data, unit = "BPM" }) {
    const maximum = Math.max(...data, 1);

    return (
      <div className="chart">
        {data.map((value, index) => (
          <div className="bar-column" key={index}>
            <div
              className="bar"
              title={`${value} ${unit}`}
              style={{
                height: `${Math.max((value / maximum) * 100, 5)}%`,
              }}
            />
            <span>{index + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  function PageHeading({ title, description }) {
    return (
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="live-indicator">
          <span className="green-dot" />
          {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
        </span>
      </div>
    );
  }

  const exportCSV = () => {
  const rows = [
    ["Sample", "Blink Rate (BPM)", "Eye Closure (ms)"]
  ];

  const count = Math.max(history.length, closureHistory.length);

  for (let i = 0; i < count; i++) {
    rows.push([
      i + 1,
      history[i] ?? "",
      closureHistory[i] ?? ""
    ]);
  }

  const csvContent = rows.map(row => row.join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "BlinkBrigade_Report.csv";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

setTimeout(() => {
  URL.revokeObjectURL(url);
}, 1000);
};
  function renderDashboard() {
    return (
      <>
        <section className="welcome-banner">
          <div>
            <h2>Welcome to BlinkBrigade!</h2>
            <p>
              Your personal eye-health monitoring dashboard.
              Stay aware of your blinking patterns.
            </p>
          </div>
          <div className="eye-illustration">👁️</div>
        </section>

        <PageHeading
          title="Live Monitoring Overview"
          description="Your current eye activity statistics"
        />

        <section className="stats-grid">
          <StatCard title="Blink Rate" value={blinkRate} unit="BPM"
            description="Blinks per minute" color="purple" />
          <StatCard title="Eye Closure" value={eyeClosure} unit="ms"
            description="Closure duration" color="blue" />
          <StatCard title="Average Blink Rate" value={averageBlink}
            unit="BPM" description="Recent sample average" color="green" />
          <StatCard title="Device Status" value="Offline"
            unit="" description="Hardware not connected" color="orange" />
        </section>

        <section className="content-grid">
          <div className="panel chart-panel">
            <div className="panel-header">
              <div>
                <h3>Blink Activity</h3>
                <p>Recent simulated readings</p>
              </div>
              <span className="chart-tag">DEMO DATA</span>
            </div>
            <ActivityChart data={history} />
            <div className="chart-footer">
              <span>Recent samples</span>
              <span>Blinks per minute</span>
            </div>
          </div>

          <div className="panel monitoring-panel">
            <div className="panel-header">
              <div>
                <h3>Monitoring Control</h3>
                <p>Manage your monitoring session</p>
              </div>
            </div>
            <div className="monitor-circle">
              <div className="monitor-inner">
                <span>◉</span>
                <strong>{isMonitoring ? "ON" : "OFF"}</strong>
                <small>Monitoring</small>
              </div>
            </div>
            <button
              className={isMonitoring ? "pause-btn" : "start-btn"}
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? "Pause Monitoring" : "Start Monitoring"}
            </button>
            <p className="monitor-info">
              {isMonitoring ? "Updating every 4 seconds" : "Monitoring paused"}
            </p>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Recent Alerts</h3>
                <p>Latest notifications</p>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="empty-state">
                <span>✓</span>
                <p>No new alerts</p>
              </div>
            ) : notifications.slice(0, 4).map((item) => (
              <div className="alert-item" key={item.id}>
                <span className="alert-dot" />
                {item.message}
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>Session Summary</h3>
                <p>Current demonstration session</p>
              </div>
            </div>
            <div className="device-row">
              <span>Total simulated blinks
          
              </span>
              <strong>{Math.floor(totalBlinks)}</strong>
            </div>
            <div className="device-row">
              <span>Session duration</span>
              <strong>{Math.floor(sessionSeconds / 60)} min {sessionSeconds % 60} sec</strong>
            </div>
            <div className="device-row">
              <span>Average closure</span>
              <strong>{averageClosure} ms</strong>
            </div>
          </div>
        </section>
      </>
    );
  }

  function renderBlinkMonitoring() {
    return (
      <>
        <PageHeading title="Blink Monitoring"
          description="Monitor blink frequency and activity." />

        <section className="stats-grid">
          <StatCard title="Current Blink Rate" value={blinkRate}
            unit="BPM" description="Latest demo reading" color="purple" />
          <StatCard title="Average Rate" value={averageBlink}
            unit="BPM" description="Recent sample average" color="green" />
          <StatCard title="Total Blinks" value={Math.round(totalBlinks)}
            unit="" description="Session estimate" color="blue" />
          <StatCard title="Threshold" value={threshold}
            unit="BPM" description="Configured alert threshold" color="orange" />
        </section>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Blink Rate History</h3>
              <p>Latest simulated blink-rate readings</p>
            </div>
            <span className="chart-tag">DEMO DATA</span>
          </div>
          <ActivityChart data={history} />
        </div>

        <div className="panel action-panel">
          <h3>Monitoring Controls</h3>
          <p>
            Current status: <strong>{isMonitoring ? "Active" : "Paused"}</strong>
          </p>
          <button
            className={isMonitoring ? "pause-btn" : "start-btn"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? "Pause Monitoring" : "Resume Monitoring"}
          </button>
          <p className="monitor-info">
            Readings update every four seconds while monitoring is active.
          </p>
        </div>
      </>
    );
  }

  function renderEyeClosure() {
    return (
      <>
        <PageHeading title="Eye Closure Monitoring"
          description="View the duration of detected closure events (simulated)." />

        <section className="stats-grid">
          <StatCard title="Latest Closure" value={eyeClosure}
            unit="ms" description="Latest demo reading" color="blue" />
          <StatCard title="Average Closure" value={averageClosure}
            unit="ms" description="Recent sample average" color="purple" />
          <StatCard title="Minimum Sample" value={Math.min(...closureHistory)}
            unit="ms" description="Recent samples" color="green" />
          <StatCard title="Maximum Sample" value={Math.max(...closureHistory)}
            unit="ms" description="Recent samples" color="orange" />
        </section>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Closure Duration History</h3>
              <p>Recent simulated closure durations</p>
            </div>
            <span className="chart-tag">DEMO DATA</span>
          </div>
          <ActivityChart data={closureHistory} unit="ms" />
        </div>
      </>
    );
  }

  function renderAnalytics() {
    return (
      <>
        <PageHeading title="Analytics"
          description="Statistical overview of recent demonstration data." />
          <div className="action-panel">
  <button className="small-action" onClick={exportCSV}>
    <span>⬇</span> Download CSV
  </button>
</div>
        
        <section className="stats-grid">
          <StatCard title="Average Blink Rate" value={averageBlink}
            unit="BPM" description="Recent samples" color="purple" />
          <StatCard title="Average Closure" value={averageClosure}
            unit="ms" description="Recent samples" color="blue" />
          <StatCard title="Highest Blink Rate" value={Math.max(...history)}
            unit="BPM" description="Recent samples" color="green" />
          <StatCard title="Lowest Blink Rate" value={Math.min(...history)}
            unit="BPM" description="Recent samples" color="orange" />
        </section>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Blink Rate Analysis</h3>
              <p>Recent readings in BPM</p>
            </div>
            <span className="chart-tag">DEMO DATA</span>
          </div>
          <ActivityChart data={history} />
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Eye Closure Analysis</h3>
              <p>Recent readings in milliseconds</p>
            </div>
          </div>
          <ActivityChart data={closureHistory} unit="ms" />
        </div>
      </>
    );
  }

  function renderAlerts() {
    return (
      <>
        <PageHeading title="Alerts & Notifications"
          description={`Warnings are generated when blink rate falls below ${threshold} BPM.`} />

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Notification History</h3>
              <p>{notifications.length} alert(s) recorded in this session</p>
            </div>
            <button
              className="small-action"
              onClick={() => setNotifications([])}
            >
              Clear Alerts
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="empty-state">
              <span>✓</span>
              <p>No alerts recorded</p>
              <small>Low blink-rate alerts will appear here.</small>
            </div>
          ) : notifications.map((item) => (
            <div className="alert-item" key={item.id}>
              <span className="alert-dot" />
              <div>
                <strong>{item.message}</strong>
                <p className="monitor-info">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  function renderDeviceStatus() {
    return (
      <>
        <PageHeading title="Device Status"
          description="Hardware connection and communication information." />

        <div className="panel">
          <h3>Hardware Connection Details</h3>
          {[
            ["IR Eye Blink Sensor", "Not connected"],
            ["Microcontroller", "Not connected"],
            ["Bluetooth Module", "Not connected"],
            ["Live Sensor Data", "Unavailable"],
          ].map(([name, status]) => (
            <div className="device-row" key={name}>
              <span>{name}</span>
              <strong className="disconnected">{status}</strong>
            </div>
          ))}
          <p className="device-note">
            This application is currently using simulated data.
            Connect and configure the actual hardware before expecting
            live sensor readings.
          </p>
        </div>
      </>
    );
  }

  function renderSettings() {
    return (
      <>
        <PageHeading title="Settings"
          description="Configure your demonstration monitoring preferences." />

        <div className="panel settings-panel">
          <h3>Blink Rate Alert Threshold</h3>
          <p>
            Generate a warning whenever a simulated reading falls below
            your selected threshold.
          </p>

          <div className="threshold-value">{threshold} BPM</div>

          <input
            type="range"
            min="5"
            max="30"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />

          <div className="range-labels">
            <span>5 BPM</span>
            <span>30 BPM</span>
          </div>

          <div className="device-row">
            <span>Monitoring interval</span>
            <strong>4 seconds</strong>
          </div>

          <div className="device-row">
            <span>Data source</span>
            <strong>Simulated</strong>
          </div>
        </div>
      </>
    );
  }

  const pageContent = {
    Dashboard: renderDashboard,
    "Blink Monitoring": renderBlinkMonitoring,
    "Eye Closure": renderEyeClosure,
    Analytics: renderAnalytics,
    Alerts: renderAlerts,
    "Device Status": renderDeviceStatus,
    Settings: renderSettings,
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">B</div>
          <div>
            <h2>BlinkBrigade</h2>
            <span>Eye Health Monitor</span>
          </div>
        </div>

        <p className="menu-heading">MAIN MENU</p>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">D</div>
          <div>
            <strong>My Profile</strong>
            <span>Eye Health User</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {activePage}</p>
            <h1>{activePage}</h1>
            <p className="subtitle">
              Monitor your blinking activity and maintain healthy screen habits.
            </p>
          </div>

          <div className="topbar-right">
            <span className="demo-label">DEMO MODE</span>
            <div className="user-avatar">D</div>
          </div>
        </header>

        {pageContent[activePage]()}

        <footer>
          BlinkBrigade © 2026 | Eye Health Monitoring System
          <span>Prototype – Simulated Data Only</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

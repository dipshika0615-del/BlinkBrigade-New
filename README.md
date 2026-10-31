# BlinkBrigade – Eye Health Monitoring System

## 1. Project Overview

BlinkBrigade is a software-based eye health monitoring dashboard designed to help users observe their blinking patterns during prolonged screen usage.

The system displays blink rate, eye closure duration, activity history, analytics, and alerts. It is designed for future integration with an IR eye-blink sensor and Arduino Uno.

**Current version:** Software prototype (Demo Mode)

## 2. Objectives

- Monitor blinking frequency.
- Display eye closure duration.
- Identify low blink-rate conditions.
- Generate alerts when the blink rate falls below a configured threshold.
- Visualize blinking activity through charts.
- Export monitoring data as a CSV file.
- Prepare the software for future hardware integration.

## 3. Features

- Dashboard with monitoring statistics.
- Blink Monitoring page.
- Eye Closure analysis.
- Analytics and activity charts.
- Alert notifications.
- Device Status page.
- Configurable blink-rate threshold.
- CSV report download.

## 4. Technologies Used

- React.js
- JavaScript
- Vite
- HTML
- CSS
- Node.js and npm
- Visual Studio Code

## 5. Project Structure

```text
BlinkBrigade-New/
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 6. Installation and Execution

### Prerequisites

- Node.js
- npm
- Visual Studio Code

### Steps

1. Download or clone the project.
2. Open the project folder in Visual Studio Code.
3. Open the integrated terminal.
4. Install the dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173/
```

## 7. Hardware Integration – Future Scope

The proposed hardware version will use:

- Arduino Uno
- IR eye-blink sensor
- Bluetooth communication module
- Connecting wires
- Power supply

The sensor will detect eye-blink activity and transmit readings to the software interface. Hardware integration has not yet been completed.

## 8. Current Project Status

The software dashboard is implemented as a demonstration prototype. The displayed readings are simulated and should not be treated as actual sensor measurements.

Hardware integration, real-time sensor data acquisition, and physical device testing are planned for future development.

## 9. Future Enhancements

- Integrate the Arduino Uno and IR sensor.
- Receive real-time blink data.
- Improve alert accuracy.
- Store monitoring history.
- Generate detailed eye activity reports.
- Develop a mobile application.
- Conduct hardware testing and validation.

## 10. Conclusion

BlinkBrigade aims to provide an accessible platform for monitoring blinking activity and promoting awareness of healthy screen-use habits. The current software prototype establishes the foundation for future sensor-based eye health monitoring.
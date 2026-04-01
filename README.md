# 🛰️ Orbital Satellite Tracker

**Orbital Satellite Tracker** is a high-fidelity, real-time satellite tracking and orbital communication simulation platform. Built with a "Brutalist-Tech" aesthetic, it provides an immersive experience for monitoring global satellite networks and simulating telemetry downlinks.

---

## 🚀 Key Features

### 🌍 Real-Time Tracking
Live propagation of satellite orbits using **SGP4 algorithms** and **TLE (Two-Line Element)** data. Watch as hundreds of satellites traverse the globe in real-time.

### 🔮 Interactive 3D Globe
A high-performance visualization of Earth with:
- Dynamic lighting and atmospheric effects.
- Night-sky background with starfield.
- Smooth camera controls and auto-rotation.

### 🛤️ Orbital Trails
Visual representation of the **last 30 minutes of flight history** for every tracked asset. See the orbital inclination and path of any satellite at a glance.

### 📂 Satellite Intelligence
Detailed dossiers for each satellite, including:
- **Mission Description**: Purpose and constellation details.
- **Frequency Data**: Communication bands (Ku-Band, L-Band, etc.).
- **Operational Status**: Real-time health monitoring.

### 💻 Communication Simulation
An interactive terminal interface to simulate:
- Data downlinks and telemetry requests.
- Secure handshakes and protocol initialization.
- Command execution (PING, STATUS, TELEMETRY, DOWNLINK).

### 📊 Global Dashboard
A real-time telemetry feed and network status overview:
- Global coverage percentage.
- Network load monitoring (GB/s).
- Signal strength indicators.

---

## 📸 Screenshots

The application features a high-fidelity 3D globe and a brutalist command terminal. You can view the live application at the following links:

- **Live Development Preview**: [App URL](https://ais-dev-rpnz2zozjlnkh72so5tfdb-575635219348.asia-east1.run.app)
- **Shared Application**: [Shared App URL](https://ais-pre-rpnz2zozjlnkh72so5tfdb-575635219348.asia-east1.run.app)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Visualization**: react-globe.gl, Three.js
- **Orbital Physics**: satellite.js (SGP4/SDP4)
- **Mobile Bridge**: Capacitor 7
- **Icons**: Lucide React

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- npm

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/orbital-satellite-tracker.git
   cd orbital-satellite-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Web
Generate a production-ready static build in the `dist/` folder:
```bash
npm run build
```

### Building for Android
1. Build the web project:
   ```bash
   npm run build
   ```
2. Sync with Capacitor:
   ```bash
   npx cap sync android
   ```
3. Open in Android Studio:
   ```bash
   npx cap open android
   ```
4. Build the APK/AAB from Android Studio.

---

## 🤖 GitHub Actions

This project includes a GitHub Actions workflow to automatically generate an Android APK on every push to the `main` branch.

- **Workflow File**: `.github/workflows/android-build.yml`
- **Artifacts**: The generated `app-debug.apk` is available in the **Actions** tab of your GitHub repository after a successful run.

---

## 📜 License
This project is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ for orbital enthusiasts.*

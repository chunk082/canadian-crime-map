# 🇨🇦 Canadian Crime Statistics Map

### Leaflet • GeoJSON • Statistics Canada

An interactive web application that visualizes **police-reported crime statistics across Canadian provinces** using **Leaflet**, **GeoJSON**, and data from **Statistics Canada**.

Users select a **year**, **crime/violation type**, and **province**. The map automatically **zooms to the selected province** and displays the corresponding crime value (actual incidents) in a centered popup. Provinces are colored in a choropleth style based on the selected crime data.

---

## ✨ Features

- 🗺️ Interactive Leaflet map of Canada
- 📍 Province-level boundaries using GeoJSON
- 🔍 Dropdown filters for year, crime type, and province selection
- 🎨 Choropleth coloring of provinces based on crime values
- 🔄 Live data fetched from Statistics Canada (via proxy)
- 🎯 Automatic zoom to selected province with centered popup
- ⚠️ Graceful handling of unavailable or missing data
- ⚡ Node.js/Express API proxy to bypass CORS restrictions

---

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript (ES6+)
- Leaflet.js
- OpenStreetMap tiles

**Backend**
- Node.js
- Express.js
- Proxy for Statistics Canada Web Data Service (vector API)

**Data Sources**
- Canada Provinces GeoJSON: [codeforamerica/click_that_hood](https://github.com/codeforamerica/click_that_hood) or similar public sources
- Statistics Canada: Police-reported crime statistics (Table 35-10-0177-01, actual incidents by province and violation)

---


---

## 🚀 Installation & Setup (Live Server)

Follow the steps below to run the project locally using **VS Code Live Server**.

---

### ✅ Prerequisites

Make sure you have the following installed:

- **Node.js (v18 or higher recommended)**  
  https://nodejs.org/

- **Visual Studio Code**  
  https://code.visualstudio.com/

- **Live Server extension for VS Code**  
  https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

- A modern web browser (Chrome, Firefox, Edge)

Verify Node.js installation:

```node -v npm -v```

**Clone Repo**

```git clone https://github.com/chunk082/canadian-crime-map.git```

```cd canadian-crime-map```

**Install Backend Dependencies**

```cd server```

```npm install```

**Start Node Server API**

```node server.js```
If successfull you should see 
```Server running on http://localhost:3000```

**Start the Frontend with Live Server**
1. Open the project folder in VS Code
2. Navigate to the public directory
3. Right-click index.html
4. Select ```Open with Live Server```

### FAQ

I keep getting this error ```EADDRINUSE: address already in use :::3000```
Answer: That error means that port 3000 is being used by another application

## Fix 1

Open Terminal run
```lsof -i :3000```

You will output (exmaple) 

```node   93528  chunk   ... TCP *:3000 (LISTEN)```

You you need to kill that process.. 

run ```kill -9 93528```
(replace ```93528``` with your respected pod)

## Fix 2 

1. Open server.js
2. Look for ```const PORT = 3000```
3. Change the port number
4. Save
5. run node server.js


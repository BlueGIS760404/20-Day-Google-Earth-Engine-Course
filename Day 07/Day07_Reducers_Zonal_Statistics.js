// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟳: 𝗥𝗲𝗱𝘂𝗰𝗲𝗿𝘀 & 𝗭𝗼𝗻𝗮𝗹 𝗦𝘁𝗮𝘁𝗶𝘀𝘁𝗶𝗰𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand what reducers are and why they are powerful
// • Learn how to calculate mean, median, stdDev, min, max, and percentiles
// • Use reduceRegion for statistics over a single geometry
// • Use reduceRegions for statistics over multiple features
// • Extract and interpret zonal statistics
// ═══════════════════════════════════════════════════════════════

// ─── 1. DEFINE STUDY AREA ─────────────────────────────────────
var studyArea = ee.Geometry.Rectangle({
  coords: [
    [-99.3, 19.25],
    [-98.95, 19.6]
  ],
  geodesic: false
});

var centerPoint = studyArea.centroid(1);

// ─── 2. LOAD AND PREPARE DATA ─────────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20);

function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var image = s2.map(maskS2clouds).median().clip(studyArea);
var ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI");

// ─── 3. REDUCE REGION (Single Geometry) ───────────────────────
// Calculate multiple statistics at once
var stats = ndvi.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.median(), null, true)
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.minMax(), null, true)
    .combine(ee.Reducer.percentile([25, 75]), null, true),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

print("=== Zonal Statistics (Study Area) ===");
print(stats);

// ─── 4. CREATE MULTIPLE ZONES (FeatureCollection) ─────────────
// Example: Create 4 smaller rectangles inside the study area
var zone1 = ee.Geometry.Rectangle([-99.28, 19.28, -99.15, 19.40]);
var zone2 = ee.Geometry.Rectangle([-99.15, 19.28, -99.00, 19.40]);
var zone3 = ee.Geometry.Rectangle([-99.28, 19.40, -99.15, 19.55]);
var zone4 = ee.Geometry.Rectangle([-99.15, 19.40, -99.00, 19.55]);

var zones = ee.FeatureCollection([
  ee.Feature(zone1, {name: "Zone 1 - Southwest"}),
  ee.Feature(zone2, {name: "Zone 2 - Southeast"}),
  ee.Feature(zone3, {name: "Zone 3 - Northwest"}),
  ee.Feature(zone4, {name: "Zone 4 - Northeast"})
]);

// ─── 5. REDUCE REGIONS (Multiple Features) ────────────────────
var zoneStats = ndvi.reduceRegions({
  collection: zones,
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.median(), null, true)
    .combine(ee.Reducer.stdDev(), null, true),
  scale: 10
});

print("=== Statistics per Zone ===");
print(zoneStats);

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visNDVI = {
  min: -0.2,
  max: 0.8,
  palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]
};

Map.addLayer(ndvi, visNDVI, "NDVI");
Map.addLayer(studyArea, {color: "red"}, "Study Area");
Map.addLayer(zones, {color: "yellow"}, "Analysis Zones");

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 7: Reducers & Zonal Statistics",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• reduceRegion → Stats over one geometry"));
infoPanel.add(ui.Label("• reduceRegions → Stats over many features"));
infoPanel.add(ui.Label("• Common reducers: mean, median, stdDev"));
infoPanel.add(ui.Label("• Can combine multiple reducers"));
infoPanel.add(ui.Label("• Check Console for numeric results"));

Map.add(infoPanel);

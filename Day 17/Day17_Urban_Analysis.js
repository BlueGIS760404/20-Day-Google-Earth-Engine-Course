// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟳: 𝗨𝗿𝗯𝗮𝗻 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 – 𝗡𝗗𝗕𝗜, 𝗕𝘂𝗶𝗹𝘁-𝘂𝗽 & 𝗡𝗶𝗴𝗵𝘁𝘁𝗶𝗺𝗲 𝗟𝗶𝗴𝗵𝘁𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Calculate NDBI (Normalized Difference Built-up Index)
// • Map urban / built-up areas
// • Use VIIRS nighttime lights data
// • Compare optical and nighttime lights information
// • Visualize urban extent and intensity
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

// ─── 2. LOAD AND PREPARE SENTINEL-2 ───────────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20)
  .map(maskS2clouds)
  .median()
  .clip(studyArea);

// ─── 3. CALCULATE NDBI ────────────────────────────────────────
// NDBI = (SWIR - NIR) / (SWIR + NIR)
var ndbi = s2.normalizedDifference(["B11", "B8"]).rename("NDBI");

// Simple built-up mask
var builtUp = ndbi.gt(0.1).selfMask();

// ─── 4. LOAD VIIRS NIGHTTIME LIGHTS ───────────────────────────
// VIIRS Nighttime Day/Night Band (monthly composites)
var viirs = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
  .filterBounds(studyArea)
  .filterDate("2023-01-01", "2023-12-31")
  .select("avg_rad")
  .mean()
  .clip(studyArea);

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var visNDBI = {
  min: -0.4,
  max: 0.4,
  palette: ["#0c4a6e", "#38bdf8", "#fef08a", "#f97316", "#7c2d12"]
};

var visNight = {
  min: 0,
  max: 30,
  palette: ["#000000", "#1a1a40", "#4b0082", "#ff4500", "#ffff00"]
};

Map.addLayer(s2, visRGB, "True Color");
Map.addLayer(ndbi, visNDBI, "NDBI");
Map.addLayer(builtUp, {palette: ["#ff4500"]}, "Built-up Mask (NDBI > 0.1)");
Map.addLayer(viirs, visNight, "VIIRS Nighttime Lights (2023)");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 6. STATISTICS ────────────────────────────────────────────
var builtUpStats = builtUp.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

var nightStats = viirs.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.max(), null, true),
  geometry: studyArea,
  scale: 500,
  maxPixels: 1e9
});

print("=== Urban Statistics ===");
print("Built-up area (m²):", builtUpStats);
print("Nighttime lights stats:", nightStats);

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 17: Urban Analysis",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• NDBI → Built-up index (SWIR & NIR)"));
infoPanel.add(ui.Label("• Built-up Mask → NDBI > 0.1"));
infoPanel.add(ui.Label("• VIIRS → Nighttime lights intensity"));
infoPanel.add(ui.Label("• Compare optical vs night lights"));
infoPanel.add(ui.Label("Check Console for statistics"));

Map.add(infoPanel);

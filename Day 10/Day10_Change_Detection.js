// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟬: 𝗖𝗵𝗮𝗻𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗶𝗼𝗻 – 𝗕𝗲𝗳𝗼𝗿𝗲 / 𝗔𝗳𝘁𝗲𝗿 & 𝗡𝗗𝗩𝗜 𝗗𝗶𝗳𝗳𝗲𝗿𝗲𝗻𝗰𝗶𝗻𝗴
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand the concept of change detection
// • Create before and after composites
// • Calculate image differencing (NDVI change)
// • Identify areas of vegetation gain and loss
// • Visualize and interpret change maps
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

// ─── 2. LOAD DATA FOR TWO PERIODS ─────────────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

// Before period (early 2022)
var before = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2022-01-01", "2022-03-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 30)
  .map(maskS2clouds)
  .median()
  .clip(studyArea);

// After period (late 2023)
var after = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-10-01", "2023-12-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 30)
  .map(maskS2clouds)
  .median()
  .clip(studyArea);

// ─── 3. CALCULATE NDVI FOR BOTH PERIODS ───────────────────────
var ndviBefore = before.normalizedDifference(["B8", "B4"]).rename("NDVI_before");
var ndviAfter  = after.normalizedDifference(["B8", "B4"]).rename("NDVI_after");

// ─── 4. CHANGE DETECTION (Differencing) ───────────────────────
// Positive = vegetation gain, Negative = vegetation loss
var ndviChange = ndviAfter.subtract(ndviBefore).rename("NDVI_change");

// Optional: Classify change into categories
var changeClass = ee.Image(0)
  .where(ndviChange.lt(-0.15), 1)   // Significant loss
  .where(ndviChange.gt(0.15), 2)    // Significant gain
  .rename("change_class");

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var visNDVI = {
  min: -0.2,
  max: 0.8,
  palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]
};

var visChange = {
  min: -0.4,
  max: 0.4,
  palette: ["#7f1d1d", "#fef08a", "#166534"]  // Red = loss, Yellow = no change, Green = gain
};

var visClass = {
  min: 0,
  max: 2,
  palette: ["#808080", "#dc2626", "#16a34a"]  // Gray = no significant change, Red = loss, Green = gain
};

Map.addLayer(before, visRGB, "Before (Early 2022)");
Map.addLayer(after, visRGB, "After (Late 2023)");
Map.addLayer(ndviBefore, visNDVI, "NDVI Before");
Map.addLayer(ndviAfter, visNDVI, "NDVI After");
Map.addLayer(ndviChange, visChange, "NDVI Change");
Map.addLayer(changeClass, visClass, "Change Classes");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 6. STATISTICS ────────────────────────────────────────────
var changeStats = ndviChange.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.minMax(), null, true),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

print("=== NDVI Change Statistics ===");
print(changeStats);

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 10: Change Detection",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("Red   → Vegetation Loss"));
infoPanel.add(ui.Label("Green → Vegetation Gain"));
infoPanel.add(ui.Label("Gray  → No significant change"));
infoPanel.add(ui.Label("Method: NDVI Differencing"));
infoPanel.add(ui.Label("Toggle layers to compare periods"));

Map.add(infoPanel);

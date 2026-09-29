// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟱: 𝗛𝘆𝗱𝗿𝗼𝗹𝗼𝗴𝘆 & 𝗪𝗮𝘁𝗲𝗿 𝗠𝗮𝗽𝗽𝗶𝗻𝗴
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Calculate NDWI and MNDWI for water detection
// • Compare different water indices
// • Use the JRC Global Surface Water dataset
// • Map permanent and seasonal water
// • Visualize water occurrence and change
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

// ─── 3. CALCULATE WATER INDICES ───────────────────────────────
// NDWI (McFeeters) = (Green - NIR) / (Green + NIR)
var ndwi = s2.normalizedDifference(["B3", "B8"]).rename("NDWI");

// MNDWI (Modified NDWI) = (Green - SWIR) / (Green + SWIR)
var mndwi = s2.normalizedDifference(["B3", "B11"]).rename("MNDWI");

// Simple water mask from MNDWI
var waterMask = mndwi.gt(0.1).rename("water_mask");

// ─── 4. JRC GLOBAL SURFACE WATER ──────────────────────────────
// JRC Global Surface Water - Occurrence
var gsw = ee.Image("JRC/GSW1_4/GlobalSurfaceWater");

var occurrence = gsw.select("occurrence").clip(studyArea);
var change     = gsw.select("change_abs").clip(studyArea);
var seasonality = gsw.select("seasonality").clip(studyArea);
var transitions = gsw.select("transition").clip(studyArea);

// Permanent water (occurrence > 90%)
var permanentWater = occurrence.gt(90).selfMask();

// Seasonal water (occurrence between 10% and 90%)
var seasonalWater = occurrence.gt(10).and(occurrence.lte(90)).selfMask();

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var visNDWI = {
  min: -0.5,
  max: 0.5,
  palette: ["#7c2d12", "#f97316", "#fef08a", "#38bdf8", "#0c4a6e"]
};

var visOccurrence = {
  min: 0,
  max: 100,
  palette: ["#ffffff", "#00ffff", "#0000ff"]
};

var visChange = {
  min: -50,
  max: 50,
  palette: ["#ff0000", "#ffffff", "#0000ff"]
};

Map.addLayer(s2, visRGB, "True Color");
Map.addLayer(ndwi, visNDWI, "NDWI");
Map.addLayer(mndwi, visNDWI, "MNDWI");
Map.addLayer(waterMask.selfMask(), {palette: ["#1e90ff"]}, "Water Mask (MNDWI)");
Map.addLayer(occurrence, visOccurrence, "JRC Water Occurrence");
Map.addLayer(permanentWater, {palette: ["#0000ff"]}, "Permanent Water");
Map.addLayer(seasonalWater, {palette: ["#00ffff"]}, "Seasonal Water");
Map.addLayer(change, visChange, "Water Change (JRC)");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 6. STATISTICS ────────────────────────────────────────────
var waterStats = waterMask.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

print("=== Water Statistics ===");
print("Water pixels (MNDWI > 0.1):", waterStats);

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 15: Hydrology & Water Mapping",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• NDWI  → Green & NIR"));
infoPanel.add(ui.Label("• MNDWI → Green & SWIR (often better)"));
infoPanel.add(ui.Label("• JRC Occurrence → Long-term water frequency"));
infoPanel.add(ui.Label("• Permanent vs Seasonal water"));
infoPanel.add(ui.Label("Toggle layers to explore"));

Map.add(infoPanel);

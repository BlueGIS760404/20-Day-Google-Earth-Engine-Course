// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟰: 𝗦𝗽𝗲𝗰𝘁𝗿𝗮𝗹 𝗜𝗻𝗱𝗶𝗰𝗲𝘀 (𝗕𝗲𝘆𝗼𝗻𝗱 𝗡𝗗𝗩𝗜)
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand the purpose of different spectral indices
// • Learn how to calculate EVI, NDRE, NDBI, NDWI, and SAVI
// • Create reusable functions for spectral indices
// • Compare multiple indices on the same image
// • Visualize and interpret different land surface properties
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

// ─── 2. LOAD AND FILTER SENTINEL-2 ────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 15);

var image = s2.median().clip(studyArea);

// ─── 3. REUSABLE INDEX FUNCTIONS ──────────────────────────────
// NDVI (already known)
var calculateNDVI = function(img) {
  return img.normalizedDifference(["B8", "B4"]).rename("NDVI");
};

// EVI (Enhanced Vegetation Index) – better in dense vegetation
var calculateEVI = function(img) {
  var evi = img.expression(
    "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
    {
      NIR: img.select("B8"),
      RED: img.select("B4"),
      BLUE: img.select("B2")
    }
  ).rename("EVI");
  return evi;
};

// NDRE (Normalized Difference Red Edge) – sensitive to chlorophyll
var calculateNDRE = function(img) {
  return img.normalizedDifference(["B8", "B5"]).rename("NDRE");
};

// NDBI (Normalized Difference Built-up Index)
var calculateNDBI = function(img) {
  return img.normalizedDifference(["B11", "B8"]).rename("NDBI");
};

// NDWI (Normalized Difference Water Index)
var calculateNDWI = function(img) {
  return img.normalizedDifference(["B3", "B8"]).rename("NDWI");
};

// SAVI (Soil Adjusted Vegetation Index)
var calculateSAVI = function(img) {
  var savi = img.expression(
    "((NIR - RED) / (NIR + RED + L)) * (1 + L)",
    {
      NIR: img.select("B8"),
      RED: img.select("B4"),
      L: 0.5
    }
  ).rename("SAVI");
  return savi;
};

// ─── 4. CALCULATE ALL INDICES ─────────────────────────────────
var ndvi = calculateNDVI(image);
var evi  = calculateEVI(image);
var ndre = calculateNDRE(image);
var ndbi = calculateNDBI(image);
var ndwi = calculateNDWI(image);
var savi = calculateSAVI(image);

// Combine all indices into one image
var indices = ee.Image.cat([ndvi, evi, ndre, ndbi, ndwi, savi]);

print("All indices calculated:", indices.bandNames());

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visNDVI = {min: -0.2, max: 0.8, palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]};
var visEVI  = {min: -0.1, max: 0.9, palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]};
var visNDBI = {min: -0.5, max: 0.5, palette: ["#0c4a6e", "#38bdf8", "#fef08a", "#f97316", "#7c2d12"]};
var visNDWI = {min: -0.5, max: 0.5, palette: ["#7c2d12", "#f97316", "#fef08a", "#38bdf8", "#0c4a6e"]};

Map.addLayer(image, {bands: ["B4", "B3", "B2"], min: 0, max: 3000}, "True Color");
Map.addLayer(ndvi, visNDVI, "NDVI");
Map.addLayer(evi,  visEVI,  "EVI");
Map.addLayer(ndbi, visNDBI, "NDBI (Built-up)");
Map.addLayer(ndwi, visNDWI, "NDWI (Water)");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 6. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 4: Spectral Indices",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• NDVI  → General vegetation"));
infoPanel.add(ui.Label("• EVI   → Dense vegetation (less saturated)"));
infoPanel.add(ui.Label("• NDRE  → Chlorophyll / crop health"));
infoPanel.add(ui.Label("• NDBI  → Built-up / urban areas"));
infoPanel.add(ui.Label("• NDWI  → Water bodies"));
infoPanel.add(ui.Label("• SAVI  → Vegetation with soil background"));

Map.add(infoPanel);

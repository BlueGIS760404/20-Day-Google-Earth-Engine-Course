// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟮𝟬: 𝗙𝗶𝗻𝗮𝗹 𝗣𝗿𝗼𝗷𝗲𝗰𝘁 + 𝗕𝗲𝘀𝘁 𝗣𝗿𝗮𝗰𝘁𝗶𝗰𝗲𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Combine multiple skills into a complete mini-project
// • Apply best practices for clean and efficient GEE code
// • Organize code into clear sections and reusable functions
// • Export results and create a simple interactive interface
// • Build a portfolio-ready script
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

// ─── 2. REUSABLE FUNCTIONS (Best Practice) ────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask)
              .copyProperties(image, ["system:time_start"]);
}

function addIndices(image) {
  var ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI");
  var ndwi = image.normalizedDifference(["B3", "B8"]).rename("NDWI");
  var ndbi = image.normalizedDifference(["B11", "B8"]).rename("NDBI");
  return image.addBands([ndvi, ndwi, ndbi]);
}

// ─── 3. LOAD & PROCESS DATA ───────────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20)
  .map(maskS2clouds)
  .map(addIndices);

var composite = s2.median().clip(studyArea);

var ndvi = composite.select("NDVI");
var ndwi = composite.select("NDWI");
var ndbi = composite.select("NDBI");

// ─── 4. SIMPLE CLASSIFICATION (Built-up / Vegetation / Water) ─
var classification = ee.Image(0)
  .where(ndwi.gt(0.1), 1)          // Water
  .where(ndvi.gt(0.3), 2)          // Vegetation
  .where(ndbi.gt(0.1), 3)          // Built-up
  .rename("landcover")
  .clip(studyArea);

// ─── 5. ZONAL STATISTICS ──────────────────────────────────────
var stats = ndvi.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.minMax(), null, true),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

print("=== Final Project – NDVI Statistics ===");
print(stats);

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {bands: ["B4", "B3", "B2"], min: 0, max: 3000};
var visNDVI = {min: -0.2, max: 0.8, palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]};
var visClass = {
  min: 0, max: 3,
  palette: ["#808080", "#1e90ff", "#228b22", "#ff4500"]  // Other, Water, Vegetation, Built-up
};

Map.addLayer(composite, visRGB, "True Color");
Map.addLayer(ndvi, visNDVI, "NDVI");
Map.addLayer(classification, visClass, "Simple Land Cover");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 7. SIMPLE INTERACTIVE PANEL ──────────────────────────────
var panel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "10px 15px",
    backgroundColor: "rgba(255,255,255,0.9)"
  }
});

panel.add(ui.Label({
  value: "Day 20 – Final Project",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 6px 0"}
}));

panel.add(ui.Label("• True Color + NDVI + Land Cover"));
panel.add(ui.Label("• Reusable functions (mask + indices)"));
panel.add(ui.Label("• Clean code structure"));
panel.add(ui.Label("• Ready for export & portfolio"));

Map.add(panel);

// ─── 8. OPTIONAL EXPORT (uncomment to use) ────────────────────
/*
Export.image.toDrive({
  image: classification.toByte(),
  description: "Final_Project_LandCover",
  folder: "GEE_Exports",
  fileNamePrefix: "Final_Project_LandCover",
  region: studyArea,
  scale: 10,
  crs: "EPSG:4326",
  maxPixels: 1e9
});
*/

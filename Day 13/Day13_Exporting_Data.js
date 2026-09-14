// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟯: 𝗘𝘅𝗽𝗼𝗿𝘁𝗶𝗻𝗴 𝗗𝗮𝘁𝗮 – 𝗗𝗿𝗶𝘃𝗲, 𝗔𝘀𝘀𝗲𝘁, 𝗚𝗲𝗼𝗧𝗜𝗙𝗙 & 𝗧𝗮𝗯𝗹𝗲𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand the different export destinations in GEE
// • Export images to Google Drive as GeoTIFF
// • Export images to Earth Engine Assets
// • Export FeatureCollections (tables) to Drive or Asset
// • Set proper scale, region, and file format parameters
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

// ─── 2. PREPARE AN IMAGE TO EXPORT ────────────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var image = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20)
  .map(maskS2clouds)
  .median()
  .clip(studyArea);

var ndvi = image.normalizedDifference(["B8", "B4"]).rename("NDVI");

// Create a multi-band image for export
var exportImage = image.select(["B4", "B3", "B2", "B8"]).addBands(ndvi);

// ─── 3. PREPARE A TABLE TO EXPORT ─────────────────────────────
// Example: Zonal statistics as a FeatureCollection
var zones = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Rectangle([-99.28, 19.28, -99.15, 19.40]), {name: "Zone 1"}),
  ee.Feature(ee.Geometry.Rectangle([-99.15, 19.28, -99.00, 19.40]), {name: "Zone 2"}),
  ee.Feature(ee.Geometry.Rectangle([-99.28, 19.40, -99.15, 19.55]), {name: "Zone 3"}),
  ee.Feature(ee.Geometry.Rectangle([-99.15, 19.40, -99.00, 19.55]), {name: "Zone 4"})
]);

var zoneStats = ndvi.reduceRegions({
  collection: zones,
  reducer: ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true),
  scale: 10
});

print("Zone statistics ready for export:", zoneStats);

// ─── 4. EXPORT IMAGE TO GOOGLE DRIVE ──────────────────────────
Export.image.toDrive({
  image: exportImage.toFloat(),
  description: "S2_NDVI_MexicoCity_2023",
  folder: "GEE_Exports",
  fileNamePrefix: "S2_NDVI_MexicoCity_2023",
  region: studyArea,
  scale: 10,
  crs: "EPSG:4326",
  maxPixels: 1e9,
  fileFormat: "GeoTIFF"
});

// ─── 5. EXPORT IMAGE TO EARTH ENGINE ASSET ────────────────────
// Note: Change 'users/your_username/' to your own asset path
/*
Export.image.toAsset({
  image: exportImage.toFloat(),
  description: "S2_NDVI_MexicoCity_Asset",
  assetId: "users/your_username/S2_NDVI_MexicoCity_2023",
  region: studyArea,
  scale: 10,
  crs: "EPSG:4326",
  maxPixels: 1e9
});
*/

// ─── 6. EXPORT TABLE TO GOOGLE DRIVE ──────────────────────────
Export.table.toDrive({
  collection: zoneStats,
  description: "Zone_NDVI_Statistics",
  folder: "GEE_Exports",
  fileNamePrefix: "Zone_NDVI_Statistics",
  fileFormat: "CSV"
});

// ─── 7. EXPORT TABLE TO ASSET (optional) ──────────────────────
/*
Export.table.toAsset({
  collection: zoneStats,
  description: "Zone_NDVI_Statistics_Asset",
  assetId: "users/your_username/Zone_NDVI_Statistics"
});
*/

// ─── 8. VISUALIZATION ─────────────────────────────────────────
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

Map.addLayer(image, visRGB, "True Color");
Map.addLayer(ndvi, visNDVI, "NDVI");
Map.addLayer(zones, {color: "yellow"}, "Export Zones");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 9. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 13: Exporting Data",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Image → Drive (GeoTIFF)"));
infoPanel.add(ui.Label("• Image → Asset (optional)"));
infoPanel.add(ui.Label("• Table → Drive (CSV)"));
infoPanel.add(ui.Label("Check Tasks tab to run exports"));
infoPanel.add(ui.Label("Remember to start the tasks!"));

Map.add(infoPanel);

print("=== Export tasks have been created ===");
print("Go to the Tasks tab (right panel) and click 'Run' for each task.");

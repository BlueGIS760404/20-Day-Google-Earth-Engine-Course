// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟴: 𝗔𝗴𝗿𝗶𝗰𝘂𝗹𝘁𝘂𝗿𝗮𝗹 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴 – 𝗖𝗿𝗼𝗽 𝗠𝗮𝗽𝗽𝗶𝗻𝗴 & 𝗣𝗵𝗲𝗻𝗼𝗹𝗼𝗴𝘆
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Calculate EVI for agricultural monitoring
// • Build an EVI time series to study crop phenology
// • Create seasonal composites for crop mapping
// • Visualize crop growth cycles
// • Extract basic phenology statistics
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
  return image.updateMask(mask)
              .copyProperties(image, ["system:time_start"]);
}

var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-01-01", "2023-12-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 30)
  .map(maskS2clouds);

// ─── 3. CALCULATE EVI ─────────────────────────────────────────
// EVI = 2.5 * ((NIR - RED) / (NIR + 6*RED - 7.5*BLUE + 1))
function addEVI(image) {
  var evi = image.expression(
    "2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))",
    {
      NIR: image.select("B8"),
      RED: image.select("B4"),
      BLUE: image.select("B2")
    }
  ).rename("EVI");
  return image.addBands(evi);
}

var withEVI = s2.map(addEVI);

// ─── 4. SEASONAL COMPOSITES ───────────────────────────────────
var spring = withEVI.filterDate("2023-03-01", "2023-05-31").median().clip(studyArea);
var summer = withEVI.filterDate("2023-06-01", "2023-08-31").median().clip(studyArea);
var autumn = withEVI.filterDate("2023-09-01", "2023-11-30").median().clip(studyArea);

var eviSpring = spring.select("EVI");
var eviSummer = summer.select("EVI");
var eviAutumn = autumn.select("EVI");

// ─── 5. EVI TIME SERIES CHART ─────────────────────────────────
var chart = ui.Chart.image.series({
  imageCollection: withEVI.select("EVI"),
  region: studyArea,
  reducer: ee.Reducer.mean(),
  scale: 30
}).setOptions({
  title: "EVI Time Series – Crop Phenology 2023",
  vAxis: {title: "EVI"},
  hAxis: {title: "Date"},
  lineWidth: 2,
  pointSize: 3,
  legend: {position: "none"}
});

print(chart);

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var visEVI = {
  min: -0.1,
  max: 0.9,
  palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]
};

Map.addLayer(summer, visRGB, "Summer True Color");
Map.addLayer(eviSpring, visEVI, "EVI Spring");
Map.addLayer(eviSummer, visEVI, "EVI Summer");
Map.addLayer(eviAutumn, visEVI, "EVI Autumn");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 7. STATISTICS ────────────────────────────────────────────
var eviStats = eviSummer.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.minMax(), null, true),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
});

print("=== Summer EVI Statistics ===");
print(eviStats);

// ─── 8. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 18: Agricultural Monitoring",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• EVI → Better for dense crops than NDVI"));
infoPanel.add(ui.Label("• Seasonal composites → Crop stages"));
infoPanel.add(ui.Label("• Time series chart → Phenology curve"));
infoPanel.add(ui.Label("• Check Console for chart & stats"));
infoPanel.add(ui.Label("Toggle layers to compare seasons"));

Map.add(infoPanel);

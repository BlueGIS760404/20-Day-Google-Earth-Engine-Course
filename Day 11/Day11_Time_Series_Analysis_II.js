// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟭: 𝗧𝗶𝗺𝗲 𝗦𝗲𝗿𝗶𝗲𝘀 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 𝗜𝗜 – 𝗖𝗵𝗮𝗿𝘁𝗶𝗻𝗴 & 𝗧𝗿𝗲𝗻𝗱𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Create time series charts of NDVI
// • Extract temporal profiles for a region
// • Fit linear trends using ee.Reducer.linearFit
// • Interpret slope (rate of change) and intercept
// • Visualize both the chart and the trend map
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

// ─── 2. LOAD AND PREPARE TIME SERIES ──────────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask)
              .copyProperties(image, ["system:time_start"]);
}

var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2022-01-01", "2023-12-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 30)
  .map(maskS2clouds);

// Add NDVI to every image
var withNDVI = s2.map(function(img) {
  var ndvi = img.normalizedDifference(["B8", "B4"]).rename("NDVI");
  return img.addBands(ndvi);
});

// ─── 3. CREATE NDVI TIME SERIES CHART ─────────────────────────
var chart = ui.Chart.image.series({
  imageCollection: withNDVI.select("NDVI"),
  region: studyArea,
  reducer: ee.Reducer.mean(),
  scale: 30
}).setOptions({
  title: "NDVI Time Series (2022–2023)",
  vAxis: {title: "NDVI"},
  hAxis: {title: "Date"},
  lineWidth: 2,
  pointSize: 3,
  legend: {position: "none"}
});

print(chart);

// ─── 4. LINEAR TREND ANALYSIS ─────────────────────────────────
// Add a time band (in years) for regression
var addTime = function(image) {
  var date = ee.Date(image.get("system:time_start"));
  var years = date.difference(ee.Date("2022-01-01"), "year");
  return image.addBands(ee.Image(years).rename("t").float());
};

var timed = withNDVI.map(addTime);

// Fit a linear trend: NDVI = intercept + slope * t
var linearFit = timed.select(["t", "NDVI"])
  .reduce(ee.Reducer.linearFit());

var slope = linearFit.select("scale").rename("slope");
var intercept = linearFit.select("offset").rename("intercept");

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visSlope = {
  min: -0.15,
  max: 0.15,
  palette: ["#7f1d1d", "#fef08a", "#166534"]  // Red = decline, Green = increase
};

Map.addLayer(slope.clip(studyArea), visSlope, "NDVI Trend (Slope)");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 6. SUMMARY STATISTICS ────────────────────────────────────
var slopeStats = slope.reduceRegion({
  reducer: ee.Reducer.mean()
    .combine(ee.Reducer.stdDev(), null, true)
    .combine(ee.Reducer.minMax(), null, true),
  geometry: studyArea,
  scale: 30,
  maxPixels: 1e9
});

print("=== NDVI Trend Statistics (Slope) ===");
print(slopeStats);

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 11: Time Series & Trends",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Chart shows NDVI over time"));
infoPanel.add(ui.Label("• Slope map shows rate of change"));
infoPanel.add(ui.Label("Red   → Declining vegetation"));
infoPanel.add(ui.Label("Green → Increasing vegetation"));
infoPanel.add(ui.Label("Check Console for chart & stats"));

Map.add(infoPanel);

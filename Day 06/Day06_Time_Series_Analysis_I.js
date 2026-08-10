// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟲: 𝗧𝗶𝗺𝗲 𝗦𝗲𝗿𝗶𝗲𝘀 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀 𝗜 – 𝗠𝗼𝗻𝘁𝗵𝗹𝘆 & 𝗦𝗲𝗮𝘀𝗼𝗻𝗮𝗹 𝗖𝗼𝗺𝗽𝗼𝘀𝗶𝘁𝗲𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand how to work with time series data in GEE
// • Create monthly and seasonal composites
// • Use .map() to process collections over time
// • Apply reducers across time
// • Visualize and compare different time periods
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

// ─── 2. LOAD FULL YEAR OF SENTINEL-2 ──────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-01-01", "2023-12-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 30);

// ─── 3. SIMPLE CLOUD MASK FUNCTION ────────────────────────────
function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask).copyProperties(image, ["system:time_start"]);
}

var masked = s2.map(maskS2clouds);

// ─── 4. CREATE MONTHLY COMPOSITES ─────────────────────────────
// Function to create monthly median composites
function createMonthlyComposite(month) {
  var start = ee.Date.fromYMD(2023, month, 1);
  var end = start.advance(1, "month");
  
  var monthly = masked
    .filterDate(start, end)
    .median()
    .clip(studyArea)
    .set("month", month)
    .set("system:time_start", start.millis());
    
  return monthly;
}

// Create list of months (1 to 12)
var months = ee.List.sequence(1, 12);
var monthlyComposites = ee.ImageCollection.fromImages(
  months.map(function(m) {
    return createMonthlyComposite(m);
  })
);

print("Monthly composites created:", monthlyComposites.size());

// ─── 5. CREATE SEASONAL COMPOSITES ────────────────────────────
var spring = masked.filterDate("2023-03-01", "2023-05-31").median().clip(studyArea);
var summer = masked.filterDate("2023-06-01", "2023-08-31").median().clip(studyArea);
var autumn = masked.filterDate("2023-09-01", "2023-11-30").median().clip(studyArea);
var winter = masked.filterDate("2023-12-01", "2024-02-28").median().clip(studyArea);

// ─── 6. CALCULATE NDVI FOR SEASONS ────────────────────────────
var ndviSpring = spring.normalizedDifference(["B8", "B4"]).rename("NDVI");
var ndviSummer = summer.normalizedDifference(["B8", "B4"]).rename("NDVI");
var ndviAutumn = autumn.normalizedDifference(["B8", "B4"]).rename("NDVI");
var ndviWinter = winter.normalizedDifference(["B8", "B4"]).rename("NDVI");

// ─── 7. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {bands: ["B4", "B3", "B2"], min: 0, max: 3000};
var visNDVI = {
  min: -0.2,
  max: 0.8,
  palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]
};

Map.addLayer(spring, visRGB, "Spring RGB");
Map.addLayer(summer, visRGB, "Summer RGB");
Map.addLayer(ndviSpring, visNDVI, "NDVI Spring");
Map.addLayer(ndviSummer, visNDVI, "NDVI Summer");
Map.addLayer(ndviAutumn, visNDVI, "NDVI Autumn");
Map.addLayer(ndviWinter, visNDVI, "NDVI Winter");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 8. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 6: Time Series Analysis I",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Monthly composites → 12 images"));
infoPanel.add(ui.Label("• Seasonal composites → Spring, Summer, Autumn, Winter"));
infoPanel.add(ui.Label("• .map() → Applies function to every month"));
infoPanel.add(ui.Label("• .filterDate() → Selects time periods"));
infoPanel.add(ui.Label("• Toggle layers to compare seasons"));

Map.add(infoPanel);

print("Monthly collection:", monthlyComposites);

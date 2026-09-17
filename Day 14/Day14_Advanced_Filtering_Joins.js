// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟰: 𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱 𝗙𝗶𝗹𝘁𝗲𝗿𝗶𝗻𝗴 & 𝗝𝗼𝗶𝗻𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Master complex filters (and, or, date ranges, metadata)
// • Understand how to join two ImageCollections
// • Use ee.Join to combine datasets based on time or location
// • Filter joined results for analysis
// • Apply advanced filtering techniques in real workflows
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

// ─── 2. LOAD TWO COLLECTIONS ──────────────────────────────────
// Sentinel-2
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 40);

// Landsat 8 (for demonstration of joining)
var landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUD_COVER", "less_than", 40);

print("Sentinel-2 images:", s2.size());
print("Landsat 8 images:", landsat.size());

// ─── 3. ADVANCED FILTERING ────────────────────────────────────
// Example: Filter S2 by multiple conditions
var complexFilter = s2
  .filter(ee.Filter.and(
    ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20),
    ee.Filter.gt("system:time_start", ee.Date("2023-07-01").millis())
  ));

print("S2 after complex filter:", complexFilter.size());

// ─── 4. JOIN COLLECTIONS BY DATE (within 3 days) ──────────────
// Define a filter that matches images within 3 days of each other
var maxDiff = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

var temporalJoin = ee.Join.saveAll({
  matchesKey: "landsat",
  measureKey: "timeDiff"
});

var filterTime = ee.Filter.maxDifference({
  difference: maxDiff,
  leftField: "system:time_start",
  rightField: "system:time_start"
});

// Apply the join
var joined = temporalJoin.apply(s2, landsat, filterTime);

print("Joined collection size:", joined.size());
print("Example joined image:", joined.first());

// ─── 5. SIMPLE CLOUD MASK + COMPOSITE ─────────────────────────
function maskS2(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var s2Masked = s2.map(maskS2);
var s2Median = s2Masked.median().clip(studyArea);

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visS2 = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

Map.addLayer(s2Median, visS2, "Sentinel-2 Median");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 14: Advanced Filtering & Joins",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Complex filters (and / or)"));
infoPanel.add(ui.Label("• Temporal join (within 3 days)"));
infoPanel.add(ui.Label("• Joining Sentinel-2 + Landsat"));
infoPanel.add(ui.Label("• Check Console for join results"));
infoPanel.add(ui.Label("Useful for multi-sensor analysis"));

Map.add(infoPanel);

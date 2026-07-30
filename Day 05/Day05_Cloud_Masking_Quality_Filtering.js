// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟱: 𝗖𝗹𝗼𝘂𝗱 𝗠𝗮𝘀𝗸𝗶𝗻𝗴 & 𝗤𝘂𝗮𝗹𝗶𝘁𝘆 𝗙𝗶𝗹𝘁𝗲𝗿𝗶𝗻𝗴
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand why cloud masking is essential in remote sensing
// • Learn how to use the Scene Classification Layer (SCL) band
// • Create custom cloud and shadow masks
// • Apply quality filters to improve composites
// • Compare masked vs unmasked results
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

// ─── 2. LOAD SENTINEL-2 COLLECTION ────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 40);  // Allow more clouds for demonstration

// ─── 3. CLOUD MASKING FUNCTION (using SCL) ────────────────────
// SCL classes:
// 0 = No data, 1 = Saturated, 2 = Dark area, 3 = Cloud shadow
// 4 = Vegetation, 5 = Bare soil, 6 = Water, 7 = Unclassified
// 8 = Cloud medium probability, 9 = Cloud high probability
// 10 = Thin cirrus, 11 = Snow/ice

function maskS2clouds(image) {
  var scl = image.select("SCL");
  
  // Keep clear classes: vegetation, bare soil, water, unclassified
  var clearMask = scl.eq(4)   // Vegetation
    .or(scl.eq(5))            // Bare soil
    .or(scl.eq(6))            // Water
    .or(scl.eq(7));           // Unclassified
  
  // Also remove cloud shadows and clouds
  var cloudMask = scl.neq(3)  // Not cloud shadow
    .and(scl.neq(8))          // Not medium cloud
    .and(scl.neq(9))          // Not high cloud
    .and(scl.neq(10));        // Not thin cirrus
  
  var finalMask = clearMask.and(cloudMask);
  
  return image.updateMask(finalMask)
              .copyProperties(image, ["system:time_start"]);
}

// ─── 4. APPLY MASKING ─────────────────────────────────────────
var maskedCollection = s2.map(maskS2clouds);

// Create composites for comparison
var unmaskedMedian = s2.median().clip(studyArea);
var maskedMedian   = maskedCollection.median().clip(studyArea);

// ─── 5. CALCULATE NDVI ON MASKED IMAGE ────────────────────────
var ndvi = maskedMedian.normalizedDifference(["B8", "B4"]).rename("NDVI");

// ─── 6. VISUALIZATION ─────────────────────────────────────────
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

Map.addLayer(unmaskedMedian, visRGB, "Unmasked Median (with clouds)");
Map.addLayer(maskedMedian, visRGB, "Masked Median (clouds removed)");
Map.addLayer(ndvi, visNDVI, "NDVI (Masked)");
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
  value: "Day 5: Cloud Masking",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• SCL band → Scene Classification Layer"));
infoPanel.add(ui.Label("• Classes 4,5,6,7 → Clear pixels"));
infoPanel.add(ui.Label("• Classes 3,8,9,10 → Clouds & shadows"));
infoPanel.add(ui.Label("• .updateMask() → Applies the mask"));
infoPanel.add(ui.Label("• .map() → Applies function to every image"));
infoPanel.add(ui.Label("Toggle layers to compare results"));

Map.add(infoPanel);

// Print number of scenes
print("Original scenes:", s2.size());
print("Masked collection size:", maskedCollection.size());

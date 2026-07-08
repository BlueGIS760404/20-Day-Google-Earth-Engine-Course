// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟯: 𝗜𝗺𝗮𝗴𝗲 𝘃𝘀 𝗜𝗺𝗮𝗴𝗲𝗖𝗼𝗹𝗹𝗲𝗰𝘁𝗶𝗼𝗻 𝗗𝗲𝗲𝗽 𝗗𝗶𝘃𝗲
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand the difference between Image and ImageCollection
// • Learn how to work with single images
// • Master mosaicking, clipping, band selection, and adding bands
// • Combine multiple images and create composites
// • Practice common image manipulation techniques
// ═══════════════════════════════════════════════════════════════

// ─── 1. DEFINE STUDY AREA (Reusing previous days) ─────────────
var studyArea = ee.Geometry.Rectangle({
  coords: [
    [-99.3, 19.25],
    [-98.95, 19.6]
  ],
  geodesic: false
});

var centerPoint = studyArea.centroid(1);

// ─── 2. LOAD IMAGE COLLECTION ─────────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")   // Summer months
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20);

// ─── 3. SINGLE IMAGE vs COLLECTION ────────────────────────────
var firstImage = s2.first();                    // Single Image
var medianImage = s2.median();                  // Composite from Collection

print("First Image ID:", firstImage.id());
print("Number of images in collection:", s2.size());

// ─── 4. BASIC IMAGE OPERATIONS ────────────────────────────────
var clippedImage = medianImage.clip(studyArea);   // Clip to study area

// Select specific bands
var rgb = clippedImage.select(["B4", "B3", "B2"]);
var nir = clippedImage.select("B8");

// Add new band (example: NDVI)
var ndvi = clippedImage.normalizedDifference(["B8", "B4"]).rename("NDVI");
var imageWithNDVI = clippedImage.addBands(ndvi);

// ─── 5. MOSAICKING ────────────────────────────────────────────
var mosaic = s2.mosaic().clip(studyArea);   // Simple mosaic (last on top)

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {bands: ["B4", "B3", "B2"], min: 0, max: 3000};
var visNDVI = {min: -0.2, max: 0.8, palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]};

Map.addLayer(rgb, visRGB, "RGB (Median)");
Map.addLayer(mosaic, visRGB, "Mosaic");
Map.addLayer(ndvi, visNDVI, "NDVI");
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
  value: "Day 3: Image vs ImageCollection",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Image = Single scene"));
infoPanel.add(ui.Label("• ImageCollection = Stack of images"));
infoPanel.add(ui.Label("• .clip() → Restrict to area"));
infoPanel.add(ui.Label("• .select() → Choose bands"));
infoPanel.add(ui.Label("• .addBands() → Add new calculated bands"));
infoPanel.add(ui.Label("• .mosaic() → Combine images"));

Map.add(infoPanel);

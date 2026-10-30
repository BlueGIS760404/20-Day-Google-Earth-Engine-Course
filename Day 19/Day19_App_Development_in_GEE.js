// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟵: 𝗔𝗽𝗽 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁 𝗶𝗻 𝗚𝗘𝗘 – 𝗜𝗻𝘁𝗲𝗿𝗮𝗰𝘁𝗶𝘃𝗲 𝗪𝗲𝗯 𝗔𝗽𝗽𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Build a simple interactive Earth Engine App
// • Use ui widgets (buttons, selects, labels, panels)
// • Add click interactions with Map.onClick
// • Create dynamic layer switching
// • Design a clean user interface for end users
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

// ─── 2. PREPARE DATA ──────────────────────────────────────────
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

var ndvi = s2.normalizedDifference(["B8", "B4"]).rename("NDVI");
var ndwi = s2.normalizedDifference(["B3", "B8"]).rename("NDWI");
var ndbi = s2.normalizedDifference(["B11", "B8"]).rename("NDBI");

// Visualization parameters
var visRGB = {bands: ["B4", "B3", "B2"], min: 0, max: 3000};
var visNDVI = {min: -0.2, max: 0.8, palette: ["#7f1d1d", "#b45309", "#fef08a", "#4ade80", "#166534"]};
var visNDWI = {min: -0.5, max: 0.5, palette: ["#7c2d12", "#f97316", "#fef08a", "#38bdf8", "#0c4a6e"]};
var visNDBI = {min: -0.4, max: 0.4, palette: ["#0c4a6e", "#38bdf8", "#fef08a", "#f97316", "#7c2d12"]};

// ─── 3. CREATE THE APP UI ─────────────────────────────────────
// Title
var title = ui.Label({
  value: "Day 19 – Interactive GEE App",
  style: {fontWeight: "bold", fontSize: "20px", margin: "10px 5px"}
});

// Description
var description = ui.Label({
  value: "Select a layer and click on the map to inspect values.",
  style: {margin: "0 5px 10px 5px"}
});

// Layer selector
var layerSelect = ui.Select({
  items: ["True Color", "NDVI", "NDWI", "NDBI"],
  value: "True Color",
  style: {stretch: "horizontal"}
});

// Info label (for click results)
var infoLabel = ui.Label({
  value: "Click on the map to see pixel values...",
  style: {margin: "10px 5px", fontSize: "13px"}
});

// Reset button
var resetButton = ui.Button({
  label: "Reset View",
  onClick: function() {
    Map.centerObject(centerPoint, 11);
    infoLabel.setValue("Click on the map to see pixel values...");
  },
  style: {stretch: "horizontal", margin: "8px 5px"}
});

// Panel
var panel = ui.Panel({
  widgets: [title, description, layerSelect, infoLabel, resetButton],
  style: {
    width: "320px",
    padding: "10px",
    position: "top-left"
  }
});

Map.add(panel);

// ─── 4. LAYER SWITCHING FUNCTION ──────────────────────────────
function updateLayer(selected) {
  Map.layers().reset();  // Clear existing layers
  
  if (selected === "True Color") {
    Map.addLayer(s2, visRGB, "True Color");
  } else if (selected === "NDVI") {
    Map.addLayer(ndvi, visNDVI, "NDVI");
  } else if (selected === "NDWI") {
    Map.addLayer(ndwi, visNDWI, "NDWI");
  } else if (selected === "NDBI") {
    Map.addLayer(ndbi, visNDBI, "NDBI");
  }
  
  Map.addLayer(studyArea, {color: "red"}, "Study Area");
}

// Run once at start
updateLayer("True Color");

// Listen to selector changes
layerSelect.onChange(updateLayer);

// ─── 5. MAP CLICK INTERACTION ─────────────────────────────────
Map.onClick(function(coords) {
  var point = ee.Geometry.Point([coords.lon, coords.lat]);
  
  var values = ee.Image.cat([ndvi, ndwi, ndbi]).reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 10
  });
  
  values.evaluate(function(result) {
    if (result) {
      var text = "Lon: " + coords.lon.toFixed(4) +
                 " | Lat: " + coords.lat.toFixed(4) +
                 "\nNDVI: " + (result.NDVI ? result.NDVI.toFixed(3) : "N/A") +
                 " | NDWI: " + (result.NDWI ? result.NDWI.toFixed(3) : "N/A") +
                 " | NDBI: " + (result.NDBI ? result.NDBI.toFixed(3) : "N/A");
      infoLabel.setValue(text);
    } else {
      infoLabel.setValue("No data at this location.");
    }
  });
});

// ─── 6. INITIALIZE MAP ────────────────────────────────────────
Map.centerObject(centerPoint, 11);
Map.setOptions("HYBRID");

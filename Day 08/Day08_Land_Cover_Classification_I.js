// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟴: 𝗟𝗮𝗻𝗱 𝗖𝗼𝘃𝗲𝗿 𝗖𝗹𝗮𝘀𝘀𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗜 – 𝗦𝘂𝗽𝗲𝗿𝘃𝗶𝘀𝗲𝗱 (𝗥𝗮𝗻𝗱𝗼𝗺 𝗙𝗼𝗿𝗲𝘀𝘁)
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand supervised classification concepts
// • Create training data (points or polygons)
// • Train a Random Forest classifier
// • Classify an image into land cover classes
// • Visualize classification results
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

// ─── 2. LOAD AND PREPARE IMAGE ────────────────────────────────
var s2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(studyArea)
  .filterDate("2023-06-01", "2023-08-31")
  .filterMetadata("CLOUDY_PIXEL_PERCENTAGE", "less_than", 20);

function maskS2clouds(image) {
  var scl = image.select("SCL");
  var mask = scl.eq(4).or(scl.eq(5)).or(scl.eq(6)).or(scl.eq(7));
  return image.updateMask(mask);
}

var image = s2.map(maskS2clouds)
  .median()
  .clip(studyArea)
  .select(["B2", "B3", "B4", "B8", "B11", "B12"]);  // Useful bands for classification

// ─── 3. CREATE TRAINING DATA ──────────────────────────────────
// Class legend:
// 0 = Water
// 1 = Vegetation
// 2 = Urban / Built-up
// 3 = Bare soil

// Sample training points (you can improve these later)
var water = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.18, 19.35]), {landcover: 0}),
  ee.Feature(ee.Geometry.Point([-99.12, 19.42]), {landcover: 0})
]);

var vegetation = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.25, 19.30]), {landcover: 1}),
  ee.Feature(ee.Geometry.Point([-99.05, 19.50]), {landcover: 1}),
  ee.Feature(ee.Geometry.Point([-99.20, 19.48]), {landcover: 1})
]);

var urban = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.15, 19.43]), {landcover: 2}),
  ee.Feature(ee.Geometry.Point([-99.10, 19.38]), {landcover: 2}),
  ee.Feature(ee.Geometry.Point([-99.08, 19.45]), {landcover: 2})
]);

var bare = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.22, 19.32]), {landcover: 3}),
  ee.Feature(ee.Geometry.Point([-99.28, 19.52]), {landcover: 3})
]);

// Merge all training data
var trainingPoints = water.merge(vegetation).merge(urban).merge(bare);

// ─── 4. SAMPLE THE IMAGE AT TRAINING POINTS ─────────────────
var training = image.sampleRegions({
  collection: trainingPoints,
  properties: ["landcover"],
  scale: 10
});

print("Training samples:", training.size());

// ─── 5. TRAIN RANDOM FOREST CLASSIFIER ────────────────────────
var classifier = ee.Classifier.smileRandomForest(50)  // 50 trees
  .train({
    features: training,
    classProperty: "landcover",
    inputProperties: image.bandNames()
  });

print("Classifier trained:", classifier.explain());

// ─── 6. CLASSIFY THE IMAGE ────────────────────────────────────
var classified = image.classify(classifier).rename("landcover");

// ─── 7. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var classVis = {
  min: 0,
  max: 3,
  palette: ["#1e90ff", "#228b22", "#ff4500", "#d2b48c"]  // Blue, Green, Orange, Tan
};

Map.addLayer(image, visRGB, "True Color");
Map.addLayer(classified, classVis, "Land Cover Classification");
Map.addLayer(trainingPoints, {color: "yellow"}, "Training Points");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 8. INFO PANEL / LEGEND ───────────────────────────────────
var legend = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 8: Land Cover Classification",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

legend.add(title);
legend.add(ui.Label("0 → Water          (Blue)"));
legend.add(ui.Label("1 → Vegetation     (Green)"));
legend.add(ui.Label("2 → Urban/Built-up (Orange)"));
legend.add(ui.Label("3 → Bare Soil      (Tan)"));
legend.add(ui.Label("Classifier: Random Forest (50 trees)"));

Map.add(legend);

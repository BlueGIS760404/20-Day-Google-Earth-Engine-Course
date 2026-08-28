// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟵: 𝗔𝗰𝗰𝘂𝗿𝗮𝗰𝘆 𝗔𝘀𝘀𝗲𝘀𝘀𝗺𝗲𝗻𝘁 & 𝗩𝗮𝗹𝗶𝗱𝗮𝘁𝗶𝗼𝗻
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand why accuracy assessment is critical
// • Split data into training and validation sets
// • Generate a confusion matrix
// • Calculate Overall Accuracy, Producer’s Accuracy, and User’s Accuracy
// • Interpret classification performance
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
  .select(["B2", "B3", "B4", "B8", "B11", "B12"]);

// ─── 3. CREATE TRAINING + VALIDATION DATA ─────────────────────
// Class legend: 0=Water, 1=Vegetation, 2=Urban, 3=Bare soil

var water = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.18, 19.35]), {landcover: 0}),
  ee.Feature(ee.Geometry.Point([-99.12, 19.42]), {landcover: 0}),
  ee.Feature(ee.Geometry.Point([-99.20, 19.38]), {landcover: 0})
]);

var vegetation = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.25, 19.30]), {landcover: 1}),
  ee.Feature(ee.Geometry.Point([-99.05, 19.50]), {landcover: 1}),
  ee.Feature(ee.Geometry.Point([-99.20, 19.48]), {landcover: 1}),
  ee.Feature(ee.Geometry.Point([-99.28, 19.45]), {landcover: 1})
]);

var urban = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.15, 19.43]), {landcover: 2}),
  ee.Feature(ee.Geometry.Point([-99.10, 19.38]), {landcover: 2}),
  ee.Feature(ee.Geometry.Point([-99.08, 19.45]), {landcover: 2}),
  ee.Feature(ee.Geometry.Point([-99.13, 19.40]), {landcover: 2})
]);

var bare = ee.FeatureCollection([
  ee.Feature(ee.Geometry.Point([-99.22, 19.32]), {landcover: 3}),
  ee.Feature(ee.Geometry.Point([-99.28, 19.52]), {landcover: 3}),
  ee.Feature(ee.Geometry.Point([-99.05, 19.28]), {landcover: 3})
]);

var allPoints = water.merge(vegetation).merge(urban).merge(bare);

// Sample the image
var samples = image.sampleRegions({
  collection: allPoints,
  properties: ["landcover"],
  scale: 10
});

// Split into training (70%) and validation (30%)
var withRandom = samples.randomColumn("random");
var training = withRandom.filter(ee.Filter.lt("random", 0.7));
var validation = withRandom.filter(ee.Filter.gte("random", 0.7));

print("Training samples:", training.size());
print("Validation samples:", validation.size());

// ─── 4. TRAIN CLASSIFIER ──────────────────────────────────────
var classifier = ee.Classifier.smileRandomForest(50)
  .train({
    features: training,
    classProperty: "landcover",
    inputProperties: image.bandNames()
  });

// ─── 5. CLASSIFY THE IMAGE ────────────────────────────────────
var classified = image.classify(classifier).rename("landcover");

// ─── 6. ACCURACY ASSESSMENT ───────────────────────────────────
// Classify the validation points
var validated = validation.classify(classifier);

// Create confusion matrix
var confusionMatrix = validated.errorMatrix("landcover", "classification");

print("=== Confusion Matrix ===");
print(confusionMatrix);

print("Overall Accuracy:", confusionMatrix.accuracy());
print("Kappa Coefficient:", confusionMatrix.kappa());
print("Producer's Accuracy:", confusionMatrix.producersAccuracy());
print("User's Accuracy:", confusionMatrix.consumersAccuracy());

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
  palette: ["#1e90ff", "#228b22", "#ff4500", "#d2b48c"]
};

Map.addLayer(image, visRGB, "True Color");
Map.addLayer(classified, classVis, "Land Cover Classification");
Map.addLayer(training, {color: "yellow"}, "Training Points");
Map.addLayer(validation, {color: "cyan"}, "Validation Points");
Map.addLayer(studyArea, {color: "red"}, "Study Area");

// ─── 8. INFO PANEL ────────────────────────────────────────────
var legend = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 9: Accuracy Assessment",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

legend.add(title);
legend.add(ui.Label("0 → Water          (Blue)"));
legend.add(ui.Label("1 → Vegetation     (Green)"));
legend.add(ui.Label("2 → Urban/Built-up (Orange)"));
legend.add(ui.Label("3 → Bare Soil      (Tan)"));
legend.add(ui.Label("Check Console for Accuracy Metrics"));

Map.add(legend);

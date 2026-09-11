// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟮: 𝗠𝗮𝗰𝗵𝗶𝗻𝗲 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗶𝗻 𝗚𝗘𝗘 – 𝗖𝗹𝘂𝘀𝘁𝗲𝗿𝗶𝗻𝗴 & 𝗖𝗹𝗮𝘀𝘀𝗶𝗳𝗶𝗲𝗿𝘀
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand the difference between supervised and unsupervised learning
// • Perform k-means clustering (unsupervised)
// • Train and apply multiple supervised classifiers
// • Compare results from different methods
// • Visualize and interpret machine learning outputs
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
  .clip(studyArea)
  .select(["B2", "B3", "B4", "B8", "B11", "B12"]);

// ─── 3. UNSUPERVISED: k-MEANS CLUSTERING ──────────────────────
// Sample the image to train the clusterer
var training = image.sample({
  region: studyArea,
  scale: 20,
  numPixels: 5000
});

// Train a k-means clusterer with 5 clusters
var clusterer = ee.Clusterer.wekaKMeans(5).train(training);

// Cluster the image
var clustered = image.cluster(clusterer).rename("cluster");

// ─── 4. SUPERVISED: TRAINING DATA ─────────────────────────────
// Classes: 0=Water, 1=Vegetation, 2=Urban, 3=Bare soil
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

var trainingPoints = water.merge(vegetation).merge(urban).merge(bare);

var samples = image.sampleRegions({
  collection: trainingPoints,
  properties: ["landcover"],
  scale: 10
});

// ─── 5. TRAIN MULTIPLE CLASSIFIERS ────────────────────────────
// Random Forest
var rf = ee.Classifier.smileRandomForest(50).train({
  features: samples,
  classProperty: "landcover",
  inputProperties: image.bandNames()
});

// CART (Classification and Regression Tree)
var cart = ee.Classifier.smileCart().train({
  features: samples,
  classProperty: "landcover",
  inputProperties: image.bandNames()
});

// SVM (Support Vector Machine)
var svm = ee.Classifier.libsvm().train({
  features: samples,
  classProperty: "landcover",
  inputProperties: image.bandNames()
});

// Classify with each
var classifiedRF   = image.classify(rf).rename("RF");
var classifiedCART = image.classify(cart).rename("CART");
var classifiedSVM  = image.classify(svm).rename("SVM");

// ─── 6. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visRGB = {
  bands: ["B4", "B3", "B2"],
  min: 0,
  max: 3000
};

var clusterVis = {
  min: 0,
  max: 4,
  palette: ["#1e90ff", "#228b22", "#ff4500", "#d2b48c", "#9370db"]
};

var classVis = {
  min: 0,
  max: 3,
  palette: ["#1e90ff", "#228b22", "#ff4500", "#d2b48c"]
};

Map.addLayer(image, visRGB, "True Color");
Map.addLayer(clustered, clusterVis, "k-Means Clusters (5)");
Map.addLayer(classifiedRF, classVis, "Random Forest");
Map.addLayer(classifiedCART, classVis, "CART");
Map.addLayer(classifiedSVM, classVis, "SVM");
Map.addLayer(trainingPoints, {color: "yellow"}, "Training Points");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 7. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 12: Machine Learning",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("Unsupervised: k-Means (5 clusters)"));
infoPanel.add(ui.Label("Supervised:"));
infoPanel.add(ui.Label("  • Random Forest"));
infoPanel.add(ui.Label("  • CART"));
infoPanel.add(ui.Label("  • SVM"));
infoPanel.add(ui.Label("Toggle layers to compare results"));

Map.add(infoPanel);

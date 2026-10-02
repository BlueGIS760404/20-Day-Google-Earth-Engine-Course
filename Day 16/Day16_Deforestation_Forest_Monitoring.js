// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭𝟲: 𝗗𝗲𝗳𝗼𝗿𝗲𝘀𝘁𝗮𝘁𝗶𝗼𝗻 & 𝗙𝗼𝗿𝗲𝘀𝘁 𝗠𝗼𝗻𝗶𝘁𝗼𝗿𝗶𝗻𝗴
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Use the Hansen Global Forest Change dataset
// • Map forest cover, loss, and gain
// • Calculate deforestation statistics
// • Create a simple forest loss alert map
// • Visualize multi-year forest change
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

// ─── 2. LOAD HANSEN GLOBAL FOREST CHANGE ──────────────────────
// Dataset: Hansen et al. Global Forest Change
var gfc = ee.Image("UMD/hansen/global_forest_change_2023_v1_11");

// Select key bands
var treecover2000 = gfc.select("treecover2000").clip(studyArea);
var loss          = gfc.select("loss").clip(studyArea);
var gain          = gfc.select("gain").clip(studyArea);
var lossyear      = gfc.select("lossyear").clip(studyArea);

// ─── 3. DEFINE FOREST AND LOSS ────────────────────────────────
// Forest in 2000 (tree cover > 30%)
var forest2000 = treecover2000.gt(30).selfMask();

// Forest loss (any year)
var forestLoss = loss.eq(1).selfMask();

// Forest gain
var forestGain = gain.eq(1).selfMask();

// Recent loss (example: 2018–2023 → lossyear codes 18 to 23)
var recentLoss = lossyear.gte(18).and(lossyear.lte(23)).selfMask();

// ─── 4. CALCULATE STATISTICS ──────────────────────────────────
var lossStats = forestLoss.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea,
  scale: 30,
  maxPixels: 1e9
});

var recentLossStats = recentLoss.multiply(ee.Image.pixelArea()).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: studyArea,
  scale: 30,
  maxPixels: 1e9
});

print("=== Forest Statistics (m²) ===");
print("Total forest loss area:", lossStats);
print("Recent forest loss (2018–2023):", recentLossStats);

// ─── 5. VISUALIZATION ─────────────────────────────────────────
Map.centerObject(centerPoint, 11);

var visTreeCover = {
  min: 0,
  max: 100,
  palette: ["#ffffff", "#c8e6c9", "#81c784", "#388e3c", "#1b5e20"]
};

var visLossYear = {
  min: 1,
  max: 23,
  palette: [
    "#ffffcc", "#ffeda0", "#fed976", "#feb24c",
    "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"
  ]
};

Map.addLayer(treecover2000, visTreeCover, "Tree Cover 2000");
Map.addLayer(forest2000, {palette: ["#228b22"]}, "Forest 2000 (>30%)");
Map.addLayer(forestLoss, {palette: ["#ff0000"]}, "All Forest Loss");
Map.addLayer(recentLoss, {palette: ["#ff4500"]}, "Recent Loss (2018–2023)");
Map.addLayer(forestGain, {palette: ["#00ff00"]}, "Forest Gain");
Map.addLayer(lossyear.selfMask(), visLossYear, "Loss Year");
Map.addLayer(studyArea, {color: "white"}, "Study Area");

// ─── 6. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 16: Deforestation Monitoring",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• Tree Cover 2000 → Baseline forest"));
infoPanel.add(ui.Label("• Loss → Deforestation since 2000"));
infoPanel.add(ui.Label("• Gain → Forest regrowth"));
infoPanel.add(ui.Label("• Loss Year → When deforestation occurred"));
infoPanel.add(ui.Label("Check Console for area statistics"));

Map.add(infoPanel);

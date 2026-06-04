// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟭: 𝗜𝗻𝘁𝗿𝗼𝗱𝘂𝗰𝘁𝗶𝗼𝗻 𝘁𝗼 𝗚𝗼𝗼𝗴𝗹𝗲 𝗘𝗮𝗿𝘁𝗵 𝗘𝗻𝗴𝗶𝗻𝗲 – 𝗡𝗗𝗩𝗜 𝘄𝗶𝘁𝗵 𝗦𝗲𝗻𝘁𝗶𝗻𝗲𝗹-𝟮
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
// • Understand what Google Earth Engine is and how it works
// • Learn how to load satellite data (ImageCollection)
// • Filter data by location, time, and quality
// • Calculate vegetation indices (NDVI)
// • Visualize results on the map with a custom legend
// ═══════════════════════════════════════════════════════════════

// ─── 1. DEFINE STUDY AREA AS RECTANGLE ────────────────────────
var studyArea = ee.Geometry.Rectangle({
  coords: [[-99.30, 19.25], [-98.95, 19.60]], // [West, South], [East, North] — Mexico City area
  geodesic: false
});

// Get center for map centering (with error margin)
var centerPoint = studyArea.centroid(1);

// ─── 2. LOAD AND FILTER SENTINEL-2 COLLECTION ─────────────────
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(studyArea)
  .filterDate('2023-01-01', '2023-12-31')
  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 10);

// ─── 3. CREATE CLOUD-FREE COMPOSITE ───────────────────────────
var image = s2.median();

// ─── 4. CALCULATE NDVI ────────────────────────────────────────
var ndvi = image
  .normalizedDifference(['B8', 'B4'])
  .rename('NDVI');

// ─── 5. PRINT INFORMATION ─────────────────────────────────────
print('Number of scenes used:', s2.size());

print('Mean NDVI (study area):', ndvi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: studyArea,
  scale: 10,
  maxPixels: 1e9
}));

// ─── 6. VISUALIZE ON MAP ──────────────────────────────────────
Map.centerObject(centerPoint, 11);

var trueColorVis = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000
};

var ndviVis = {
  min: -0.2,
  max: 0.8,
  palette: ['#7f1d1d', '#b45309', '#fef08a', '#4ade80', '#166534']
};

// Clip images to study area only
var clippedImage = image.clip(studyArea);
var clippedNDVI = ndvi.clip(studyArea);

Map.addLayer(clippedImage, trueColorVis, 'True Color 2023');
Map.addLayer(clippedNDVI, ndviVis, 'NDVI 2023');
Map.addLayer(studyArea, {color: 'red'}, 'Study Area');

// ─── 7. CREATE NDVI LEGEND ────────────────────────────────────
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px',
    backgroundColor: 'rgba(255,255,255,0.85)'
  }
});

var legendTitle = ui.Label({
  value: 'NDVI Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0'
  }
});

legend.add(legendTitle);

// Create smooth gradient
var gradient = ee.Image.pixelLonLat()
    .select('longitude');

var colorBar = ui.Thumbnail({
  image: gradient,
  params: {
    bbox: [0, 0, 100, 10],
    dimensions: '200x20',
    min: 0,
    max: 100,
    palette: [
      '#7f1d1d',
      '#b45309',
      '#fef08a',
      '#4ade80',
      '#166534'
    ]
  },
  style: {
    stretch: 'horizontal',
    margin: '0px 8px'
  }
});

legend.add(colorBar);

// Aligned labels
var labels = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal'),
  style: {
    stretch: 'horizontal'
  }
});

var minLabel = ui.Label('-0.2');
minLabel.style().set({
  width: '65px',
  textAlign: 'left'
});

var midLabel = ui.Label('0.3');
midLabel.style().set({
  width: '70px',
  textAlign: 'center'
});

var maxLabel = ui.Label('0.8');
maxLabel.style().set({
  width: '65px',
  textAlign: 'right'
});

labels.add(minLabel);
labels.add(midLabel);
labels.add(maxLabel);
legend.add(labels);

Map.add(legend);

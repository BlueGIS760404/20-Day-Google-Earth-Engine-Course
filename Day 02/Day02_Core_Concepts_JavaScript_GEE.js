// ═══════════════════════════════════════════════════════════════
// 𝗗𝗮𝘆 𝟮: 𝗖𝗼𝗿𝗲 𝗖𝗼𝗻𝗰𝗲𝗽𝘁𝘀 & 𝗝𝗮𝘃𝗮𝗦𝗰𝗿𝗶𝗽𝘁 𝗶𝗻 𝗚𝗼𝗼𝗴𝗹𝗲 𝗘𝗮𝗿𝘁𝗵 𝗘𝗻𝗴𝗶𝗻𝗲
// 𝗟𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗢𝗯𝗷𝗲𝗰𝘁𝗶𝘃𝗲𝘀
//    • Master variables, functions, and control flow in GEE
//    • Understand and work with Geometries (Point, Line, Polygon, Rectangle)
//    • Create and manage Features and FeatureCollections
//    • Use Dictionaries for storing metadata
//    • Learn the critical difference between Client-side vs Server-side
//    • Build reusable functions for cleaner code
// ═══════════════════════════════════════════════════════════════

// ─── 1. DEFINE STUDY AREA (Reusing Day 1) ─────────────────────
var studyArea = ee.Geometry.Rectangle({
  coords: [
    [-99.3, 19.25],
    [-98.95, 19.6]
  ],
  geodesic: false
});

var centerPoint = studyArea.centroid(1);

// ─── 2. WORKING WITH GEOMETRIES ───────────────────────────────
var point = ee.Geometry.Point([-99.13, 19.43]);
var line = ee.Geometry.LineString([[-99.2, 19.3], [-99.0, 19.5]]);
var polygon = ee.Geometry.Polygon([[
  [-99.25, 19.3],
  [-99.0, 19.3],
  [-99.0, 19.55],
  [-99.25, 19.55],
  [-99.25, 19.3]
]]);

// ─── 3. FEATURES & FEATURECOLLECTION ──────────────────────────
var feature = ee.Feature(point, {
  name: "Mexico City Center",
  type: "Capital",
  population: 9200000
});

var cities = ee.FeatureCollection([
  feature,
  ee.Feature(line, {name: "Highway Segment", type: "Infrastructure"}),
  ee.Feature(polygon, {name: "Urban Zone", type: "Area"})
]);

// ─── 4. DICTIONARIES & VARIABLES ──────────────────────────────
var metadata = ee.Dictionary({
  course: "Google Earth Engine Mastery",
  day: 2,
  topic: "Core Concepts & JavaScript",
  instructor: "Your Name"
});

print("Course Metadata:", metadata);

// ─── 5. CREATE REUSABLE FUNCTION ──────────────────────────────
var addStudyLayers = function(geometry, name, color) {
  Map.addLayer(geometry, {color: color}, name);
  return geometry;
};

// Use the function
addStudyLayers(studyArea, "Study Area (Rectangle)", "red");
addStudyLayers(point, "Point of Interest", "blue");
addStudyLayers(line, "Line Example", "yellow");

// ─── 6. CLIENT vs SERVER CONCEPTS ─────────────────────────────
print("=== CLIENT vs SERVER DEMO ===");

// Server-side (Earth Engine)
var serverArea = studyArea.area(100).divide(1e6);   // km²
print("Server-side Area (km²):", serverArea);

// Client-side (JavaScript)
var clientInfo = {
  studyAreaType: studyArea.type(),
  featureCount: cities.size()
};
print("Client-side Info:", clientInfo);

// ─── 7. VISUALIZE & CENTER MAP ────────────────────────────────
Map.centerObject(centerPoint, 11);

Map.addLayer(cities, {color: "white"}, "FeatureCollection");

// ─── 8. INFO PANEL ────────────────────────────────────────────
var infoPanel = ui.Panel({
  style: {
    position: "bottom-left",
    padding: "8px 15px",
    backgroundColor: "rgba(255,255,255,0.85)"
  }
});

var title = ui.Label({
  value: "Day 2: Core Concepts",
  style: {fontWeight: "bold", fontSize: "16px", margin: "0 0 8px 0"}
});

infoPanel.add(title);
infoPanel.add(ui.Label("• ee.Geometry → Points, Lines, Polygons, Rectangles"));
infoPanel.add(ui.Label("• ee.Feature → Geometry + Properties"));
infoPanel.add(ui.Label("• ee.FeatureCollection → Group of features"));
infoPanel.add(ui.Label("• ee.Dictionary → Key-value metadata"));
infoPanel.add(ui.Label("• Functions → Make code reusable"));
infoPanel.add(ui.Label("• Client vs Server → Key GEE concept"));

Map.add(infoPanel);

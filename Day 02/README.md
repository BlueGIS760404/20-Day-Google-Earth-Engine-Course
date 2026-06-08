# Day 2 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.Geometry.Rectangle()`                | Creates a rectangular polygon from coordinates                    | Defines the study area                                             | `coords: [[W,S], [E,N]]`, `geodesic: false` |
| `ee.Geometry.Point()`                    | Creates a single point geometry                                   | Represents specific locations                                      | `[lon, lat]` |
| `ee.Geometry.LineString()`               | Creates a line geometry                                           | Represents linear features (roads, rivers, etc.)                   | Array of coordinates |
| `ee.Geometry.Polygon()`                  | Creates a polygon geometry                                        | Represents area features                                           | Array of coordinate rings |
| `.centroid(1)`                           | Returns the center point of a geometry                            | Centers the map on the study area                                  | Error margin in meters |
| `ee.Feature()`                           | Creates a feature (geometry + properties)                         | Stores attributes with spatial data                                | Geometry + Dictionary |
| `ee.FeatureCollection()`                 | Creates a collection of features                                  | Groups multiple features together                                  | Array of Features |
| `ee.Dictionary()`                        | Creates a key-value data structure                                | Stores metadata and properties                                     | Object with key-value pairs |
| `function() { ... }`                     | Defines a reusable JavaScript function                            | Makes code modular and reusable                                    | Parameters and logic |
| `Map.addLayer()`                         | Adds geometry or image to the map                                 | Visualizes geometries and features                                 | Geometry, style, name |
| `studyArea.area(100)`                    | Calculates the area of a geometry (server-side)                   | Gets area in square meters                                         | Error margin (meters) |
| `.divide(1e6)`                           | Divides a number (used for unit conversion)                       | Converts m² to km²                                                 | Number |
| `studyArea.type()`                       | Returns the type of a geometry (client-side)                      | Inspects object type                                               | — |
| `cities.size()`                          | Returns the number of elements in a collection                    | Gets count of features                                             | — |
| `ui.Panel()`                             | Creates a UI panel container                                      | Holds information panel on the map                                 | `style` object |
| `ui.Label()`                             | Creates a text label                                              | Displays titles and bullet points                                  | `value`, `style` |
| `Map.centerObject()`                     | Centers and zooms the map on a geometry                           | Sets initial map view                                              | Geometry, zoom level |
| `print()`                                | Prints values to the Console                                      | Debugging and showing results                                      | Any value / EE object |

---

**Last Updated:** June 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 2 – Core Concepts & JavaScript in GEE

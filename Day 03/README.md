# Day 3 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a stack (time series) of images                             | Access multiple satellite scenes                                   | Dataset ID |
| `.first()`                               | Returns the first image in a collection                           | Work with a single image                                           | — |
| `.median()`                              | Reduces collection to one image using median                      | Creates cloud-free composite                                       | — |
| `.mosaic()`                              | Combines images (last on top wins)                                | Creates seamless mosaic from multiple scenes                       | — |
| `.clip()`                                | Clips an image to a geometry boundary                             | Limits data to study area (clean edges)                            | Geometry |
| `.select()`                              | Selects specific bands from an image                              | Work with RGB, NIR, etc.                                           | Band names (array) |
| `.addBands()`                            | Adds new band(s) to an existing image                             | Add NDVI, indices, or calculated layers                            | Image or band |
| `.normalizedDifference()`                | Calculates normalized difference index                            | Compute NDVI, NDWI, etc.                                           | Two band names |
| `ee.Geometry.Rectangle()`                | Creates rectangular study area                                    | Define area of interest                                            | Coordinates |
| `.centroid()`                            | Gets center point of geometry                                     | Center the map view                                                | Error margin |
| `Map.addLayer()`                         | Adds image or geometry to the map                                 | Visualize results                                                  | Image/Geometry, visParams, name |
| `Map.centerObject()`                     | Centers and zooms the map                                         | Set good initial view                                              | Geometry, zoom level |
| `ui.Panel()`                             | Creates a UI panel                                                | Build custom info panels/legends                                   | Style object |
| `ui.Label()`                             | Creates text label                                                | Display titles and explanations on map                             | Value, style |
| `print()`                                | Prints to Console                                                 | Inspect objects and debug                                          | Any value |

---

**Last Updated:** July 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 3 – Image vs ImageCollection Deep Dive

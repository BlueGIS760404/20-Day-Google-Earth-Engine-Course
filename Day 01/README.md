# Day 1 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                          | What it does                                                      | Why we use it                                                      | Key Parameters |
|-------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.Geometry.Rectangle()`                 | Creates a rectangular polygon from coordinates                    | Defines the study area                                             | `coords: [[W,S], [E,N]]`, `geodesic: false` |
| `.centroid(1)`                            | Returns the center point of a geometry with error margin          | Centers the map nicely on the rectangle                            | Error margin in meters |
| `ee.ImageCollection()`                    | Loads a stack of many images (time series)                        | Accesses all available Sentinel-2 scenes                           | Dataset ID string |
| `.filterBounds()`                         | Keeps only images that intersect with the geometry                | Reduces data to your rectangular study area                        | Geometry (Rectangle) |
| `.filterDate()`                           | Keeps images within a specific date range                         | Focuses analysis on one year                                       | Start and end date (YYYY-MM-DD) |
| `.filterMetadata()`                       | Filters based on image properties                                 | Removes cloudy images (<10% cloud cover)                           | Property name, operator (`less_than`), value |
| `.median()`                               | Reduces ImageCollection to one image by taking median pixel values| Creates a clean, cloud-free composite                              | — |
| `.normalizedDifference(['B8','B4'])`      | Calculates (NIR - Red) / (NIR + Red)                              | Standard way to compute NDVI                                       | Array of 2 band names |
| `.rename()`                               | Gives a new name to a band                                        | Makes code cleaner and easier to read                              | New band name (string) |
| `print()`                                 | Displays information in the Console panel                         | Helps debug and understand results                                 | Any Earth Engine object |
| `reduceRegion()`                          | Calculates statistics over an area                                | Gets average NDVI inside the study area                            | `reducer`, `geometry`, `scale` |
| `ee.Reducer.mean()`                       | Defines the type of statistic to calculate                        | Used with `reduceRegion` for mean value                            | — |
| `Map.centerObject()`                      | Centers the map on a geometry                                     | Ensures the study area is in the center of the view                | Geometry + zoom level |
| `.clip()`                                 | Clips an image to the boundary of a geometry                      | Shows results only inside the rectangular study area               | Geometry |
| `Map.addLayer()`                          | Adds image or geometry to the map                                 | Visualizes clipped results                                         | Image, visualization params, name |
| `visParams (object)`                      | Controls how an image is displayed (colors, min/max)              | Makes True Color and NDVI look good                                | `bands`, `min`, `max`, `palette` |
| `ee.Image.pixelLonLat()`                  | Creates an image with pixel longitude and latitude bands          | Used to generate a smooth color gradient for the legend            | — |
| `.select('longitude')`                    | Selects a specific band from an image                             | Extracts longitude band for the color bar                          | Band name |
| `ui.Panel()`                              | Creates a UI panel/container                                      | Holds the legend elements                                          | `style` object |
| `ui.Label()`                              | Creates a text label                                              | Used for legend title and value labels                             | `value`, `style` |
| `ui.Thumbnail()`                          | Creates a thumbnail image from an Earth Engine image              | Generates the color gradient bar for the NDVI legend               | `image`, `params` |
| `ui.Panel.Layout.flow('horizontal')`      | Sets layout direction for UI elements                             | Arranges min/mid/max labels horizontally                           | `'horizontal'` |
| `.add()`                                  | Adds child elements to a UI panel                                 | Builds the legend structure (title, colorbar, labels)              | UI element |
| `.style().set()`                          | Modifies the style of a UI element                                | Aligns and formats labels (width, text alignment)                  | Style properties |
| `Map.add()`                               | Adds a UI element (like legend) to the map                        | Displays the custom NDVI legend on the map                         | UI object |

---

*Last Updated: June 2026*
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 1 – NDVI Analysis with Sentinel-2
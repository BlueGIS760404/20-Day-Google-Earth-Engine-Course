# Day 4 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant, low-cloud images                                 | Geometry, dates, metadata |
| `.median()`                              | Creates a median composite                                        | Produces a clean, cloud-reduced image                              | — |
| `.clip()`                                | Clips image to study area                                         | Restricts analysis to the rectangle                                | Geometry |
| `function() { ... }`                     | Creates a reusable function                                       | Calculates indices cleanly and repeatedly                          | Input image |
| `.normalizedDifference()`                | Calculates (Band1 − Band2) / (Band1 + Band2)                      | Standard way to compute many spectral indices                      | Two band names |
| `.expression()`                          | Evaluates a mathematical expression on image bands                | Used for more complex indices (EVI, SAVI)                          | Formula + band mapping |
| `.rename()`                              | Renames a band                                                    | Makes results clearer                                              | New name |
| `ee.Image.cat()`                         | Concatenates multiple single-band images                          | Combines all indices into one multi-band image                     | Array of images |
| `.bandNames()`                           | Returns the names of bands in an image                            | Inspects what indices were calculated                              | — |
| `Map.addLayer()`                         | Adds image to the map                                             | Visualizes True Color and different indices                        | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |

### Spectral Indices Covered

| Index | Formula Focus                          | Best For                          |
|-------|----------------------------------------|-----------------------------------|
| **NDVI**  | (NIR − Red) / (NIR + Red)             | General vegetation                |
| **EVI**   | 2.5 × ((NIR − Red) / (NIR + 6×Red − 7.5×Blue + 1)) | Dense vegetation (less saturation) |
| **NDRE**  | (NIR − Red Edge) / (NIR + Red Edge)   | Chlorophyll / crop health         |
| **NDBI**  | (SWIR − NIR) / (SWIR + NIR)           | Built-up / urban areas            |
| **NDWI**  | (Green − NIR) / (Green + NIR)         | Water bodies                      |
| **SAVI**  | ((NIR − Red) / (NIR + Red + L)) × (1 + L) | Vegetation with soil background |

---

**Last Updated:** July 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 4 – Spectral Indices (Beyond NDVI)

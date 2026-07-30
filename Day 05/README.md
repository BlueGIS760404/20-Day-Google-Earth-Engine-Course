# Day 5 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image in a collection                 | Processes the entire collection efficiently                        | Function |
| `.select("SCL")`                         | Selects the Scene Classification Layer band                       | Accesses pixel class information                                   | Band name |
| `.eq()` / `.neq()` / `.or()` / `.and()`  | Logical operations on image bands                                 | Builds complex masks                                               | Values / other bands |
| `.updateMask()`                          | Applies a mask to an image (hides unwanted pixels)                | Removes clouds, shadows, and bad pixels                            | Mask image |
| `.copyProperties()`                      | Copies properties from one image to another                       | Preserves important metadata (e.g. time)                           | Image, property list |
| `.median()`                              | Creates a median composite                                        | Reduces remaining noise after masking                              | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Creates vegetation index on clean data                             | Band names |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes masked vs unmasked results                              | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Inspects collection sizes and results                              | Any value |

### SCL Band Classes (Important)

| SCL Value | Class Description              | Action in this script      |
|-----------|--------------------------------|----------------------------|
| 3         | Cloud shadow                   | Masked (removed)           |
| 4         | Vegetation                     | Kept                       |
| 5         | Bare soil                      | Kept                       |
| 6         | Water                          | Kept                       |
| 7         | Unclassified                   | Kept                       |
| 8         | Cloud (medium probability)     | Masked (removed)           |
| 9         | Cloud (high probability)       | Masked (removed)           |
| 10        | Thin cirrus                    | Masked (removed)           |

---

**Last Updated:** July 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 5 – Cloud Masking & Quality Filtering

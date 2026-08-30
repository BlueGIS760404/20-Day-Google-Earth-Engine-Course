# Day 10 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data for two periods                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images for before/after periods                   | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces clean before and after images                             | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Creates vegetation index for both periods                          | Band names |
| `.subtract()`                            | Subtracts one image from another                                  | Calculates NDVI change (After − Before)                            | Another image |
| `.where()`                               | Conditionally assigns values based on thresholds                  | Classifies change into loss / gain / no-change                     | Condition, value |
| `.rename()`                              | Renames a band                                                    | Makes results clearer                                              | New name |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Summarizes magnitude of change                                     | reducer, geometry, scale |
| `ee.Reducer.mean()` / `.stdDev()` / `.minMax()` | Calculates summary statistics                               | Describes the change distribution                                  | — |
| `.combine()`                             | Combines multiple reducers                                        | Gets several statistics in one operation                           | Other reducer |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes before, after, NDVI, and change maps                    | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays change statistics                                         | Any value |

### Key Concepts Covered

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Before / After Composites** | Two images from different time periods           | Foundation of change detection          |
| **Image Differencing**        | Subtracting one image from another               | Simple and effective change method      |
| **NDVI Change**               | After NDVI − Before NDVI                         | Highlights vegetation gain or loss      |
| **Threshold Classification**  | Grouping change into meaningful classes          | Makes results easier to interpret       |

### Change Classes Used

| Class Value | Meaning                     | Color on Map |
|-------------|-----------------------------|--------------|
| 0           | No significant change       | Gray         |
| 1           | Significant vegetation loss  | Red          |
| 2           | Significant vegetation gain  | Green        |

---

**Last Updated:** August 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 10 – Change Detection (Before/After & NDVI Differencing)

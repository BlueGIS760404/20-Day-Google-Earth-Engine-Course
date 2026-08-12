# Day 7 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking to the collection                            | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for analysis                                | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Creates vegetation index for statistics                            | Band names |
| `reduceRegion()`                         | Calculates statistics over a single geometry                      | Gets mean, median, stdDev, etc. for the whole study area           | reducer, geometry, scale |
| `reduceRegions()`                        | Calculates statistics over multiple features                      | Gets statistics for each zone separately                           | collection, reducer, scale |
| `ee.Reducer.mean()`                      | Calculates the mean value                                         | Average NDVI                                                       | — |
| `ee.Reducer.median()`                    | Calculates the median value                                       | Robust central tendency                                            | — |
| `ee.Reducer.stdDev()`                    | Calculates standard deviation                                     | Measures variability                                               | — |
| `ee.Reducer.minMax()`                    | Calculates minimum and maximum                                    | Finds range of values                                              | — |
| `ee.Reducer.percentile()`                | Calculates percentile values                                      | Gets 25th and 75th percentiles                                     | Array of percentiles |
| `.combine()`                             | Combines multiple reducers into one                               | Calculates several statistics in a single operation                | Other reducer, sharedInputs |
| `ee.FeatureCollection()`                 | Creates a collection of features                                  | Groups multiple analysis zones                                     | Array of Features |
| `ee.Feature()`                           | Creates a feature with geometry + properties                      | Defines each analysis zone                                         | Geometry + Dictionary |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes NDVI and zones                                          | Image/Geometry, style, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays statistical results                                       | Any value |

### Key Concepts Covered

| Concept                    | Description                                      | Why it matters                          |
|---------------------------|--------------------------------------------------|-----------------------------------------|
| **reduceRegion**          | Statistics over one geometry                     | Quick summary of an area                |
| **reduceRegions**         | Statistics over many features                    | Compare different zones                 |
| **Combining Reducers**    | Calculate multiple stats at once                 | Efficient and organized results         |
| **Zonal Statistics**      | Extracting numbers from images by zone           | Essential for reporting and analysis    |

---

**Last Updated:** August 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 7 – Reducers & Zonal Statistics

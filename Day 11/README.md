# Day 11 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access multi-year Sentinel-2 data                                  | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Adds cloud mask and NDVI to each image                             | Function |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Creates vegetation index time series                               | Band names |
| `.addBands()`                            | Adds new band(s) to an image                                      | Adds NDVI and time bands                                           | Image or band |
| `.copyProperties()`                      | Copies properties from one image to another                       | Preserves acquisition date                                         | Image, property list |
| `ui.Chart.image.series()`                | Creates a time series chart                                       | Visualizes NDVI changes over time                                  | imageCollection, region, reducer, scale |
| `.setOptions()`                          | Customizes chart appearance                                       | Adds titles, axis labels, styling                                  | Options object |
| `ee.Date()` / `.difference()`            | Works with dates and calculates time differences                  | Creates a continuous time variable (in years)                      | Date, unit |
| `ee.Reducer.linearFit()`                 | Fits a linear regression (y = a + b*x)                            | Calculates trend (slope and intercept) of NDVI                     | — |
| `.reduce()`                              | Applies a reducer over an ImageCollection                         | Computes the linear fit across time                                | Reducer |
| `.select()`                              | Selects specific bands                                            | Isolates slope or intercept                                        | Band names |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Summarizes the trend (mean slope, etc.)                            | reducer, geometry, scale |
| `ee.Reducer.mean()` / `.stdDev()` / `.minMax()` | Calculates summary statistics                               | Describes the distribution of the trend                            | — |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes the slope (trend) map                                   | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values and charts to the Console                           | Displays the time series chart and statistics                      | Chart or any value |

### Key Concepts Covered

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Time Series Chart**         | Graph of NDVI values over time                   | Reveals seasonal and multi-year patterns |
| **Linear Trend Fitting**      | Fitting a straight line to the time series       | Quantifies rate of change               |
| **Slope**                     | Rate of change of NDVI per year                  | Positive = greening, Negative = decline |
| **Intercept**                 | Starting value of the trend line                 | Baseline NDVI at the start of the period |

### Interpreting the Slope Map

| Slope Value     | Meaning                          | Color on Map |
|-----------------|----------------------------------|--------------|
| Negative        | Declining vegetation             | Red          |
| Near zero       | Stable                           | Yellow       |
| Positive        | Increasing vegetation            | Green        |

---

**Last Updated:** September 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 11 – Time Series Analysis II (Charting & Trends)

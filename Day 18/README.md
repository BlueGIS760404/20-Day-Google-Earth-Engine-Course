# Day 18 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access full year of Sentinel-2 data                                | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking and adds EVI                                 | Function |
| `.expression()`                          | Evaluates a mathematical expression on image bands                | Calculates EVI                                                     | Formula + band mapping |
| `.addBands()`                            | Adds new band(s) to an image                                      | Adds EVI band to each image                                        | Image or band |
| `.copyProperties()`                      | Copies properties from one image to another                       | Preserves acquisition date                                         | Image, property list |
| `.filterDate()`                          | Filters images by date range                                      | Creates seasonal composites                                        | Start and end dates |
| `.median()`                              | Creates a median composite                                        | Produces clean seasonal images                                     | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.select()`                              | Selects specific bands                                            | Isolates EVI for visualization and stats                           | Band name |
| `ui.Chart.image.series()`                | Creates a time series chart                                       | Visualizes EVI phenology over the year                             | imageCollection, region, reducer, scale |
| `.setOptions()`                          | Customizes chart appearance                                       | Adds titles and axis labels                                        | Options object |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Summarizes summer EVI values                                       | reducer, geometry, scale |
| `ee.Reducer.mean()` / `.stdDev()` / `.minMax()` | Calculates summary statistics                               | Describes crop vigor distribution                                  | — |
| `.combine()`                             | Combines multiple reducers                                        | Gets several statistics in one operation                           | Other reducer |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes True Color and seasonal EVI                             | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values and charts to the Console                           | Displays the phenology chart and statistics                        | Chart or any value |

### Key Concepts Covered

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **EVI**                       | Enhanced Vegetation Index                        | Better than NDVI for dense crops        |
| **Phenology**                 | Study of seasonal plant life cycles              | Tracks crop growth stages               |
| **Seasonal Composites**       | Spring / Summer / Autumn images                  | Shows crop development over time        |
| **Time Series Chart**         | Graph of EVI values through the year             | Reveals planting, peak, and harvest     |

### EVI Formula

\[
\text{EVI} = 2.5 \times \frac{\text{NIR} - \text{Red}}{\text{NIR} + 6 \times \text{Red} - 7.5 \times \text{Blue} + 1}
\]

### Layers Created in this Lesson

| Layer              | Meaning                          | Color / Style on Map     |
|--------------------|----------------------------------|--------------------------|
| Summer True Color  | Optical view of the area         | Natural colors           |
| EVI Spring         | Early growth stage               | Brown → Green            |
| EVI Summer         | Peak vegetation / crops          | Brown → Green            |
| EVI Autumn         | Senescence / harvest period      | Brown → Green            |

---

**Last Updated:** October 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 18 – Agricultural Monitoring (Crop Mapping & Phenology)

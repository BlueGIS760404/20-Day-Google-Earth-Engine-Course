# Day 15 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for analysis                                | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.normalizedDifference()`                | Calculates (Band1 − Band2) / (Band1 + Band2)                      | Computes NDWI and MNDWI                                            | Two band names |
| `.gt()` / `.and()` / `.lte()`             | Logical comparisons on image bands                                | Creates water masks and classifies permanent/seasonal water        | Threshold values |
| `.selfMask()`                            | Masks pixels where the value is zero or null                      | Shows only water pixels cleanly                                    | — |
| `ee.Image()`                             | Loads a single image (here: JRC Global Surface Water)             | Accesses long-term water products                                  | Image ID |
| `.select()`                              | Selects specific bands from an image                              | Extracts occurrence, change, seasonality, transition               | Band name |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Counts water pixels in the study area                              | reducer, geometry, scale |
| `ee.Reducer.sum()`                       | Sums pixel values                                                 | Estimates total water area (in pixels)                             | — |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes indices, masks, and JRC products                        | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays water statistics                                          | Any value |

### Water Indices Covered

| Index   | Formula                              | Bands Used     | Best For                          |
|---------|--------------------------------------|----------------|-----------------------------------|
| **NDWI**  | (Green − NIR) / (Green + NIR)       | B3, B8         | General water detection           |
| **MNDWI** | (Green − SWIR) / (Green + SWIR)     | B3, B11        | Better separation from built-up   |

### JRC Global Surface Water Bands

| Band            | Description                                      | Typical Use                     |
|-----------------|--------------------------------------------------|---------------------------------|
| `occurrence`    | Frequency of water presence (0–100%)             | Permanent vs seasonal water     |
| `change_abs`    | Absolute change in occurrence                    | Water body expansion/shrinkage  |
| `seasonality`   | Number of months water is present                | Seasonal patterns               |
| `transition`    | Class of water change over time                  | Long-term transitions           |

### Water Classes in this Script

| Class              | Definition                          | Color on Map |
|--------------------|-------------------------------------|--------------|
| Permanent Water    | Occurrence > 90%                    | Dark Blue    |
| Seasonal Water     | Occurrence 10–90%                   | Cyan         |
| Water Mask (MNDWI) | MNDWI > 0.1                         | Blue         |

---

**Last Updated:** September 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 15 – Hydrology & Water Mapping

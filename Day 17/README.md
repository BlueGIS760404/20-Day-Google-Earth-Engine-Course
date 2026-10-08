# Day 17 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 and VIIRS data                                   | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()` / `.mean()`                  | Creates composite images                                          | Produces clean optical and nighttime lights composites             | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.select()`                              | Selects specific bands                                            | Extracts avg_rad from VIIRS                                        | Band name |
| `.normalizedDifference()`                | Calculates (Band1 − Band2) / (Band1 + Band2)                      | Computes NDBI                                                      | Two band names |
| `.gt()`                                  | Greater-than comparison                                           | Creates built-up mask from NDBI                                    | Threshold value |
| `.selfMask()`                            | Masks pixels where the value is zero or null                      | Shows only built-up pixels cleanly                                 | — |
| `ee.Image.pixelArea()`                   | Creates an image of pixel area in square meters                   | Converts pixel counts into real area                               | — |
| `.multiply()`                            | Multiplies two images                                             | Calculates built-up area                                           | Another image |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Summarizes built-up area and nighttime lights                      | reducer, geometry, scale |
| `ee.Reducer.sum()` / `.mean()` / `.max()`| Calculates summary statistics                                     | Quantifies urban extent and light intensity                        | — |
| `.combine()`                             | Combines multiple reducers                                        | Gets several statistics in one operation                           | Other reducer |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes True Color, NDBI, built-up, and nighttime lights        | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays urban statistics                                          | Any value |

### Key Indices & Datasets

| Name                    | Formula / Source                          | Best For                          |
|-------------------------|-------------------------------------------|-----------------------------------|
| **NDBI**                | (SWIR − NIR) / (SWIR + NIR)               | Built-up / urban areas            |
| **Built-up Mask**       | NDBI > 0.1                                | Simple urban extent mapping       |
| **VIIRS Nighttime Lights** | NOAA/VIIRS/DNB monthly composites      | Urban intensity & human activity  |

### Layers Created in this Lesson

| Layer                        | Meaning                                      | Color / Style on Map      |
|-----------------------------|----------------------------------------------|---------------------------|
| True Color                  | Sentinel-2 optical view                      | Natural colors            |
| NDBI                        | Built-up index                               | Blue → Yellow → Brown     |
| Built-up Mask               | Areas likely to be urban                     | Orange                    |
| VIIRS Nighttime Lights      | Average radiance (2023)                      | Black → Purple → Yellow   |

### Key Concepts

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **NDBI**                      | Spectral index sensitive to built-up surfaces    | Maps urban areas from optical data      |
| **Nighttime Lights**          | Measures artificial light at night               | Proxy for urban intensity and activity  |
| **Multi-source Urban Mapping**| Combining optical + nighttime data               | More robust urban analysis              |

---

**Last Updated:** October 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 17 – Urban Analysis (NDBI, Built-up & Nighttime Lights)

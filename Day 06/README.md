# Day 6 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access full year of Sentinel-2 data                                | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image in a collection                 | Processes the entire collection or list of months                  | Function |
| `ee.List.sequence()`                     | Creates a list of sequential numbers                              | Generates months 1–12 for monthly composites                       | Start, end |
| `ee.Date.fromYMD()`                      | Creates a date from year, month, day                              | Defines start of each month                                        | Year, month, day |
| `.advance()`                             | Advances a date by a time unit                                    | Calculates end of each month                                       | Number, unit |
| `ee.ImageCollection.fromImages()`        | Creates an ImageCollection from a list of images                  | Builds the monthly composites collection                           | List of images |
| `.median()`                              | Creates a median composite                                        | Reduces monthly/seasonal images to one clean image                 | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.set()`                                 | Sets a property on an image                                       | Adds month number and time information                             | Key, value |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Creates vegetation index for each season                           | Band names |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes seasonal RGB and NDVI                                   | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Inspects collection sizes and results                              | Any value |

### Key Concepts Covered

| Concept                    | Description                                      | Why it matters                          |
|---------------------------|--------------------------------------------------|-----------------------------------------|
| **Monthly Composites**    | One median image per month                       | Captures intra-annual variation         |
| **Seasonal Composites**   | Grouped by Spring / Summer / Autumn / Winter     | Reveals phenology and seasonal patterns |
| **Time-based Filtering**  | Using `.filterDate()` with precise ranges        | Isolates specific periods               |
| **`.map()` over time**    | Applying functions across months                 | Efficient time series processing        |

---

**Last Updated:** August 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 6 – Time Series Analysis I (Monthly & Seasonal Composites)

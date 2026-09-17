# Day 14 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 and Landsat data                                 | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `ee.Filter.and()` / `ee.Filter.or()`     | Combines multiple filter conditions                               | Creates complex filtering logic                                    | Multiple filters |
| `ee.Filter.lt()` / `ee.Filter.gt()`      | Filters by less than / greater than                               | Filters by cloud cover or date                                     | Property, value |
| `ee.Filter.maxDifference()`              | Matches items within a maximum difference                         | Finds images close in time                                         | difference, leftField, rightField |
| `ee.Join.saveAll()`                      | Joins two collections and saves all matches                       | Combines Sentinel-2 and Landsat images                             | matchesKey, measureKey |
| `.apply()`                               | Applies a join to two collections                                 | Executes the temporal join                                         | Primary collection, secondary, filter |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for visualization                           | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.updateMask()`                          | Applies a mask to an image                                        | Removes cloudy pixels                                              | Mask image |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes results                                                 | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Inspects collection sizes and join results                         | Any value |

### Key Concepts Covered

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Complex Filters**           | Combining multiple conditions with `and` / `or`  | Precise data selection                  |
| **Temporal Join**             | Matching images from different sensors by time   | Multi-sensor analysis                   |
| **ee.Join.saveAll()**         | Saves all matching secondary images              | Flexible way to link collections        |
| **maxDifference Filter**      | Allows matching within a time window             | Handles different acquisition schedules |

### Common Use Cases

| Use Case                              | How Joins Help                              |
|---------------------------------------|---------------------------------------------|
| Multi-sensor composites               | Combine Sentinel-2 + Landsat                |
| Validation with higher-resolution data| Match coarse and fine resolution images     |
| Filling gaps in time series           | Use another sensor when one has clouds      |
| Cross-calibration studies             | Compare values from different sensors       |

---

**Last Updated:** September 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 14 – Advanced Filtering & Joins

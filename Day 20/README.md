# Day 20 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.Geometry.Rectangle()`                | Creates the study area                                            | Defines the analysis region                                        | Coordinates |
| `.centroid()`                            | Gets the center of the geometry                                   | Centers the map                                                    | Error margin |
| `ee.ImageCollection()`                   | Loads Sentinel-2 data                                             | Accesses satellite imagery                                         | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters the collection                                     | Selects relevant, low-cloud images                                 | Geometry, dates, metadata |
| `.map()`                                 | Applies functions to every image                                  | Cloud masking + index calculation                                  | Function |
| `.median()`                              | Creates a composite                                               | Produces a clean final image                                       | — |
| `.clip()`                                | Clips to the study area                                           | Limits the output extent                                           | Geometry |
| `.normalizedDifference()`                | Calculates spectral indices                                       | Creates NDVI, NDWI, NDBI                                           | Band names |
| `.addBands()`                            | Adds new bands to an image                                        | Combines original bands with indices                               | Image or bands |
| `.where()`                               | Conditionally assigns class values                                | Builds a simple land cover classification                          | Condition, value |
| `reduceRegion()`                         | Calculates statistics over the study area                         | Summarizes NDVI                                                    | reducer, geometry, scale |
| `ee.Reducer.mean()` / `.stdDev()` / `.minMax()` | Computes summary statistics                                 | Describes the results                                              | — |
| `.combine()`                             | Combines multiple reducers                                        | Efficient multi-statistic calculation                              | Other reducer |
| `Map.addLayer()`                         | Displays layers                                                   | Shows True Color, NDVI, and classification                         | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets a good starting view                                          | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates the info panel                                            | Provides a clean interface                                         | Style, value |
| `Export.image.toDrive()`                 | Exports results (optional)                                        | Saves the final product                                            | image, description, region, scale |

### Best Practices Covered in Day 20

| Best Practice                        | Description                                      | Benefit                               |
|--------------------------------------|--------------------------------------------------|---------------------------------------|
| **Clear section comments**           | Divide code into numbered, labeled blocks        | Easy to read and maintain             |
| **Reusable functions**               | `maskS2clouds()` and `addIndices()`              | Avoids repetition, reduces errors     |
| **Filter early**                     | Bounds + date + cloud filter first               | Better performance                    |
| **Modular index calculation**        | One function adds all needed indices             | Clean and scalable                    |
| **Simple rule-based classification** | Using `.where()` conditions                      | Fast and easy to understand           |
| **Organized visualization**          | Logical layer order + legend panel               | Better user experience                |
| **Optional export**                  | Commented export block                           | Ready when needed                     |

### Final Project Layers

| Layer                  | Meaning                                      | Color / Style              |
|------------------------|----------------------------------------------|----------------------------|
| True Color             | Optical view of the area                     | Natural colors             |
| NDVI                   | Vegetation condition                         | Brown → Green              |
| Simple Land Cover      | Water / Vegetation / Built-up                | Blue / Green / Orange      |

### Classification Classes

| Class Value | Land Cover Type     | Color on Map |
|-------------|---------------------|--------------|
| 0           | Other / Unclassified| Gray         |
| 1           | Water               | Blue         |
| 2           | Vegetation          | Green        |
| 3           | Built-up            | Orange       |

---

**Last Updated:** October 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 20 – Final Project + Best Practices

---

### Course Completion

**Congratulations!**  
You have successfully completed the full **20-Day Google Earth Engine Mastery Course**.

You now have practical experience with:
- ImageCollections, filtering, and composites
- Spectral indices and cloud masking
- Time series analysis and change detection
- Supervised & unsupervised classification
- Accuracy assessment and zonal statistics
- Exporting data and building interactive apps
- Clean, reusable, and portfolio-ready code

You are ready to apply these skills to real research and professional projects.

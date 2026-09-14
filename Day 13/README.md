# Day 13 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for export                                  | — |
| `.clip()`                                | Clips image to study area                                         | Limits the exported area                                           | Geometry |
| `.select()`                              | Selects specific bands                                            | Chooses which bands to export                                      | Band names |
| `.normalizedDifference()`                | Calculates NDVI                                                   | Adds vegetation index to the export image                          | Band names |
| `.addBands()`                            | Adds new band(s) to an image                                      | Combines original bands with NDVI                                  | Image or band |
| `.toFloat()`                             | Converts image data type to float                                 | Ensures compatibility for GeoTIFF export                           | — |
| `Export.image.toDrive()`                 | Exports an image to Google Drive                                  | Downloads the result as GeoTIFF                                    | image, description, folder, region, scale, etc. |
| `Export.image.toAsset()`                 | Exports an image to Earth Engine Asset                            | Saves the result inside GEE for later use                          | image, description, assetId, region, scale |
| `Export.table.toDrive()`                 | Exports a FeatureCollection to Google Drive                       | Downloads statistics as CSV (or other formats)                     | collection, description, folder, fileFormat |
| `Export.table.toAsset()`                 | Exports a FeatureCollection to Earth Engine Asset                 | Saves the table inside GEE                                         | collection, description, assetId |
| `reduceRegions()`                        | Calculates statistics over multiple features                      | Creates a table of zonal statistics for export                     | collection, reducer, scale |
| `ee.FeatureCollection()` / `ee.Feature()`| Creates zones for statistics                                      | Defines areas whose stats will be exported                         | Geometry + properties |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes what will be exported                                   | Image/Geometry, style, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints messages to the Console                                    | Reminds user to run the export tasks                               | Any value |

### Key Export Parameters

| Parameter          | Meaning                                      | Typical Value          |
|--------------------|----------------------------------------------|------------------------|
| `description`      | Name of the task in the Tasks tab            | Short descriptive name |
| `folder`           | Google Drive folder                          | "GEE_Exports"          |
| `fileNamePrefix`   | Name of the output file                      | Without extension      |
| `region`           | Area to export                               | Geometry               |
| `scale`            | Pixel size in meters                         | 10 (for Sentinel-2)    |
| `crs`              | Coordinate Reference System                  | "EPSG:4326"            |
| `maxPixels`        | Maximum number of pixels allowed             | 1e9 or higher          |
| `fileFormat`       | Output format                                | "GeoTIFF" or "CSV"     |

### Important Notes

- After running the script, go to the **Tasks** tab and click **Run** for each export.
- Exports can take several minutes depending on size.
- Always set a reasonable `scale` and `region` to avoid very large files.
- Change `users/your_username/` to your own Earth Engine username when exporting to Asset.

---

**Last Updated:** September 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 13 – Exporting Data (Drive, Asset, GeoTIFF & Tables)

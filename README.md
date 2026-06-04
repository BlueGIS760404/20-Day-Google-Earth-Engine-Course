Google Earth Engine 20-Day Course Outline

Day | Topic                                      | Focus                                      | Key GEE Functions
----|--------------------------------------------|--------------------------------------------|--------------------------------------------
1   | NDVI & Sentinel-2 Basics                   | ImageCollection, Filtering, Band Math, Visualization | ee.ImageCollection, .filterBounds, .filterDate, .filterMetadata, .median(), .normalizedDifference(), Map.addLayer
2   | Core Concepts & JavaScript in GEE          | Variables, Functions, Geometry, FeatureCollection    | ee.Geometry, ee.Feature, ee.Dictionary, client vs server objects
3   | Image vs ImageCollection Deep Dive         | Single images, mosaicking, clipping                  | .clip(), .mosaic(), .select(), .addBands()
4   | Spectral Indices (Beyond NDVI)             | EVI, NDRE, NDBI, NDWI, SAVI                          | Custom functions for indices
5   | Cloud Masking & Quality Filtering          | Advanced Sentinel-2 cleaning                         | SCL band, cloud probability, custom masks
6   | Time Series Analysis I                     | Monthly/Seasonal composites                          | .map(), reducers over time
7   | Reducers & Zonal Statistics                | Mean, median, stdDev, percentiles                    | reduceRegion, reduceRegions, ee.Reducer
8   | Land Cover Classification I                | Supervised classification (Random Forest)            | ee.Classifier, training data
9   | Accuracy Assessment & Validation           | Confusion matrix, overall accuracy                   | ee.Classifier methods
10  | Change Detection                           | Before-After, LandTrendr basics                      | Image differencing, normalizedDifference time series
11  | Time Series Analysis II                    | Charting, trends                                     | ui.Chart, ee.Reducer.linearFit
12  | Machine Learning in GEE                    | Clustering (kMeans), more classifiers                | Unsupervised + Supervised
13  | Exporting Data                             | Drive, Asset, GeoTIFF, tables                        | Export.image.toDrive, Export.table
14  | Advanced Filtering & Joins                 | ee.Join, complex filters                             | ImageCollection joins
15  | Hydrology & Water Mapping                  | NDWI, MNDWI, water occurrence                        | JRC Global Surface Water
16  | Deforestation & Forest Monitoring          | Hansen Global Forest Change, custom alerts           | Time-series forest loss
17  | Urban Analysis                             | NDBI, Built-up indices, nighttime lights             | VIIRS + Sentinel
18  | Agricultural Monitoring                    | Crop mapping, phenology                              | EVI time series
19  | App Development in GEE                     | Building interactive web apps                        | ui.* widgets, Map.onClick
20  | Final Project + Best Practices             | Portfolio project + optimization

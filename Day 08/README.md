# Day 8 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for classification                          | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.select()`                              | Selects specific bands                                            | Chooses useful bands for classification                            | Band names |
| `ee.Feature()`                           | Creates a feature with geometry + properties                      | Defines training points with class labels                          | Geometry + Dictionary |
| `ee.FeatureCollection()`                 | Creates a collection of features                                  | Groups all training points                                         | Array of Features |
| `.merge()`                               | Combines multiple FeatureCollections                              | Merges water, vegetation, urban, and bare soil points              | Another collection |
| `.sampleRegions()`                       | Extracts image values at feature locations                        | Creates the training dataset from the image                        | collection, properties, scale |
| `ee.Classifier.smileRandomForest()`      | Creates a Random Forest classifier                                | Powerful supervised classification algorithm                       | Number of trees |
| `.train()`                               | Trains the classifier using labeled samples                       | Learns the relationship between bands and classes                  | features, classProperty, inputProperties |
| `.classify()`                            | Applies the trained classifier to an image                        | Produces the final land cover map                                  | Classifier |
| `.explain()`                             | Returns information about the trained classifier                  | Inspects model details                                             | — |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes True Color, classification, and training points         | Image/Geometry, style, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the classification legend                                   | Style, value |

### Classification Classes Used

| Class Value | Land Cover Type     | Color on Map |
|-------------|---------------------|--------------|
| 0           | Water               | Blue         |
| 1           | Vegetation          | Green        |
| 2           | Urban / Built-up    | Orange       |
| 3           | Bare Soil           | Tan          |

### Key Concepts

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Supervised Classification** | Uses labeled training data to train a model      | Most accurate way to map land cover     |
| **Training Data**             | Points/polygons with known class labels          | Quality of training data = quality of map |
| **Random Forest**             | Ensemble of decision trees                       | Robust and widely used classifier       |
| **sampleRegions**             | Links image pixel values to class labels         | Creates the actual training table       |

---

**Last Updated:** August 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 8 – Land Cover Classification I (Supervised – Random Forest)

# Day 12 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for analysis                                | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.select()`                              | Selects specific bands                                            | Chooses useful bands for ML                                        | Band names |
| `.sample()`                              | Randomly samples pixels from an image                             | Creates training data for clustering                               | region, scale, numPixels |
| `ee.Clusterer.wekaKMeans()`              | Creates a k-means clusterer                                       | Performs unsupervised classification                               | Number of clusters |
| `.train()`                               | Trains a clusterer or classifier                                  | Learns patterns from the data                                      | Training features |
| `.cluster()`                             | Applies a trained clusterer to an image                           | Assigns each pixel to a cluster                                    | Clusterer |
| `ee.Feature()` / `ee.FeatureCollection()`| Creates labeled training points                                   | Builds supervised training dataset                                 | Geometry + properties |
| `.merge()`                               | Combines multiple FeatureCollections                              | Merges all class samples                                           | Another collection |
| `.sampleRegions()`                       | Extracts image values at feature locations                        | Creates supervised training samples                                | collection, properties, scale |
| `ee.Classifier.smileRandomForest()`      | Creates a Random Forest classifier                                | Robust supervised classifier                                       | Number of trees |
| `ee.Classifier.smileCart()`              | Creates a CART decision tree classifier                           | Simple and interpretable supervised model                          | — |
| `ee.Classifier.libsvm()`                 | Creates a Support Vector Machine classifier                       | Powerful alternative supervised method                             | — |
| `.classify()`                            | Applies a trained classifier to an image                          | Produces the final classification map                              | Classifier |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes True Color, clusters, and classifications               | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |

### Key Concepts Covered

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Unsupervised Learning**     | Finds patterns without labeled data              | Useful when you have no training points |
| **k-Means Clustering**        | Groups similar pixels into k clusters            | Quick way to explore spectral groups    |
| **Supervised Learning**       | Uses labeled examples to train a model           | More accurate when good labels exist    |
| **Random Forest**             | Ensemble of decision trees                       | Generally the strongest performer       |
| **CART**                      | Single decision tree                             | Easy to interpret                       |
| **SVM**                       | Finds optimal separating hyperplane              | Good alternative method                 |

### Classification Classes (Supervised)

| Class Value | Land Cover Type     | Color on Map |
|-------------|---------------------|--------------|
| 0           | Water               | Blue         |
| 1           | Vegetation          | Green        |
| 2           | Urban / Built-up    | Orange       |
| 3           | Bare Soil           | Tan          |

---

**Last Updated:** September 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 12 – Machine Learning in GEE (Clustering & Classifiers)

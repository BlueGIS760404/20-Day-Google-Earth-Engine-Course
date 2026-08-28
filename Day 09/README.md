# Day 9 - Functions Explained

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
| `ee.Feature()` / `ee.FeatureCollection()`| Creates labeled training/validation points                        | Builds the reference dataset                                       | Geometry + properties |
| `.merge()`                               | Combines multiple FeatureCollections                              | Merges all class samples                                           | Another collection |
| `.sampleRegions()`                       | Extracts image values at feature locations                        | Creates the sample table                                           | collection, properties, scale |
| `.randomColumn()`                        | Adds a random number column                                       | Enables random splitting of data                                   | Column name |
| `.filter()`                              | Filters a collection based on a condition                         | Separates training and validation sets                             | Filter |
| `ee.Classifier.smileRandomForest()`      | Creates a Random Forest classifier                                | Trains the supervised model                                        | Number of trees |
| `.train()`                               | Trains the classifier                                             | Learns from the training samples                                   | features, classProperty, inputProperties |
| `.classify()`                            | Applies the classifier to an image or features                    | Produces classified map and validates points                       | Classifier |
| `.errorMatrix()`                         | Creates a confusion matrix                                        | Compares predicted vs actual classes                               | Actual property, predicted property |
| `.accuracy()`                            | Calculates Overall Accuracy                                       | Main accuracy metric                                               | — |
| `.kappa()`                               | Calculates Kappa coefficient                                      | Measures agreement beyond chance                                   | — |
| `.producersAccuracy()`                   | Calculates Producer’s Accuracy (per class)                        | Shows how well each class was detected                             | — |
| `.consumersAccuracy()`                   | Calculates User’s Accuracy (per class)                            | Shows reliability of each predicted class                          | — |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes results and sample points                               | Image/Geometry, style, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the legend and info panel                                   | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays accuracy metrics                                          | Any value |

### Accuracy Metrics Explained

| Metric                    | What it means                                      | Ideal Value |
|--------------------------|----------------------------------------------------|-------------|
| **Overall Accuracy**     | Percentage of correctly classified samples         | Close to 1.0 |
| **Kappa Coefficient**    | Agreement beyond random chance                     | Close to 1.0 |
| **Producer’s Accuracy**  | How well the classifier finds real class members   | High per class |
| **User’s Accuracy**      | How reliable a predicted class is                  | High per class |

### Classification Classes

| Class Value | Land Cover Type     | Color on Map |
|-------------|---------------------|--------------|
| 0           | Water               | Blue         |
| 1           | Vegetation          | Green        |
| 2           | Urban / Built-up    | Orange       |
| 3           | Bare Soil           | Tan          |

---

**Last Updated:** August 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 9 – Accuracy Assessment & Validation

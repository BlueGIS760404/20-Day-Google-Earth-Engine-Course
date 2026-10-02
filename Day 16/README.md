# Day 16 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.Image()`                             | Loads a single image (Hansen Global Forest Change)                | Accesses global forest cover and change data                       | Image ID |
| `.select()`                              | Selects specific bands from the Hansen dataset                    | Extracts treecover2000, loss, gain, lossyear                       | Band names |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.gt()` / `.eq()` / `.gte()` / `.lte()` / `.and()` | Logical operations on image bands                        | Defines forest, loss, gain, and recent loss masks                  | Threshold values |
| `.selfMask()`                            | Masks pixels where the value is zero or null                      | Shows only forest / loss / gain pixels cleanly                     | — |
| `ee.Image.pixelArea()`                   | Creates an image of pixel area in square meters                   | Converts pixel counts into real area                               | — |
| `.multiply()`                            | Multiplies two images                                             | Calculates area of forest loss                                     | Another image |
| `reduceRegion()`                         | Calculates statistics over a geometry                             | Sums total deforestation area                                      | reducer, geometry, scale |
| `ee.Reducer.sum()`                       | Sums pixel values                                                 | Computes total area of loss                                        | — |
| `Map.addLayer()`                         | Adds layers to the map                                            | Visualizes tree cover, loss, gain, and loss year                   | Image, visParams, name |
| `Map.centerObject()`                     | Centers the map                                                   | Sets good initial view                                             | Geometry, zoom |
| `ui.Panel()` / `ui.Label()`              | Creates custom UI elements                                        | Builds the information panel                                       | Style, value |
| `print()`                                | Prints values to the Console                                      | Displays deforestation area statistics                             | Any value |

### Hansen Global Forest Change – Key Bands

| Band             | Description                                      | Values / Meaning                     |
|------------------|--------------------------------------------------|--------------------------------------|
| `treecover2000`  | Tree canopy cover in the year 2000               | 0–100 (%)                            |
| `loss`           | Forest loss during 2000–2023                     | 1 = loss occurred                    |
| `gain`           | Forest gain during 2000–2012                     | 1 = gain occurred                    |
| `lossyear`       | Year of forest loss                              | 1 = 2001 … 23 = 2023                 |

### Layers Created in this Lesson

| Layer                        | Meaning                                      | Color on Map     |
|-----------------------------|----------------------------------------------|------------------|
| Tree Cover 2000             | Baseline forest density                      | Green gradient   |
| Forest 2000 (>30%)          | Areas considered forest in 2000              | Dark green       |
| All Forest Loss             | Any deforestation since 2000                 | Red              |
| Recent Loss (2018–2023)     | Deforestation in the last ~6 years           | Orange-red       |
| Forest Gain                 | Areas of forest regrowth                     | Bright green     |
| Loss Year                   | When the loss occurred                       | Yellow → Dark red |

### Key Concepts

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Baseline Forest**           | Tree cover in the year 2000                      | Reference for measuring change          |
| **Forest Loss**               | Conversion of forest to non-forest               | Core deforestation indicator            |
| **Loss Year**                 | The specific year deforestation happened         | Enables temporal analysis and alerts    |
| **Area Calculation**          | Using pixelArea × mask                           | Converts maps into real-world statistics|

---

**Last Updated:** October 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 16 – Deforestation & Forest Monitoring

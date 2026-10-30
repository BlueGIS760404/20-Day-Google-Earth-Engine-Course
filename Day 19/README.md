# Day 19 - Functions Explained

**Very Important Section** — Master these core Google Earth Engine functions

## Functions Table

| Function / Method                        | What it does                                                      | Why we use it                                                      | Key Parameters |
|------------------------------------------|-------------------------------------------------------------------|--------------------------------------------------------------------|------------------------|
| `ee.ImageCollection()`                   | Loads a time series of satellite images                           | Access Sentinel-2 data                                             | Dataset ID |
| `.filterBounds()` / `.filterDate()` / `.filterMetadata()` | Filters collection by location, time, and quality          | Selects relevant images                                            | Geometry, dates, metadata |
| `.map()`                                 | Applies a function to every image                                 | Applies cloud masking                                              | Function |
| `.median()`                              | Creates a median composite                                        | Produces a clean image for the app                                 | — |
| `.clip()`                                | Clips image to study area                                         | Limits analysis to the rectangle                                   | Geometry |
| `.normalizedDifference()`                | Calculates spectral indices                                       | Creates NDVI, NDWI, and NDBI                                       | Two band names |
| `ui.Label()`                             | Creates a text label                                              | Displays titles, descriptions, and click results                   | value, style |
| `ui.Select()`                            | Creates a dropdown selector                                       | Lets users choose which layer to display                           | items, value, onChange |
| `ui.Button()`                            | Creates a clickable button                                        | Resets the map view                                                | label, onClick |
| `ui.Panel()`                             | Creates a container for UI widgets                                | Organizes the app interface                                        | widgets, style |
| `Map.add()`                              | Adds a UI panel to the map                                        | Displays the control panel                                         | UI object |
| `Map.layers().reset()`                   | Clears all current map layers                                     | Prepares the map for a new layer                                   | — |
| `Map.addLayer()`                         | Adds an image or geometry to the map                              | Displays the selected layer                                        | Image, visParams, name |
| `Map.onClick()`                          | Registers a function that runs when the user clicks the map       | Enables interactive pixel inspection                               | Callback function |
| `ee.Geometry.Point()`                    | Creates a point geometry from coordinates                         | Defines the clicked location                                       | [lon, lat] |
| `ee.Image.cat()`                         | Concatenates multiple images into one                             | Combines NDVI, NDWI, and NDBI for sampling                         | Array of images |
| `reduceRegion()`                         | Extracts values at a point                                        | Gets pixel values under the click                                  | reducer, geometry, scale |
| `.evaluate()`                            | Brings server-side results to the client                          | Displays values in the UI                                          | Callback function |
| `Map.centerObject()`                     | Centers the map                                                   | Sets or resets the view                                            | Geometry, zoom |
| `Map.setOptions()`                       | Changes the basemap                                               | Sets HYBRID (satellite + labels)                                   | Basemap name |

### Key UI Widgets Used

| Widget          | Purpose                                      | Example in this App                |
|-----------------|----------------------------------------------|------------------------------------|
| `ui.Label`      | Display text                                 | Title, description, click results  |
| `ui.Select`     | Dropdown menu for choices                    | Layer selector                     |
| `ui.Button`     | Trigger an action                            | Reset View button                  |
| `ui.Panel`      | Layout container                             | Left-side control panel            |

### Key App Concepts

| Concept                        | Description                                      | Why it matters                          |
|-------------------------------|--------------------------------------------------|-----------------------------------------|
| **Interactive Layer Switching** | Users choose what to see                         | Makes the app flexible and user-friendly|
| **Map Click Interaction**     | Click to inspect pixel values                    | Turns the map into an analysis tool     |
| **Client vs Server**          | `.evaluate()` brings results to the browser      | Required for dynamic UI updates         |
| **Publishing an App**         | Use the Apps tab in the Code Editor              | Share your work with others             |

---

**Last Updated:** October 2026  
**Course:** Google Earth Engine Mastery – 20-Day Course  
**Day:** 19 – App Development in GEE (Interactive Web Apps)

// Historical water mask — Landsat 5 TM, 1986
// Platform: Google Earth Engine Code Editor (JavaScript)
//
// WHAT THIS SCRIPT DOES
// 1. Loads Landsat 5 Collection 2 Level-2 surface reflectance.
// 2. Filters to the recorded 29 October 1986 acquisition date and WRS path/row.
// 3. Masks cloud, cloud shadow, and saturated pixels using QA bands.
// 4. Applies the Collection 2 surface-reflectance scale/offset.
// 5. Calculates NDWI and applies the project's working threshold NDWI > 0.2.
// 6. Displays the scene and water mask and exports a GeoTIFF.
//
// BEFORE RUNNING
// - Draw or import your actual project analysis-area polygon in the Code Editor.
// - This script uses a broad analysis-area fallback rectangle. Replace it with
//   your verified polygon for a final export.
// - Inspect the selected scene and cloud conditions before exporting.
// - Exports go to Google Drive; no Windows/local file paths are used.
//
// Note: exact scene selection should be verified against the original project
// record before claiming exact reproduction. *For this portfolio, scripts only from 1986 and 2025 are included.
// Replace the dates and other info at your discretion to match the actual project record. GG.

var aoi = ee.Geometry.Rectangle([93.5476, 26.7472, 94.1558, 27.3507]);

var collection = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
  .filterBounds(aoi)
  .filterDate('1986-10-28', '1986-10-31')
  .filter(ee.Filter.eq('WRS_PATH', 135))
  .filter(ee.Filter.eq('WRS_ROW', 41))
  .sort('CLOUD_COVER');

print('Candidate Landsat 5 scenes:', collection.size());
print('Candidate scene IDs:', collection.aggregate_array('LANDSAT_PRODUCT_ID'));

var image = ee.Image(collection.first());
print('Selected scene:', image.get('LANDSAT_PRODUCT_ID'));
print('Acquisition date:', image.date().format('YYYY-MM-dd'));
print('Scene cloud cover (%):', image.get('CLOUD_COVER'));

// QA_PIXEL bits: 1 dilated cloud, 2 cirrus (not generally used for TM),
// 3 cloud, 4 cloud shadow, 5 snow. QA_RADSAT flags saturation.
var qa = image.select('QA_PIXEL');
var clear = qa.bitwiseAnd(1 << 1).eq(0)
  .and(qa.bitwiseAnd(1 << 3).eq(0))
  .and(qa.bitwiseAnd(1 << 4).eq(0))
  .and(qa.bitwiseAnd(1 << 5).eq(0))
  .and(image.select('QA_RADSAT').eq(0));

// Landsat 4–5 TM C2 L2 surface reflectance scale and offset.
var reflectance = image.select(['SR_B2', 'SR_B4'])
  .multiply(0.0000275)
  .add(-0.2)
  .updateMask(clear);

var green = reflectance.select('SR_B2');
var nir = reflectance.select('SR_B4');
var ndwi = green.subtract(nir).divide(green.add(nir)).rename('NDWI');
var waterMask = ndwi.gt(0.2).rename('water').toByte().clip(aoi);

Map.centerObject(aoi, 10);
Map.addLayer(image.clip(aoi), {bands: ['SR_B3', 'SR_B2', 'SR_B1'], min: 7000, max: 18000}, 'Landsat 5 display (raw DN)');
Map.addLayer(ndwi.clip(aoi), {min: -0.5, max: 0.5, palette: ['8c510a', 'f6e8c3', '01665e']}, 'NDWI');
Map.addLayer(waterMask.selfMask(), {palette: ['1677ff']}, 'Water mask: NDWI > 0.2');
Map.addLayer(aoi, {color: 'yellow'}, 'Analysis area', false);

print('Water mask (1 = water):', waterMask);
print('Water mask pixel summary (0/1):', waterMask.reduceRegion({
  reducer: ee.Reducer.frequencyHistogram(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8,
  bestEffort: true
}));

Export.image.toDrive({
  image: waterMask,
  description: 'Brahmaputra_WaterMask_1986_v2',
  folder: 'Assam_Brahmaputra_Flood_Risk',
  fileNamePrefix: 'Brahmaputra_WaterMask_1986_v2',
  region: aoi,
  crs: 'EPSG:32646',
  scale: 30,
  maxPixels: 1e13
});

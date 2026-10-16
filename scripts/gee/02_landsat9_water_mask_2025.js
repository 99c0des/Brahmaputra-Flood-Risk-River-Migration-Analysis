// Historical water mask — Landsat 9 OLI-2, 2025
// Platform: Google Earth Engine Code Editor (JavaScript)
//
// The project used selected water-mask observations through 2025 and NDWI > 0.2.
// This is a commented template: verify the actual 2025 scene/date used in the
// saved project before treating it as an exact reproduction.
//
// NDWI = (Green - NIR) / (Green + NIR)
//
// Landsat 8/9 bands: Green = SR_B3; NIR = SR_B5.
// Collection 2 Level-2 surface-reflectance scale = 0.0000275, offset = -0.2.
// Draw/import the final project polygon before export; this fallback geometry
// matches the approximate project-area extent and is not a substitute for it.

var aoi = ee.Geometry.Rectangle([93.5476, 26.7472, 94.1558, 27.3507]);

var collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
  .filterBounds(aoi)
  .filterDate('2025-01-01', '2026-01-01')
  .filter(ee.Filter.lt('CLOUD_COVER', 30))
  .sort('CLOUD_COVER');

print('Candidate Landsat 9 scenes:', collection.size());
print('Candidate scene IDs:', collection.aggregate_array('LANDSAT_PRODUCT_ID'));

var image = ee.Image(collection.first());
print('Selected scene:', image.get('LANDSAT_PRODUCT_ID'));
print('Acquisition date:', image.date().format('YYYY-MM-dd'));
print('Scene cloud cover (%):', image.get('CLOUD_COVER'));

var qa = image.select('QA_PIXEL');
var clear = qa.bitwiseAnd(1 << 1).eq(0)  // dilated cloud
  .and(qa.bitwiseAnd(1 << 2).eq(0))      // cirrus
  .and(qa.bitwiseAnd(1 << 3).eq(0))      // cloud
  .and(qa.bitwiseAnd(1 << 4).eq(0))      // cloud shadow
  .and(qa.bitwiseAnd(1 << 5).eq(0))      // snow
  .and(image.select('QA_RADSAT').eq(0));

var reflectance = image.select(['SR_B3', 'SR_B5'])
  .multiply(0.0000275)
  .add(-0.2)
  .updateMask(clear);

var green = reflectance.select('SR_B3');
var nir = reflectance.select('SR_B5');
var ndwi = green.subtract(nir).divide(green.add(nir)).rename('NDWI');
var waterMask = ndwi.gt(0.2).rename('water').toByte().clip(aoi);

Map.centerObject(aoi, 10);
Map.addLayer(image.clip(aoi), {bands: ['SR_B4', 'SR_B3', 'SR_B2'], min: 7000, max: 18000}, 'Landsat 9 display (raw DN)');
Map.addLayer(ndwi, {min: -0.5, max: 0.5, palette: ['8c510a', 'f6e8c3', '01665e']}, 'NDWI');
Map.addLayer(waterMask.selfMask(), {palette: ['1677ff']}, 'Water mask: NDWI > 0.2');
Map.addLayer(aoi, {color: 'yellow'}, 'Analysis area', false);

Export.image.toDrive({
  image: waterMask,
  description: 'Brahmaputra_WaterMask_2025_template',
  folder: 'Assam_Brahmaputra_Flood_Risk',
  fileNamePrefix: 'Brahmaputra_WaterMask_2025_template',
  region: aoi,
  crs: 'EPSG:32646',
  scale: 30,
  maxPixels: 1e13
});

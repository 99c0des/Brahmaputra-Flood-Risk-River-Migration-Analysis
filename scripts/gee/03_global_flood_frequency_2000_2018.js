// Historical flood-event frequency — Global Flood Database, 2000–2018
// Platform: Google Earth Engine Code Editor (JavaScript)
//
// WORKFLOW
// - Filter Global Flood Database events to a broad Assam bounding box.
// - For each event, select flooded pixels and exclude permanent-water pixels.
// - Sum the binary event masks to count the number of events per pixel.
// - Clip the output to the project analysis polygon and export.
//
// IMPORTANT
// The event product is MODIS-derived and coarser than the project's 30 m grid.
// Exporting at 30 m is for alignment with the QGIS analysis grid only; it does
// not create new 30 m flood observations. Check the product documentation and
// inspect bands/metadata before rerunning. Event counts are not probabilities.
//
// Before final export, replace the example project-area rectangle below with
// the exact analysis polygon used for the QGIS project.

var projectAoi = ee.Geometry.Rectangle([93.5476, 26.7472, 94.1558, 27.3507]);

// Broad filter area used to find events affecting Assam. This is not the
// final analysis boundary; projectAoi is used for clipping/export.
var assamBounds = ee.Geometry.Rectangle([89.5, 24.0, 96.0, 28.5]);

var floods = ee.ImageCollection('GLOBAL_FLOOD_DB/MODIS_EVENTS/V1');
var assamFloods = floods.filterBounds(assamBounds);

print('Global Flood Database collection size:', floods.size());
print('Assam-intersecting events:', assamFloods.size());
print('First matching event:', assamFloods.first());

var floodMasks = assamFloods.map(function(image) {
  image = ee.Image(image);
  var flooded = image.select('flooded').gt(0);
  var permanentWater = image.select('jrc_perm_water').gt(0);
  return flooded.and(permanentWater.not())
    .rename('flood')
    .toByte()
    .copyProperties(image, image.propertyNames());
});

var floodFrequency = floodMasks.sum()
  .rename('flood_event_frequency')
  .clip(projectAoi)
  .toInt16();

var floodVis = {
  min: 0,
  max: 15,
  palette: ['ffffff', 'fff7bc', 'fec44f', 'fe9929', 'ec7014', 'cc4c02', '8c2d04']
};

Map.centerObject(projectAoi, 9);
Map.addLayer(floodFrequency, floodVis, 'Flood event frequency (2000–2018)');
Map.addLayer(projectAoi, {color: 'cyan'}, 'Project analysis area', false);

print('Flood frequency image:', floodFrequency);
print('Flood frequency statistics:', floodFrequency.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: projectAoi,
  scale: 250,
  maxPixels: 1e8,
  bestEffort: true
}));

Export.image.toDrive({
  image: floodFrequency,
  description: 'flood_event_frequency_2000_2018',
  folder: 'Assam_Brahmaputra_Flood_Risk',
  fileNamePrefix: 'flood_event_frequency_2000_2018',
  region: projectAoi,
  crs: 'EPSG:32646',
  // 30 m export grid supports overlay alignment only. Source detail is coarser.
  scale: 30,
  maxPixels: 1e13
});

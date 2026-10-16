# Reproducibility and project hand-off

## Software recorded in the project

- QGIS 4.2.2 (Belém do Pará)
- GDAL 3.13.3
- Python 3.12.14
- PROJ 9.8.1
- Google Earth Engine Code Editor (JavaScript)

Software versions can change; record the versions used if the analysis is rerun.

## Coordinate system and grid

- Main CRS: EPSG:32646 (WGS 84 / UTM zone 46N).
- Common aligned grid for key outputs: approximately 30 m, 1,999 columns × 2,230 rows.
- Check each input's CRS, extent, pixel size, alignment, NoData value, and valid-data footprint before combining rasters.

## Recommended rerun sequence

1. Open the GEE scripts in `scripts/gee/`.
2. Define/import the project study-area polygon in the GEE Code Editor; inspect each selected scene and layer before export.
3. Export each water mask and the separate flood-frequency raster to a destination you choose. No local file paths are hard-coded in the scripts.
4. In QGIS, load the exported rasters and the verified building-footprint layer.
5. Confirm all inputs are in the correct CRS and align them to the documented analysis grid using appropriate resampling for each data type.
6. Recreate the water-change indicators and inspect them visually.
7. Check the flood-frequency raster's valid-data percentage and extent before normalization. Do not use a raster with zero valid pixels or a mismatched extent.
8. Reproduce integrated hazard and final risk scores using the actual raster-calculator expressions saved with the project.
9. Verify the final classes, NoData footprint, class counts, and map legends.
10. Export the four final maps and update their filenames in the README.

## Important portability notes

- Use relative paths in the QGIS project where practical (`Project Properties → General → Paths` or save a portable project copy with relative paths).
- Keep large rasters in a separate data location if they exceed GitHub's normal file-size limits; provide a manifest and instructions rather than silently omitting them.
- Never commit machine-specific Windows paths, temporary folders, credentials, or private data.
- The repository GEE scripts are commented examples/templates, not a guarantee of exact reproduction of every original scene selection or QGIS calculation.
- Before claiming exact reproducibility, record the exact QGIS raster-calculator expressions, normalization rules, class breaks, scene IDs, source data links, and resampling choices.

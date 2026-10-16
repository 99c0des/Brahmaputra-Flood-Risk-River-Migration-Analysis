# Methodology

## 1. Purpose and scope

This project combines historical river-water change, a separate historical flood-event dataset, and building footprints to create a **relative-risk screening map** for the analysis area around Majuli and the Brahmaputra floodplain in Assam, India.

The objective is to identify places that merit closer assessment—not to predict an exact future river path or automatically classify a settlement for relocation.

## 2. Study area and grid

- Study area: the project analysis polygon around Majuli, Assam; it is not the whole state of Assam.
- Main CRS: WGS 84 / UTM zone 46N (**EPSG:32646**).
- Key aligned analysis grid: approximately 30 m; 1,999 columns × 2,230 rows for several final rasters.
- All overlays should be checked for common CRS, extent, pixel alignment, and NoData handling.

A common 30 m grid helps combine layers consistently, but it does not improve the native resolution of coarser inputs.

## 3. Historical water masks from Landsat

Landsat Collection 2 Level-2 surface-reflectance scenes were used to map water for selected years. The project records identify the main mask years as **1986, 1996, 2000, 2005, 2010, 2015, 2020, and 2025**. Exact scenes and cloud conditions vary by year; see the scene metadata and script comments before rerunning.

The normalized difference water index (NDWI) is:

```text
NDWI = (Green - Near Infrared) / (Green + Near Infrared)
```

The working threshold was **NDWI > 0.2** for a water mask. Cloud/shadow QA masking and visual inspection are important because shadows, sediment-rich water, seasonal water, and mixed pixels can affect the result.

The included GEE scripts demonstrate the 1986 Landsat 5 and 2025 Landsat 9 cases. They are path-free templates; the user should select the appropriate scene and study-area geometry in GEE before exporting. They do not claim to reproduce every historical scene selection automatically.

## 4. River-water change indicators in QGIS

The water masks were compared across selected dates to build change intervals. Derived outputs recorded in the project include:

- historical river migration envelope, 1986–2025;
- water occurrence across selected observations;
- gain/loss change rasters between observation periods;
- river migration activity;
- gain and loss frequency;
- distance/proximity indicators; and
- river-migration susceptibility score, 1986–2025.

These layers describe historical mapped water changes. They should not be described as a validated erosion-rate model or an exact future-channel forecast.

## 5. Historical flood-event frequency

A **separate** flood-event source was used so that flood frequency is not confused with the river-water occurrence raster. The GEE source collection recorded in the project is:

`GLOBAL_FLOOD_DB/MODIS_EVENTS/V1`

The workflow filters events intersecting a broad Assam bounding box, creates an event-level flood mask using the `flooded` band, removes pixels flagged as permanent water by `jrc_perm_water`, and sums the binary event masks. The project record shows **139 intersecting events** used in the run.

The resulting frequency raster is an event count for the 2000–2018 product period. It is not a return period, annual probability, flood depth, or flood severity score. Event footprints are MODIS-derived and much coarser than a 30 m Landsat grid. Reprojecting or resampling the raster to the project grid is for overlay consistency only; it does not create 30 m flood observations.

## 6. Building exposure

Building footprints clipped to the analysis area were used to represent the spatial distribution of mapped structures. The project records approximately **129,660 building features** in the clipped layer. The original source and licence must be confirmed from the downloaded dataset metadata before final publication; do not claim an OpenStreetMap/Geofabrik source unless that is verified.

A rasterized building-area layer was also created. Building footprints are an exposure proxy only: they do not provide population, occupancy, building condition, household wealth, or the likelihood of structural damage.

## 7. Integrated hazard and relative risk

The project combines historical river-migration indicators and flood-hazard information into an integrated hazard indicator, then combines hazard information with building exposure to create a final relative-risk score and five classes.

Known output names include:

- `integrated_hazard_score_1986_2025_final.tif`
- `final_risk_score_1986_2025.tif`
- `risk_classes_1986_2025.tif`

The final risk-class raster uses classes 1–5, displayed as Very Low, Low, Moderate, High, and Very High Risk. The exact final weighting, normalization equation, NoData treatment, and class breaks are **not stated here as facts** because they must be verified against the actual QGIS raster-calculator expressions and saved outputs. Before publishing a fully reproducible numerical methodology, record those expressions and the classification method from the project.

## 8. Cartographic outputs

Four map exports were selected as distinct products:

1. Flood Event Frequency (2000–2018).
2. Historical River Migration (1986–2025).
3. Integrated Historical Hazard.
4. Final Relative Risk Classification (1986–2025).

A separate building-exposure-in-high-risk map was not added because it would substantially duplicate the final risk-classification map. Building footprints may be displayed as context on the final map if that improves interpretation without obscuring the raster.

## 9. Interpretation for planning

Use the outputs to identify places for additional investigation. Any real-world decision about protection, adaptation, land-use controls, or relocation requires validation with local authorities and communities, field observations, flood depth/velocity, population and infrastructure data, evacuation access, vulnerability, tenure, and the feasibility and preferences of affected households.

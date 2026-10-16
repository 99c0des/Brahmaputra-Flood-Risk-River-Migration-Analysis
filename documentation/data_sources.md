# Data sources and attribution


## Landsat Collection 2 Level-2

- Provider: U.S. Geological Survey (USGS).
- Product family: Landsat Collection 2 Level-2 surface reflectance.
- Use: Historical water-mask generation using the Normalized Difference Water Index (NDWI) for selected years between 1986 and 2025.
- Official information: https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products

Landsat scene inventory — Assam/Brahmaputra project
Mask year	Selected scene ID in GEE	Acquisition date	Satellite / sensor	Cloud cover     	
1986	    LT05_135041_19901008	    8 Oct 1986	        Landsat 5 / TM     4%                   	
1990	    LT05_135041_19901125	    25 Nov 1990	        Landsat 5 / TM	    7%	                
1996	    LT05_135041_19961024	    24 Oct 1996	        Landsat 5 / TM	    3%	
2000	    LT05_135041_20001104	    4 Nov 2000	        Landsat 5 / TM	    2%	
2005	    LT05_135041_20051102	    2 Nov 2005	        Landsat 5 / TM	    9%	
2010	    LT05_135041_20101031	    31 Oct 2010	        Landsat 5 / TM	    14%	
2015	    LC08_135041_20151013	    13 Oct 2015	        Landsat 8 / OLI	    3.67%	
2020	    LC08_135041_20201111	    11 Nov 2020	        Landsat 8 / OLI	    0.98%	
2025	    LC09_135041_20251117	    17 Nov 2025	        Landsat 9 / OLI-2	1.28%	

Processing and documentation notes

The project uses selected Landsat scenes rather than a uniform annual time series. Sensor, acquisition date, cloud conditions, and scene identifiers must therefore be recorded for each exported water mask.


## Global Flood Database

Dataset: Global Flood Database v1 (2000–2018).
Provider: Cloud to Street (C2S) and Dartmouth Flood Observatory (DFO).
Google Earth Engine ImageCollection ID: GLOBAL_FLOOD_DB/MODIS_EVENTS/V1.
Temporal coverage: 17 February 2000 – 10 December 2018.
Original database: 913 successfully mapped flood events globally.
Project run record: 139 events intersected the broad Assam bounding box used during the initial event-counting step.
Primary observation source: Terra and Aqua MODIS satellite imagery.
Native resolution of the flood-event classification: Approximately 250 m.
Relevant bands: flooded, duration, and jrc_perm_water.
Use in this project: Historical flood-event masks and flood-frequency aggregation for the 2000–2018 period.
Official catalog: Google Earth Engine — Global Flood Database v1.

Dataset citation
Tellman, B., Sullivan, J. A., Kuhn, C., Kettner, A. J., Doyle, C. S., Brakenridge, G. R., Erickson, T. A., & Slayback, D. A. (2021). Satellite imaging reveals increased proportion of population exposed to floods. Nature, 596, 80–86. https://doi.org/10.1038/s41586-021-03695-w

Licence and reuse

The Google Earth Engine catalog identifies the dataset as licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) licence. Review the licence terms before any commercial reuse or redistribution.

Resolution and interpretation

The flood-event classifications have a native spatial resolution of approximately 250 m. Although the project's exported and aligned analysis rasters use a nominal 30 m grid, resampling does not create new 30 m flood-observation detail.

Consequently, the flood-frequency layer should be interpreted as a resampled representation of coarser satellite-derived flood observations, not as a precise 30 m record of inundation.

The 139 events recorded in the project run refer to intersections with the broad Assam bounding box, not necessarily 139 distinct events affecting the final Majuli analysis area. The exact number intersecting the final study polygon should only be reported if separately calculated.

## Building footprints

Project layer: buildings_assam_study_area_32646.
Geometry: Building-footprint polygons.
Recorded feature count: Approximately 129,660.
Use: Representation of mapped building distribution and spatial exposure within the analysis area.
Processing: Building footprints were clipped to the corrected study-area boundary and used to support the building-exposure and final risk-screening workflow.
Building footprints: © OpenStreetMap contributors, via Geofabrik.

## Study-area boundary 

Study area: Corrected Majuli-area analysis boundary, Assam, India.
Purpose: Defines the spatial extent used for the final flood-risk and building-exposure analysis.
Coordinate reference system for the analysis: WGS 84 / UTM zone 46N (EPSG:32646).
Recorded approximate geographic extent: 93.5476°–94.1558° E and 26.7472°–27.3507° N.
Boundary provenance

The corrected polygon was prepared or edited for the project's final analysis extent. 

The analysis boundary was refined to match the spatial extent of the exported raster datasets used in the project. The final analysis focuses on the Majuli area of Assam, India. The boundary is an analytical study extent and should not be interpreted as an official administrative boundary. 


## Basemap

Basemap: © OpenStreetMap contributors.
## Derived outputs

The following are author-generated analytical products created in Google Earth Engine and/or QGIS from the source data above:

- NDWI water masks and water-change indicators;
- river-migration envelope, occurrence, gain/loss frequency, activity, proximity and susceptibility;
- historical flood-event frequency raster;
- integrated hazard indicator;
- building-area exposure raster;
- final risk score and risk classes;
- map layouts and exported figures.



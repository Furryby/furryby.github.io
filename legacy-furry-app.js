window.__startFurryApp = function() {
        if (window.__furryAppStarted || !window.maplibregl) {
            return;
        }
        window.__furryAppStarted = true;
        const MAP_IS_LOW_POWER = Boolean(
            (navigator.deviceMemory && navigator.deviceMemory <= 4)
            || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
            || window.matchMedia('(max-width: 768px)').matches
        );
        const OPENFREEMAP_VECTOR_SOURCE_URL = 'https://tiles.openfreemap.org/planet';
        let useVectorBuildings = true;
        let vectorBuildingsFailed = false;
        let neonBuildingsAdded = false;
        let neonBuildingTimer = 0;
        const THEME_STORAGE_KEY = 'furry-theme';
        function normalizeTheme(theme) {
            theme = theme === 'sunset' ? 'light' : theme;
            return theme === 'light' ? 'light' : 'dark';
        }

        function readSavedTheme() {
            try {
                return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY));
            } catch (error) {
                return 'dark';
            }
        }

        const initialBaseTileTheme = readSavedTheme();
        let currentBaseTileTheme = initialBaseTileTheme;
        document.body.classList.toggle('theme-sunset', initialBaseTileTheme === 'light');
        let pendingBaseTileTheme = null;
        let baseThemeApplyQueued = false;
        let baseThemeRetryTimer = 0;
        let ipCenterApplied = false;
        const OSM_RASTER_TILES = [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ];
        const CARTO_DARK_NO_LABEL_TILES = [
            'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
        ];
        const RUSSIAN_LABEL_FIELD = ['coalesce', ['get', 'name:ru'], ['get', 'name'], ['get', 'name_en']];
        const BUILDING_GROUND_MIN_ZOOM = MAP_IS_LOW_POWER ? 10.4 : 9.8;
        const BUILDING_HALO_MIN_ZOOM = MAP_IS_LOW_POWER ? 13 : 12;
        const BUILDING_FILL_MIN_ZOOM = MAP_IS_LOW_POWER ? 11.2 : 10.8;
        const BUILDING_CORE_MIN_ZOOM = MAP_IS_LOW_POWER ? 14 : 13;
        const BUILDING_EDGE_MIN_ZOOM = MAP_IS_LOW_POWER ? 13 : 13;
        const VECTOR_LABEL_MIN_ZOOM = 3;
        const VECTOR_ROAD_MIN_ZOOM = MAP_IS_LOW_POWER ? 8.6 : 8.2;
        const VECTOR_PATH_MIN_ZOOM = MAP_IS_LOW_POWER ? 11.8 : 11.2;
        const MAP_MIN_BEARING = -58;
        const MAP_MAX_BEARING = 58;
        const MAP_BEARING_RETURN_DURATION = MAP_IS_LOW_POWER ? 420 : 340;
        const MAP_ROTATE_ZOOM_COOLDOWN = MAP_IS_LOW_POWER ? 620 : 480;
        let isMapRotating = false;
        let isMapBearingReturning = false;
        let isMapZooming = false;
        let isMapInteracting = false;
        let rotateZoomCooldownTimer = 0;
        let bearingReturnTimer = 0;
        let vectorIdleTimer = 0;
        let tileCachePurgeTimer = 0;
        if (window.maplibregl) {
            maplibregl.workerCount = MAP_IS_LOW_POWER ? 2 : 4;
            maplibregl.maxParallelImageRequests = MAP_IS_LOW_POWER ? 12 : 16;
        }
        function buildMapLibreStyle(theme = 'dark') {
            return {
                version: 8,
                glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
                light: {
                    anchor: 'viewport',
                    color: theme === 'sunset' ? '#ffffff' : '#9cecff',
                    intensity: theme === 'sunset' ? 0.35 : 0.62,
                    position: [1.15, 210, 42]
                },
                sources: {
                    darkRaster: {
                        type: 'raster',
                        tiles: theme === 'sunset' ? OSM_RASTER_TILES : CARTO_DARK_NO_LABEL_TILES,
                        tileSize: 256,
                        attribution: '© OpenStreetMap'
                    },
                    ...(theme !== 'sunset' ? {
                        openfreemap: {
                            type: 'vector',
                            url: OPENFREEMAP_VECTOR_SOURCE_URL
                        }
                    } : {})
                },
                layers: [
                    {
                        id: 'map-background',
                        type: 'background',
                        paint: {
                            'background-color': theme === 'sunset' ? '#d8d4c7' : '#01070b'
                        }
                    },
                    {
                        id: 'map-base-dark',
                        type: 'raster',
                        source: 'darkRaster',
                        paint: {
                            'raster-saturation': theme === 'sunset' ? 0 : 0.06,
                            'raster-contrast': theme === 'sunset' ? 0 : 0.06,
                            'raster-brightness-min': theme === 'sunset' ? 0 : 0,
                            'raster-brightness-max': theme === 'sunset' ? 1 : 0.92,
                            'raster-opacity': 1
                        }
                    }
                ],
                ...(theme !== 'sunset' ? {
                    layers: [
                        {
                            id: 'map-background',
                            type: 'background',
                            paint: {
                                'background-color': '#01070b'
                            }
                        },
                        {
                            id: 'map-base-dark',
                            type: 'raster',
                            source: 'darkRaster',
                            paint: {
                                'raster-saturation': 0.06,
                                'raster-contrast': 0.06,
                                'raster-brightness-min': 0,
                                'raster-brightness-max': 0.92,
                                'raster-opacity': 1
                            }
                        },
                        {
                            id: 'russian-place-labels',
                            type: 'symbol',
                            source: 'openfreemap',
                            'source-layer': 'place',
                            minzoom: VECTOR_LABEL_MIN_ZOOM,
                            filter: ['match', ['get', 'class'], ['country', 'state', 'city', 'town', 'village', 'suburb'], true, false],
                            layout: {
                                'text-field': RUSSIAN_LABEL_FIELD,
                                'text-font': ['Open Sans Semibold'],
                                'text-size': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    3,
                                    10,
                                    6,
                                    12,
                                    10,
                                    15,
                                    14,
                                    18
                                ],
                                'text-anchor': 'center',
                                'text-allow-overlap': false,
                                'text-ignore-placement': false
                            },
                            paint: {
                                'text-color': '#aeb7bf',
                                'text-halo-color': 'rgba(1,7,11,0.92)',
                                'text-halo-width': 1.4,
                                'text-opacity': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    3,
                                    0.72,
                                    8,
                                    0.88,
                                    14,
                                    0.95
                                ]
                            }
                        },
                        {
                            id: 'russian-road-labels',
                            type: 'symbol',
                            source: 'openfreemap',
                            'source-layer': 'transportation_name',
                            minzoom: 11,
                            layout: {
                                'symbol-placement': 'line',
                                'text-field': RUSSIAN_LABEL_FIELD,
                                'text-font': ['Open Sans Regular'],
                                'text-size': [
                                    'interpolate',
                                    ['linear'],
                                    ['zoom'],
                                    11,
                                    10,
                                    15,
                                    12
                                ],
                                'text-allow-overlap': false,
                                'text-ignore-placement': false
                            },
                            paint: {
                                'text-color': '#788791',
                                'text-halo-color': 'rgba(1,7,11,0.86)',
                                'text-halo-width': 1,
                                'text-opacity': 0.68
                            }
                        }
                    ]
                } : {
                    layers: [
                    {
                        id: 'map-background',
                        type: 'background',
                        paint: {
                            'background-color': theme === 'sunset' ? '#d8d4c7' : '#01070b'
                        }
                    },
                    {
                        id: 'map-base-dark',
                        type: 'raster',
                        source: 'darkRaster',
                        paint: {
                            'raster-saturation': theme === 'sunset' ? 0.2 : 0.05,
                            'raster-contrast': theme === 'sunset' ? 0.16 : 0.1,
                            'raster-brightness-min': theme === 'sunset' ? 0.09 : 0.04,
                            'raster-brightness-max': theme === 'sunset' ? 0.72 : 0.88,
                            'raster-opacity': 1
                        }
                    }
                    ]
                })
            };
        }

        function buildMapLibreStyle(theme = 'dark') {
            const isSunset = theme === 'sunset';
            const baseLayers = [
                {
                    id: 'map-background',
                    type: 'background',
                    paint: {
                        'background-color': isSunset ? '#d8d4c7' : '#01070b'
                    }
                },
                {
                    id: 'map-base-dark',
                    type: 'raster',
                    source: 'darkRaster',
                    paint: {
                        'raster-saturation': isSunset ? 0 : 0.06,
                        'raster-contrast': isSunset ? 0 : 0.06,
                        'raster-brightness-min': isSunset ? 0 : 0,
                        'raster-brightness-max': isSunset ? 1 : 0.92,
                        'raster-opacity': 1
                    }
                }
            ];

            const russianLabelLayers = isSunset ? [] : [
                {
                    id: 'russian-place-labels',
                    type: 'symbol',
                    source: 'openfreemap',
                    'source-layer': 'place',
                    minzoom: 3,
                    filter: ['match', ['get', 'class'], ['country', 'state', 'city', 'town', 'village', 'suburb'], true, false],
                    layout: {
                        'text-field': RUSSIAN_LABEL_FIELD,
                        'text-font': ['Open Sans Semibold'],
                        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 6, 12, 10, 15, 14, 18],
                        'text-anchor': 'center',
                        'text-allow-overlap': false,
                        'text-ignore-placement': false
                    },
                    paint: {
                        'text-color': '#aeb7bf',
                        'text-halo-color': 'rgba(1,7,11,0.92)',
                        'text-halo-width': 1.4,
                        'text-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.72, 8, 0.88, 14, 0.95]
                    }
                },
                {
                    id: 'russian-road-labels',
                    type: 'symbol',
                    source: 'openfreemap',
                    'source-layer': 'transportation_name',
                    minzoom: 11,
                    layout: {
                        'symbol-placement': 'line',
                        'text-field': RUSSIAN_LABEL_FIELD,
                        'text-font': ['Open Sans Regular'],
                        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 15, 12],
                        'text-allow-overlap': false,
                        'text-ignore-placement': false
                    },
                    paint: {
                        'text-color': '#788791',
                        'text-halo-color': 'rgba(1,7,11,0.86)',
                        'text-halo-width': 1,
                        'text-opacity': 0.68
                    }
                }
            ];

            return {
                version: 8,
                glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
                light: {
                    anchor: 'viewport',
                    color: isSunset ? '#ffffff' : '#9cecff',
                    intensity: isSunset ? 0.35 : 0.62,
                    position: [1.15, 210, 42]
                },
                sources: {
                    darkRaster: {
                        type: 'raster',
                        tiles: isSunset ? OSM_RASTER_TILES : CARTO_DARK_NO_LABEL_TILES,
                        tileSize: 256,
                        attribution: '© OpenStreetMap'
                    },
                    ...(!isSunset ? {
                        openfreemap: {
                            type: 'vector',
                            url: OPENFREEMAP_VECTOR_SOURCE_URL
                        }
                    } : {})
                },
                layers: baseLayers.concat(russianLabelLayers)
            };
        }

        function createLeafletLikeBounds(south, west, north, east) {
            return {
                south,
                west,
                north,
                east,
                contains(value) {
                    const lat = Array.isArray(value) ? Number(value[0]) : Number(value && value.lat);
                    const lon = Array.isArray(value) ? Number(value[1]) : Number(value && (value.lng ?? value.lon));
                    return Number.isFinite(lat)
                        && Number.isFinite(lon)
                        && lat >= this.south
                        && lat <= this.north
                        && lon >= this.west
                        && lon <= this.east;
                },
                pad(ratio) {
                    const latPad = (this.north - this.south) * ratio;
                    const lonPad = (this.east - this.west) * ratio;
                    return createLeafletLikeBounds(
                        this.south - latPad,
                        this.west - lonPad,
                        this.north + latPad,
                        this.east + lonPad
                    );
                }
            };
        }

        function buildMapLibreStyle(theme = 'dark') {
            const isLight = theme === 'light' || theme === 'sunset';
            return {
                version: 8,
                glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
                light: {
                    anchor: 'viewport',
                    color: isLight ? '#ffffff' : '#9cecff',
                    intensity: isLight ? 0.35 : 0.62,
                    position: [1.15, 210, 42]
                },
                sources: {
                    darkRaster: {
                        type: 'raster',
                        tiles: CARTO_DARK_NO_LABEL_TILES,
                        tileSize: 256,
                        maxzoom: 16,
                        attribution: '© OpenStreetMap'
                    },
                    lightRaster: {
                        type: 'raster',
                        tiles: OSM_RASTER_TILES,
                        tileSize: 256,
                        maxzoom: 16,
                        attribution: '© OpenStreetMap'
                    }
                },
                layers: [
                    {
                        id: 'map-background',
                        type: 'background',
                        paint: {
                            'background-color': isLight ? '#d8d4c7' : '#050505'
                        }
                    },
                    {
                        id: 'map-base-light',
                        type: 'raster',
                        source: 'lightRaster',
                        layout: {
                            visibility: isLight ? 'visible' : 'none'
                        },
                        paint: {
                            'raster-saturation': -0.08,
                            'raster-contrast': -0.04,
                            'raster-brightness-min': 0,
                            'raster-brightness-max': 0.82,
                            'raster-opacity': 1
                        }
                    },
                    {
                        id: 'map-base-dark',
                        type: 'raster',
                        source: 'darkRaster',
                        layout: {
                            visibility: isLight ? 'none' : 'visible'
                        },
                        paint: {
                            'raster-saturation': -0.95,
                            'raster-contrast': -0.08,
                            'raster-brightness-min': 0,
                            'raster-brightness-max': 0.72,
                            'raster-opacity': 1
                        }
                    }
                ]
            };
        }

        const map = new maplibregl.Map({
            container: 'map',
            style: buildMapLibreStyle(initialBaseTileTheme),
            center: [37.6173, 55.7558],
            zoom: 5,
            pitch: MAP_IS_LOW_POWER ? 30 : 38,
            bearing: -22,
            minZoom: 3,
            maxZoom: 18,
            maxPitch: MAP_IS_LOW_POWER ? 44 : 52,
            maxTileCacheSize: MAP_IS_LOW_POWER ? 24 : 42,
            maxTileCacheZoomLevels: MAP_IS_LOW_POWER ? 2 : 3,
            cancelPendingTileRequestsWhileZooming: true,
            renderWorldCopies: false,
            collectResourceTiming: false,
            attributionControl: false,
            fadeDuration: 0,
            refreshExpiredTiles: false,
            cooperativeGestures: false,
            pitchWithRotate: true,
            dragRotate: true,
            touchPitch: false
        });
        map.dragRotate.enable();
        map.touchZoomRotate.disableRotation();
        if (map.scrollZoom) {
            if (typeof map.scrollZoom.setWheelZoomRate === 'function') {
                map.scrollZoom.setWheelZoomRate(MAP_IS_LOW_POWER ? 1 / 1300 : 1 / 1050);
            }
            if (typeof map.scrollZoom.setZoomRate === 'function') {
                map.scrollZoom.setZoomRate(MAP_IS_LOW_POWER ? 1 / 360 : 1 / 300);
            }
        }

        function normalizeBearingForLimit(value) {
            let bearing = Number(value) || 0;
            bearing = ((bearing + 180) % 360 + 360) % 360 - 180;
            return bearing;
        }

        function getLimitedBearing(value = map.getBearing()) {
            const bearing = normalizeBearingForLimit(value);
            return Math.max(MAP_MIN_BEARING, Math.min(MAP_MAX_BEARING, bearing));
        }

        function setMapScrollZoomEnabled(enabled) {
            if (!map || !map.scrollZoom) {
                return;
            }
            if (enabled) {
                map.scrollZoom.enable();
            } else {
                map.scrollZoom.disable();
            }
        }

        function setMapMovingVisualState(moving) {
            document.body.classList.toggle('map-moving', Boolean(moving));
        }

        function beginRotateZoomLock() {
            if (rotateZoomCooldownTimer) {
                clearTimeout(rotateZoomCooldownTimer);
                rotateZoomCooldownTimer = 0;
            }
            setMapScrollZoomEnabled(false);
        }

        function finishRotateZoomLock(extraDelay = MAP_ROTATE_ZOOM_COOLDOWN) {
            if (rotateZoomCooldownTimer) {
                clearTimeout(rotateZoomCooldownTimer);
            }
            rotateZoomCooldownTimer = setTimeout(() => {
                rotateZoomCooldownTimer = 0;
                if (!isMapRotating && !isMapBearingReturning) {
                    setMapScrollZoomEnabled(true);
                }
            }, extraDelay);
        }

        function returnBearingToLimitsAfterRotate() {
            if (!map || typeof map.easeTo !== 'function') {
                return false;
            }

            const bearing = normalizeBearingForLimit(map.getBearing());
            const target = getLimitedBearing(bearing);
            if (Math.abs(target - bearing) < 0.1) {

                return false;
            }

            if (bearingReturnTimer) {
                clearTimeout(bearingReturnTimer);
                bearingReturnTimer = 0;
            }
            isMapBearingReturning = true;
            beginRotateZoomLock();
            map.easeTo({
                bearing: target,
                duration: MAP_BEARING_RETURN_DURATION,
                easing: t => 1 - Math.pow(1 - t, 3)
            });
            bearingReturnTimer = setTimeout(() => {
                bearingReturnTimer = 0;
                isMapBearingReturning = false;
                finishRotateZoomLock();
                requestCanvasMarkerRender(true);
            }, MAP_BEARING_RETURN_DURATION + 90);
            return true;
        }

        map.on('rotatestart', () => {
            isMapRotating = true;
            isMapBearingReturning = false;
            isMapInteracting = true;
            setMapMovingVisualState(true);
            if (bearingReturnTimer) {
                clearTimeout(bearingReturnTimer);
                bearingReturnTimer = 0;
            }
            beginRotateZoomLock();
        });

        map.on('rotateend', () => {
            isMapRotating = false;
            const isReturning = returnBearingToLimitsAfterRotate();
            if (!isReturning) {
                finishRotateZoomLock();
                requestCanvasMarkerRender(true);
                scheduleVectorDetailLayers(MAP_IS_LOW_POWER ? 1100 : 850);
                scheduleMapTileCachePurge();
            }
        });

        map.on('zoomstart', () => {
            isMapZooming = true;
            isMapInteracting = true;
            setMapMovingVisualState(true);
        });

        map.on('zoomend', () => {
            isMapZooming = false;
        });

        const mapCanvas = map.getCanvas();
        if (mapCanvas) {
            mapCanvas.addEventListener('wheel', event => {
                if (isMapRotating || isMapBearingReturning || rotateZoomCooldownTimer) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }, { passive: false, capture: true });
        }

        function applyMapAtmosphere() {
            if (!map || typeof map.setFog !== 'function') {
                return;
            }
            try {
                map.setFog({
                    color: '#05070b',
                    'high-color': '#0b2236',
                    'horizon-blend': 0.12,
                    'space-color': '#020305',
                    'star-intensity': 0.18
                });
            } catch (error) {
                console.warn('Map fog is not available:', error);
            }
        }

        function ensureOpenFreeMapSource() {
            if (!useVectorBuildings || !map) {
                return false;
            }

            if (map.getSource('openfreemap')) {
                return true;
            }

            try {
                map.addSource('openfreemap', {
                    type: 'vector',
                    url: OPENFREEMAP_VECTOR_SOURCE_URL
                });
                return true;
            } catch (error) {
                console.warn('OpenFreeMap source was not added:', error);
                return false;
            }
        }

        function addRussianMapLabels() {
            if (!map || map.getZoom() < VECTOR_LABEL_MIN_ZOOM || !ensureOpenFreeMapSource()) {
                return;
            }
            if (map.getLayer('russian-place-labels')) {
                setMapLayerVisibility('russian-place-labels', true);
                setMapLayerVisibility('russian-road-labels', map.getZoom() >= VECTOR_ROAD_MIN_ZOOM);
                moveMapLabelsAboveVectorDetails();
                return;
            }

            try {
                map.addLayer({
                    id: 'russian-place-labels',
                    type: 'symbol',
                    source: 'openfreemap',
                    'source-layer': 'place',
                    minzoom: VECTOR_LABEL_MIN_ZOOM,
                    filter: ['match', ['get', 'class'], ['country', 'state', 'city', 'town', 'village', 'suburb'], true, false],
                    layout: {
                        'text-field': RUSSIAN_LABEL_FIELD,
                        'text-font': ['Open Sans Semibold'],
                        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 6, 12, 10, 15, 14, 18],
                        'text-anchor': 'center',
                        'text-allow-overlap': false,
                        'text-ignore-placement': false
                    },
                    paint: {
                        'text-color': '#f0f7ff',
                        'text-halo-color': 'rgba(0,0,0,0.96)',
                        'text-halo-width': 2.2,
                        'text-opacity': ['interpolate', ['linear'], ['zoom'], VECTOR_LABEL_MIN_ZOOM, 0.86, 10, 0.96, 14, 1]
                    }
                });

                map.addLayer({
                    id: 'russian-road-labels',
                    type: 'symbol',
                    source: 'openfreemap',
                    'source-layer': 'transportation_name',
                    minzoom: VECTOR_ROAD_MIN_ZOOM,
                    layout: {
                        'symbol-placement': 'line',
                        'text-field': RUSSIAN_LABEL_FIELD,
                        'text-font': ['Open Sans Regular'],
                        'text-size': ['interpolate', ['linear'], ['zoom'], VECTOR_ROAD_MIN_ZOOM, 10, 15, 12],
                        'text-allow-overlap': false,
                        'text-ignore-placement': false
                    },
                    paint: {
                        'text-color': '#c7d8e8',
                        'text-halo-color': 'rgba(0,0,0,0.94)',
                        'text-halo-width': 1.7,
                        'text-opacity': 0.86
                    }
                });

                moveMapLabelsAboveVectorDetails();
            } catch (error) {
                console.warn('Russian map labels were skipped:', error);
            }
        }

        function scheduleRussianMapLabels(delay = MAP_IS_LOW_POWER ? 420 : 220) {
            if (!map) {
                return;
            }
            window.clearTimeout(scheduleRussianMapLabels.timer);
            scheduleRussianMapLabels.timer = window.setTimeout(() => {
                scheduleRussianMapLabels.timer = 0;
                addRussianMapLabels();
            }, delay);
        }

        function addRoadLineLayers() {
            if (
                currentBaseTileTheme === 'light'
                || !useVectorBuildings
                || !map
                || map.getZoom() < VECTOR_ROAD_MIN_ZOOM
                || !ensureOpenFreeMapSource()
            ) {
                return;
            }

            try {
                if (map.getLayer('road-neon-core') && map.getLayer('road-neon-shadow') && map.getLayer('road-path-light')) {
                    moveMapLabelsAboveVectorDetails();
                    return;
                }

                const beforeLayer = map.getLayer('russian-road-labels')
                    ? 'russian-road-labels'
                    : (map.getLayer('russian-place-labels') ? 'russian-place-labels' : undefined);
                const roadFilter = [
                    'all',
                    ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false],
                    ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary', 'tertiary'], true, false]
                ];
                const pathFilter = [
                    'all',
                    ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false],
                    ['match', ['get', 'class'], ['path', 'footway', 'track', 'cycleway', 'service', 'minor', 'residential'], true, false]
                ];

                map.addLayer({
                    id: 'road-path-light',
                    type: 'line',
                    source: 'openfreemap',
                    'source-layer': 'transportation',
                    minzoom: VECTOR_PATH_MIN_ZOOM,
                    filter: pathFilter,
                    paint: {
                        'line-color': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_PATH_MIN_ZOOM,
                            '#5bcaff',
                            15,
                            '#8ee2ff',
                            18,
                            '#d9f7ff'
                        ],
                        'line-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_PATH_MIN_ZOOM,
                            0,
                            13,
                            0.24,
                            15,
                            0.42,
                            18,
                            0.5
                        ],
                        'line-width': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_PATH_MIN_ZOOM,
                            0.18,
                            15,
                            0.48,
                            18,
                            0.9
                        ],
                        'line-blur': 0.18
                    }
                }, beforeLayer);

                map.addLayer({
                    id: 'road-neon-shadow',
                    type: 'line',
                    source: 'openfreemap',
                    'source-layer': 'transportation',
                    minzoom: VECTOR_ROAD_MIN_ZOOM,
                    filter: roadFilter,
                    paint: {
                        'line-color': '#16bfff',
                        'line-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            0.28,
                            8,
                            0.42,
                            13,
                            0.58
                        ],
                        'line-width': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            0.45,
                            8,
                            0.9,
                            12,
                            2.4,
                            16,
                            5.2
                        ],
                        'line-blur': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            0.7,
                            11,
                            1.35,
                            16,
                            2.4
                        ]
                    }
                }, beforeLayer);

                map.addLayer({
                    id: 'road-neon-core',
                    type: 'line',
                    source: 'openfreemap',
                    'source-layer': 'transportation',
                    minzoom: VECTOR_ROAD_MIN_ZOOM,
                    filter: roadFilter,
                    paint: {
                        'line-color': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            '#26c8ff',
                            10,
                            '#62dcff',
                            15,
                            '#d4f7ff'
                        ],
                        'line-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            0.4,
                            9,
                            0.6,
                            14,
                            0.78
                        ],
                        'line-width': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            VECTOR_ROAD_MIN_ZOOM,
                            0.22,
                            9,
                            0.62,
                            13,
                            1.25,
                            17,
                            2.4
                        ]
                    }
                }, beforeLayer);

                moveMapLabelsAboveVectorDetails();
            } catch (error) {
                console.warn('Road line layers were skipped:', error);
            }
        }

        function addNeonBuildingLayers() {
            if (neonBuildingsAdded && map && !map.getLayer('building-neon-fill')) {
                neonBuildingsAdded = false;
            }
            if (
                neonBuildingsAdded
                || currentBaseTileTheme === 'light'
                || !useVectorBuildings
                || !map
                || map.getZoom() < BUILDING_GROUND_MIN_ZOOM
                || !ensureOpenFreeMapSource()
            ) {
                return;
            }

            try {
                if (map.getLayer('building-neon-fill')) {
                    neonBuildingsAdded = true;
                    moveMapLabelsAboveVectorDetails();
                    return;
                }
                const beforeLayerId = map.getLayer('russian-place-labels')
                    ? 'russian-place-labels'
                    : (map.getLayer('russian-road-labels') ? 'russian-road-labels' : undefined);
                if (map.getLayer('building-neon-ground')) {
                    map.removeLayer('building-neon-ground');
                }
                if (map.getLayer('building-neon-halo')) {
                    map.removeLayer('building-neon-halo');
                }
                if (map.getLayer('building-neon-edges')) {
                    map.removeLayer('building-neon-edges');
                }
                if (map.getLayer('building-neon-core')) {
                    map.removeLayer('building-neon-core');
                }
                if (map.getLayer('building-neon-fill')) {
                    map.removeLayer('building-neon-fill');
                }
                const buildingFilter = [
                    'all',
                    ['match', ['geometry-type'], ['MultiPolygon', 'Polygon'], true, false],
                    ['!=', ['get', 'hide_3d'], true]
                ];

                map.addLayer({
                    id: 'building-neon-fill',
                    type: 'fill-extrusion',
                    source: 'openfreemap',
                    'source-layer': 'building',
                    minzoom: BUILDING_FILL_MIN_ZOOM,
                    filter: buildingFilter,
                    paint: {
                        'fill-extrusion-color': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            11,
                            '#050b12',
                            13,
                            '#0d2b3d',
                            16,
                            '#1780b6',
                            18,
                            '#62d6ff'
                        ],
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            11,
                            0,
                            12.5,
                            16,
                            14,
                            [
                                'coalesce',
                                ['to-number', ['get', 'render_height']],
                                ['to-number', ['get', 'height']],
                                38
                            ]
                        ],
                        'fill-extrusion-base': [
                            'coalesce',
                            ['to-number', ['get', 'render_min_height']],
                            ['to-number', ['get', 'min_height']],
                            0
                        ],
                        'fill-extrusion-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            11,
                            0,
                            13,
                            0.48,
                            15,
                            0.76,
                            18,
                            0.82
                        ],
                        'fill-extrusion-vertical-gradient': true
                    }
                }, beforeLayerId);

                neonBuildingsAdded = true;
                moveMapLabelsAboveVectorDetails();
            } catch (error) {
                console.warn('Neon building layers were skipped:', error);
            }
        }

        function scheduleNeonBuildingLayers(delay = MAP_IS_LOW_POWER ? 260 : 120) {
            if (neonBuildingTimer) {
                clearTimeout(neonBuildingTimer);
            }
            neonBuildingTimer = setTimeout(() => {
                neonBuildingTimer = 0;
                addNeonBuildingLayers();
            }, delay);
        }

        function scheduleVectorDetailLayers(delay = MAP_IS_LOW_POWER ? 520 : 360) {
            if (!map) {
                return;
            }
            if (
                isMapZooming
                || isMapRotating
                || isMapBearingReturning
                || isMapInteracting
                || (typeof map.isMoving === 'function' && map.isMoving())
                || (typeof map.isZooming === 'function' && map.isZooming())
                || (typeof map.isRotating === 'function' && map.isRotating())
            ) {
                return;
            }
            if (currentBaseTileTheme === 'light') {
                hideVectorDetailLayers();
                return;
            }
            if (map.getZoom() < VECTOR_LABEL_MIN_ZOOM) {
                return;
            }
            window.clearTimeout(scheduleVectorDetailLayers.timer);
            scheduleVectorDetailLayers.timer = window.setTimeout(() => {
                addRussianMapLabels();
                showVectorDetailLayers();
                addRoadLineLayers();
                scheduleNeonBuildingLayers(MAP_IS_LOW_POWER ? 180 : 80);
            }, delay);
        }

        function setVectorDetailLayersVisible(visible) {
            if (!map) {
                return;
            }
            [
                'building-neon-core',
                'building-neon-edges',
                'building-neon-halo',
                'building-neon-fill',
                'building-neon-ground',
                'road-neon-core',
                'road-neon-shadow',
                'road-path-light'
            ].forEach(layerId => {
                if (map.getLayer(layerId)) {
                    try {
                        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
                    } catch (error) {
                        console.warn('Vector detail layer visibility was not changed:', layerId, error);
                    }
                }
            });
        }

        function hideVectorDetailLayers() {
            window.clearTimeout(scheduleVectorDetailLayers.timer);
            window.clearTimeout(vectorIdleTimer);
            if (neonBuildingTimer) {
                clearTimeout(neonBuildingTimer);
                neonBuildingTimer = 0;
            }
            setVectorDetailLayersVisible(false);
        }

        function showVectorDetailLayers() {
            setVectorDetailLayersVisible(true);
        }

        function purgeMapTileMemoryCache() {
            if (!map || !map.style || !map.style.sourceCaches) {
                return;
            }
            if (
                typeof map.isMoving === 'function' && map.isMoving()
                || typeof map.isZooming === 'function' && map.isZooming()
                || typeof map.isRotating === 'function' && map.isRotating()
            ) {
                scheduleMapTileCachePurge();
                return;
            }

            Object.keys(map.style.sourceCaches).forEach(sourceId => {
                const sourceCache = map.style.sourceCaches[sourceId];
                if (!sourceCache) {
                    return;
                }
                try {
                    if (sourceCache._cache && typeof sourceCache._cache.reset === 'function') {
                        sourceCache._cache.reset();
                    }
                    if (sourceCache._coveredTiles) {
                        sourceCache._coveredTiles = {};
                    }
                    if (sourceCache._loadedParentTiles) {
                        sourceCache._loadedParentTiles = {};
                    }
                } catch (error) {
                    console.warn('Map tile memory cache was not purged:', sourceId, error);
                }
            });
        }

        function scheduleMapTileCachePurge(delay = 3000) {
            window.clearTimeout(tileCachePurgeTimer);
            tileCachePurgeTimer = window.setTimeout(() => {
                tileCachePurgeTimer = 0;
                purgeMapTileMemoryCache();
            }, delay);
        }

        function scheduleVectorDetailsAfterIdle(delay = MAP_IS_LOW_POWER ? 1400 : 1000) {
            if (!map || currentBaseTileTheme === 'light') {
                hideVectorDetailLayers();
                scheduleMapTileCachePurge();
                return;
            }
            window.clearTimeout(vectorIdleTimer);
            vectorIdleTimer = window.setTimeout(() => {
                isMapInteracting = false;
                setMapMovingVisualState(false);
                if (
                    typeof map.isMoving === 'function' && map.isMoving()

                    || typeof map.isZooming === 'function' && map.isZooming()
                    || typeof map.isRotating === 'function' && map.isRotating()
                ) {
                    scheduleVectorDetailsAfterIdle(delay);
                    return;
                }
                scheduleVectorDetailLayers(180);
                scheduleMapTileCachePurge();
            }, delay);
        }

        function fallbackToRasterMap(reason) {
            if (vectorBuildingsFailed) {
                return;
            }
            vectorBuildingsFailed = true;
            useVectorBuildings = false;
            console.warn('3D buildings disabled, raster map fallback:', reason);
            map.setStyle(buildMapLibreStyle('dark'));
        }

        map.on('style.load', () => {
            applyMapAtmosphere();
            scheduleRussianMapLabels(MAP_IS_LOW_POWER ? 1100 : 760);
            scheduleVectorDetailsAfterIdle(MAP_IS_LOW_POWER ? 1500 : 1080);
            requestCanvasMarkerRender(true);
        });

        map.on('error', event => {
            const message = String(
                (event && event.error && event.error.message)
                || (event && event.message)
                || ''
            );
            if (/Unimplemented type:\s*4/i.test(message)) {
                fallbackToRasterMap(message);
            }
        });

        const getNativeMapBounds = map.getBounds.bind(map);
        map.setView = function(center, zoom, options = {}) {
            const lat = Number(center && center[0]);
            const lon = Number(center && center[1]);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                return;
            }
            const payload = { center: [lon, lat], zoom };
            if (options && options.animate === false) {
                this.jumpTo(payload);
            } else {
                this.easeTo({ ...payload, duration: 450 });
            }
        };
        map.getBounds = function() {
            const bounds = getNativeMapBounds();
            return createLeafletLikeBounds(
                bounds.getSouth(),
                bounds.getWest(),
                bounds.getNorth(),
                bounds.getEast()
            );
        };

        function getDeckViewState() {
            const center = map.getCenter();
            return {
                longitude: center.lng,
                latitude: center.lat,
                zoom: map.getZoom(),
                bearing: map.getBearing(),
                pitch: map.getPitch()
            };
        }

        function setMapLayerVisibility(layerId, visible) {
            if (!map || !map.getLayer(layerId)) {
                return;
            }
            try {
                map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
            } catch (error) {
                console.warn('Layer visibility was not changed:', layerId, error);
            }
        }

        function moveMapLabelsAboveVectorDetails() {
            if (!map) {
                return;
            }
            ['russian-road-labels', 'russian-place-labels'].forEach(layerId => {
                if (!map.getLayer(layerId)) {
                    return;
                }
                try {
                    map.moveLayer(layerId);
                } catch (error) {
                    console.warn('Map label order was not changed:', layerId, error);
                }
            });
        }

        function setThemeLayerVisibility(isLight) {
            [
                'road-neon-shadow',
                'road-neon-core',
                'road-path-light',
                'building-neon-ground',
                'building-neon-halo',
                'building-neon-fill',
                'building-neon-edges',
                'building-neon-core'
            ].forEach(layerId => setMapLayerVisibility(layerId, !isLight));
        }

        function applyBaseTileThemeNow(theme) {
            theme = theme === 'sunset' ? 'light' : theme;
            theme = theme === 'light' ? 'light' : 'dark';
            const isLight = theme === 'light';
            currentBaseTileTheme = theme;

            if (!map || !map.getLayer('map-base-dark') || !map.getLayer('map-base-light')) {
                return false;
            }

            try {
                map.setPaintProperty('map-background', 'background-color', isLight ? '#d8d4c7' : '#01070b');
                map.setLayoutProperty('map-base-light', 'visibility', isLight ? 'visible' : 'none');
                map.setLayoutProperty('map-base-dark', 'visibility', isLight ? 'none' : 'visible');
                map.setPaintProperty('map-base-light', 'raster-opacity', 1);
                map.setPaintProperty('map-base-light', 'raster-saturation', -0.08);
                map.setPaintProperty('map-base-light', 'raster-contrast', -0.04);
                map.setPaintProperty('map-base-light', 'raster-brightness-max', 0.82);
                map.setPaintProperty('map-base-dark', 'raster-opacity', 1);
                if (typeof map.setLight === 'function') {
                    map.setLight({
                        anchor: 'viewport',
                        color: isLight ? '#ffffff' : '#9cecff',
                        intensity: isLight ? 0.35 : 0.62,
                        position: [1.15, 210, 42]
                    });
                }
                setThemeLayerVisibility(isLight);
                if (!isLight) {
                    scheduleVectorDetailLayers(120);
                } else {
                    hideVectorDetailLayers();
                }
                requestCanvasMarkerRender();
                return true;
            } catch (error) {
                console.warn('Base map theme was not applied:', error);
                return false;
            }
        }

        function setBaseTileTheme(theme) {
            theme = theme === 'sunset' ? 'light' : theme;
            theme = theme === 'light' ? 'light' : 'dark';
            pendingBaseTileTheme = theme;

            if (baseThemeApplyQueued) {
                return;
            }

            const applyPendingTheme = () => {
                baseThemeApplyQueued = false;
                if (baseThemeRetryTimer) {
                    clearTimeout(baseThemeRetryTimer);
                    baseThemeRetryTimer = 0;
                }
                const nextTheme = pendingBaseTileTheme;
                pendingBaseTileTheme = null;
                if (!nextTheme || applyBaseTileThemeNow(nextTheme)) {
                    return;
                }
                pendingBaseTileTheme = nextTheme;
                baseThemeApplyQueued = true;
                baseThemeRetryTimer = setTimeout(applyPendingTheme, 50);
            };

            if (!applyBaseTileThemeNow(theme)) {
                baseThemeApplyQueued = true;
                map.once('style.load', applyPendingTheme);
            } else {
                pendingBaseTileTheme = null;
            }
        }

        function waitForMapReady() {
            if (map.loaded()) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                let done = false;
                const finish = () => {
                    if (done) {
                        return;
                    }
                    done = true;
                    resolve();
                };
                map.once('load', finish);
                map.once('styledata', finish);
                map.once('error', finish);
                setTimeout(finish, 900);
            });
        }

        const markers = {
            clearLayers() {},
            addLayer() {},
            addLayers() {},
            on() {}
        };

        async function tryCenterMapToUserLocation() {
            return await new Promise(resolve => {
                const callbackName = '__furryIpGeoCallback_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
                const script = document.createElement('script');
                let settled = false;
                window.__furryIpGeoCallback = function(data) {
                    const currentCallback = window[callbackName];
                    if (typeof currentCallback === 'function') {
                        currentCallback(data);
                    }
                };
                const finish = result => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    window[callbackName] = function() {};
                    setTimeout(() => {
                        window[callbackName] = function() {};
                        window.__furryIpGeoCallback = function() {};
                        if (script.parentNode) {
                            script.parentNode.removeChild(script);
                        }
                    }, 10000);
                    resolve(result);
                };

                const applyIpCenter = (lat, lon, force = false) => {
                    if (ipCenterApplied && !force) {
                        return;
                    }

                    ipCenterApplied = true;
                    map.jumpTo({
                        center: [lon, lat],
                        zoom: Math.max(10, map.getZoom()),
                        bearing: map.getBearing(),
                        pitch: map.getPitch()
                    });
                    requestCanvasMarkerRender(true);
                    scheduleMarkerRefresh(120);
                };

                const timer = setTimeout(() => finish(false), 3500);

                window[callbackName] = data => {
                    clearTimeout(timer);

                    const country = data && data.country ? data.country : null;
                    visitorCountryCode = String(
                        (country && (country.iso || country.iso2 || country.name_en || country.name_ru)) || ''
                    ).toUpperCase();

                    const city = data && data.city ? data.city : null;
                    const lat = Number(
                        (city && (city.lat ?? city.latitude))
                        ?? (data && (data.lat ?? data.latitude))
                    );
                    const lon = Number(
                        (city && (city.lon ?? city.lng ?? city.longitude))
                        ?? (data && (data.lon ?? data.lng ?? data.longitude))
                    );

                    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                        window.__furryIpGeoDebug = { ok: false, data };
                        finish(false);
                        return;
                    }

                    window.__furryIpGeoDebug = { ok: true, lat, lon, data };
                    applyIpCenter(lat, lon);
                    if (typeof map.isStyleLoaded === 'function' && !map.isStyleLoaded()) {
                        map.once('style.load', () => applyIpCenter(lat, lon, true));
                        setTimeout(() => applyIpCenter(lat, lon, true), 500);
                    }
                    finish(true);
                };

                script.src = 'https://api.sypexgeo.net/jsonp/?callback=' + callbackName;
                script.async = true;
                script.referrerPolicy = 'no-referrer';
                script.onerror = () => {
                    clearTimeout(timer);
                    window.__furryIpGeoDebug = { ok: false, reason: 'script_error' };
                    finish(false);
                };
                document.head.appendChild(script);
            });
        }

        let allData = [];
        let mappableProfiles = [];
        let profilesById = new Map();
        let currentProfiles = [];
        let sidebarProfilesSource = [];
        let sidebarVisibleProfiles = [];
        let sidebarSearchQuery = '';
        let expandedStates = {};
        let citiesData = {};
        let lookingFor = 'all';
        let showOldProfiles = false;
        let currentSortBy = 'new';
        let cityTagsSet = new Set();
        let hashtagCache = new Map();
        let renderTimeout = null;
        let sidebarBatchSize = 24;
        let sidebarVisibleCount = 24;
        let recentUndatedFormIdThreshold = null;
        let markerRenderToken = 0;
        let currentMarkerFilterFn = null;
        let visitorCountryCode = '';

        (function() {
            const cbn = '__furryIpGeoCallback_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
            const s = document.createElement('script');
            let done = false;
            window[cbn] = function(data) {
                if (done) return;
                done = true;
                const c = data && data.country;
                if (c) visitorCountryCode = String(c.iso || c.iso2 || c.name_en || c.name_ru || '').toUpperCase();
                setTimeout(function() { window[cbn] = function(){}; if (s.parentNode) s.parentNode.removeChild(s); }, 5000);
            };
            s.src = 'https://api.sypexgeo.net/jsonp/?callback=' + cbn;
            s.async = true;
            (document.head || document.body).appendChild(s);
            setTimeout(function() { if (!done) { done = true; window[cbn] = function(){}; } }, 4000);
        })();
        let toastTimer = null;
        let sidebarHydrationToken = 0;
        let searchRequestToken = 0;
        let recentThresholdTime = 0;
        let sidebarThresholdTime = 0;
        const profileDetailsCache = new Map();
        const BOT_TAG = '@Furrybybot';
        const pendingLikes = new Set();
        function getApiBaseUrl() {
            const override = String(window.FURRY_API_BASE_URL || '').trim();
            if (override) {
                return override.replace(/\/+$/, '');
            }

                return 'https://api.furry.by:10101';
        }

        const API_BASE_URL = getApiBaseUrl();

        function shouldUseSearchApi() {
            const host = location.hostname;
            const isLocalHost = host === 'localhost' || host === 'api.furry.by' || host === '::1';
            return !isLocalHost || Boolean(window.FURRY_API_BASE_URL);
        }

        async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 12000) {
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: controller ? controller.signal : undefined
                });
                if (!response.ok) {
                    throw new Error('bad_status_' + response.status);
                }
                return await response.json();
            } finally {
                if (timer) {
                    clearTimeout(timer);
                }
            }
        }

        function isHydratedProfile(form) {
            return Boolean(
                form
                && (typeof form.form_text === 'string'
                    || typeof form.user_link === 'string'
                    || typeof form.photo === 'string')
            );
        }

        function setSidebarLoading(message = 'Загружаем анкеты...') {
            const profileList = document.getElementById('profile-list');
            currentProfiles = [];
            if (profileList) {
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">' + escapeHtml(message) + '</div>';
            }
        }

        async function fetchProfilesBatch(ids) {
            const normalizedIds = [...new Set(
                (ids || [])
                    .map(value => Number(value))
                    .filter(Number.isFinite)
                    .filter(value => value > 0)
            )];

            if (normalizedIds.length === 0) {
                return [];
            }

            const missingIds = normalizedIds.filter(id => !profileDetailsCache.has(id));
            if (missingIds.length > 0) {
                const payload = await fetchJsonWithTimeout(
                    API_BASE_URL + '/api/profiles',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ ids: missingIds })
                    },
                    20000
                );

                if (!payload || !payload.ok || !Array.isArray(payload.items)) {
                    throw new Error('bad_profiles_payload');
                }

                payload.items.forEach(item => {
                    if (item && Number.isFinite(Number(item.form_id))) {
                        profileDetailsCache.set(Number(item.form_id), item);
                    }
                });
            }

            return normalizedIds
                .map(id => profileDetailsCache.get(id))
                .filter(Boolean);
        }

        function applyTheme(theme, shouldStore = false) {
            theme = normalizeTheme(theme);
            if (shouldStore) {
                localStorage.setItem(THEME_STORAGE_KEY, theme);
            }
            const body = document.body;
            const isLight = theme === 'light';
            body.classList.toggle('theme-sunset', isLight);
            void setBaseTileTheme(theme);
            const button = document.getElementById('theme-toggle');
            if (button) {
                button.textContent = '◐';
                button.title = isLight ? 'Черная карта' : 'Светлая карта';
                button.setAttribute('aria-label', button.title);
            }
        }

        function toggleTheme() {
            const nextTheme = document.body.classList.contains('theme-sunset') ? 'dark' : 'light';
            applyTheme(nextTheme, true);
        }

        function formatCompactCount(value) {
            const safeValue = Number(value) || 0;
            if (safeValue >= 10000) {
                return Math.round(safeValue / 1000) + 'k+';
            }
            if (safeValue >= 1000) {
                return (safeValue / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }
            return String(safeValue);
        }

        function updateHeroMetrics() {
            const totalElement = document.getElementById('hero-total-count');
            const cityElement = document.getElementById('hero-city-count');

            if (totalElement) {
                totalElement.textContent = formatCompactCount(allData.length);
            }

            if (cityElement) {
                cityElement.textContent = formatCompactCount(Object.keys(citiesData).length);
            }
        }

        function applyUiCopy() {
            const searchChip = document.querySelector('.search-chip');
            const searchTitle = document.querySelector('.search-title');
            const searchSubtitle = document.querySelector('.search-subtitle');
            const totalLabel = document.querySelector('#hero-total-count + .search-metric-label');
            const cityLabel = document.querySelector('#hero-city-count + .search-metric-label');
            const filterTitle = document.querySelector('.filter-title');
            const loadingTitle = document.querySelector('.loading-title');
            const loadingText = document.querySelector('.loading-text');
            const sidebarTitle = document.getElementById('sidebar-title');

            if (searchChip) {
                searchChip.textContent = 'furry.by';
            }

            if (searchTitle) {
                searchTitle.textContent = '\u0424\u0443\u0440\u0440\u0438 \u0437\u043d\u0430\u043a\u043e\u043c\u0441\u0442\u0432\u0430';
            }

            if (searchSubtitle) {
                searchSubtitle.textContent = '\u0418\u0449\u0438 \u043f\u043e \u0433\u043e\u0440\u043e\u0434\u0443, \u043d\u0438\u043a\u0443 \u0438 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u044e. \u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0439 \u0442\u043e\u0447\u043a\u0438 \u0438 \u0431\u044b\u0441\u0442\u0440\u043e \u0434\u043e\u0445\u043e\u0434\u0438 \u0434\u043e \u043d\u0443\u0436\u043d\u043e\u0439 \u0430\u043d\u043a\u0435\u0442\u044b.';
            }

            if (totalLabel) {
                totalLabel.textContent = '\u0430\u043d\u043a\u0435\u0442';
            }

            if (cityLabel) {
                cityLabel.textContent = '\u0433\u043e\u0440\u043e\u0434\u043e\u0432';
            }

            if (filterTitle) {
                filterTitle.textContent = '\u041a\u043e\u0433\u043e \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u044c';
            }

            if (loadingTitle) {
                loadingTitle.textContent = 'Furry.by map';
            }

            if (loadingText) {

                loadingText.textContent = '\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043a\u0430\u0440\u0442\u0443 \u0438 \u0430\u043d\u043a\u0435\u0442\u044b...';
            }

            if (sidebarTitle) {
                sidebarTitle.dataset.kicker = '\u0422\u043e\u0447\u043a\u0430 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
                if (!sidebarTitle.dataset.subtitle) {
                    sidebarTitle.dataset.subtitle = '\u0421\u043f\u0438\u0441\u043e\u043a \u0430\u043d\u043a\u0435\u0442 \u043f\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0442\u043e\u0447\u043a\u0435 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
                }
            }
        }

        applyTheme(initialBaseTileTheme);
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            // Отменяем фоновую загрузку профилей
            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }

            if (currentProfiles.length === 0) {
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">Старые анкеты скрыты</div>';
                return;
            }
        }

        // Глобальный поиск
        function toggleGlobalSearch() {
            const panel = document.getElementById('global-search-panel');
            if (!panel) {
                return;
            }
            panel.classList.toggle('active');
            if (panel.classList.contains('active')) {
                const input = document.getElementById('global-search-input');
                if (input) input.focus();
            }
        }

        function globalSearch() {
            const resultsDiv = document.getElementById('global-search-results');
            const input = document.getElementById('global-search-input');
            if (!resultsDiv || !input) {
                return;
            }
            const query = input.value.toLowerCase().trim();
            
            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            sidebarProfilesSource = profiles.slice();
            currentProfiles = filterVisibleProfiles(profiles, threshold);
            
            // Поиск по имени и описанию
            const matches = allData.filter(form => {
                const name = form.name.toLowerCase();
                const text = form.form_text.toLowerCase();
                return name.includes(query) || text.includes(query);
            }).slice(0, 20);
            
            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 10px; color: #888;">Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            matches.forEach(form => {
                const cleanText = stripHtml(form.form_text);
                const shortText = cleanText.substring(0, 80);
                html += `<div class="global-search-item" onclick="showProfile(${form.form_id})">`;
                html += `<div class="global-search-item-name">${form.name}, ${form.age} • ${form.settlement}</div>`;
                html += `<div class="global-search-item-text">${shortText}...</div>`;
                html += `</div>`;
            });
            
            resultsDiv.innerHTML = html;
        }

        function showProfile(formId) {
            const form = allData.find(f => f.form_id === formId);
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            if (form && form.lat && form.lon && shouldDisplayForm(form, threshold)) {
                map.setView([form.lat, form.lon], 12);
                openSidebar([form]);
                // Закрываем панель поиска
                const panel = document.getElementById('global-search-panel');
                if (panel) panel.classList.remove('active');
            }
        }

        function likeProfile(formId) {
            // Открываем бота с командой лайка
            window.open('https://t.me/Furrybybot?start=like_' + formId, '_blank');
        }

        function sortProfiles(sortBy, btn) {
            currentSortBy = sortBy;
            
            document.querySelectorAll('.sort-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // Пересортировать текущие профили
            if (currentSortBy === 'new') {
                currentProfiles.sort((a, b) => b.form_id - a.form_id);
            } else if (currentSortBy === 'old') {
                currentProfiles.sort((a, b) => a.form_id - b.form_id);
            } else if (currentSortBy === 'popular') {
                currentProfiles.sort((a, b) => b.likes - a.likes);
            }
            
            renderProfiles();
        }

        function renderProfiles() {
            const profileList = document.getElementById('profile-list');
            
            // Отменяем предыдущую загрузку если была
            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }
            
            // Определяем порог для новых анкет один раз
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            // Если анкет мало (меньше 50), рендерим всё сразу
            if (currentProfiles.length <= 50) {
                let html = '';
                currentProfiles.forEach((form, index) => {
                    html += createProfileHTML(form, index, threshold);
                });
                profileList.innerHTML = html;
                return;
            }
            
            // Если анкет много - приоритетная загрузка
            const newProfiles = [];
            const oldProfiles = [];
            
            currentProfiles.forEach((form, index) => {
                if (isHighlightedNew(form, threshold)) {
                    newProfiles.push({ form, index });
                } else {
                    oldProfiles.push({ form, index });
                }
            });
            
            // Сначала рендерим новые профили
            let html = '';
            newProfiles.forEach(({ form, index }) => {
                html += createProfileHTML(form, index, threshold);
            });
            profileList.innerHTML = html;
            
            // Потом добавляем старые профили порциями
            let currentBatch = 0;
            const batchSize = 30;
            
            function addOldBatch() {
                const start = currentBatch * batchSize;
                const end = Math.min(start + batchSize, oldProfiles.length);
                
                let batchHTML = '';
                for (let i = start; i < end; i++) {
                    const { form, index } = oldProfiles[i];
                    batchHTML += createProfileHTML(form, index, threshold);
                }
                
                profileList.innerHTML += batchHTML;
                
                currentBatch++;
                if (end < oldProfiles.length) {
                    renderTimeout = setTimeout(addOldBatch, 150);
                }
            }
            
            if (oldProfiles.length > 0) {
                renderTimeout = setTimeout(addOldBatch, 100);
            }
        }
        
        function createProfileHTML(form, index, threshold) {
            const vipBadge = form.is_vip ? ' <span class="vip-badge-sidebar" onclick="event.stopPropagation();alert(\'👑 VIP подписку можно купить в @Furrybybot\')" title="Нажми чтобы узнать о VIP">👑</span>' : '';
            const cleanText = stripHtml(form.form_text);
            const shortText = cleanText.substring(0, 100);
            const needsExpand = cleanText.length > 100;
            const isNew = isHighlightedNew(form, threshold);
            const profileDate = formatProfileDate(form.source_date);
            const metaParts = [form.age + ' лет', escapeHtml(form.settlement)];
            const photoMarkup = createProfilePhotoMarkup(form);
            if (profileDate) metaParts.push(profileDate);
            
            let html = '<div class="profile-item' + (isNew ? ' new' : '') + (form.is_vip ? ' vip' : '') + '" onclick="toggleProfile(' + index + ')">';
            html += photoMarkup;
            html += '<div class="profile-header">';
            html += createProfileAvatarMarkup(form);
            html += '<div class="profile-info">';
            html += '<h3>' + escapeHtml(form.name) + vipBadge + '</h3>';
            html += '<div class="profile-meta">' + metaParts.join(' • ') + '</div>';
            html += '</div></div>';
            html += '<div class="profile-hashtags">' + escapeHtml(filterHashtags(form.hashtag || '')) + '</div>';
            html += '<div class="profile-text collapsed" id="text-' + index + '">' + escapeHtml(shortText) + (needsExpand ? '...' : '') + '</div>';
            html += '<div class="profile-footer">';
            html += '<div class="profile-likes" data-like-form-id="' + form.form_id + '" onclick="likeProfile(' + form.form_id + '); event.stopPropagation();" style="cursor: pointer;">❤️ ' + form.likes + '</div>';
            html += createTelegramWriteLink(form);
            html += '</div></div>';
            
            expandedStates[index] = false;
            return html;
        }

        function setLookingFor(gender, btn) {
            lookingFor = gender;
            
            document.querySelectorAll('.filter-btn-orientation').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            applyFilters();
        }

        function showAllMarkers() {
            markers.clearLayers();
            
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            allData.forEach((form, index) => {
                if (form.lat && form.lon && form.age >= 16 && shouldDisplayForm(form, threshold)) {
                    const isNew = isHighlightedNew(form, threshold);
                    const marker = L.circleMarker([form.lat, form.lon], {
                        radius: 8,
                        fillColor: isNew ? '#ff4444' : '#66b3ff',
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                    marker.formIndex = index;
                    markers.addLayer(marker);
                }
            });
        }

        function applyFilters() {
            markers.clearLayers();
            
            // Определяем новые анкеты (топ 20% по form_id)
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            allData.forEach((form, index) => {
                if (form.lat && form.lon && form.age >= 16 && shouldDisplayForm(form, threshold)) {
                    const hashtag = (form.hashtag || '').toLowerCase();
                    
                    let profileGender = null;
                    if (hashtag.includes('#м')) profileGender = 'М';
                    else if (hashtag.includes('#ж')) profileGender = 'Ж';
                    else if (hashtag.includes('#ftm')) profileGender = 'М';
                    else if (hashtag.includes('#mtf')) profileGender = 'Ж';
                    
                    if (!profileGender) return;
                    
                    let show = false;
                    if (lookingFor === 'all') {
                        show = true;
                    } else {
                        show = profileGender === lookingFor;
                    }
                    
                    if (show) {
                        const isNew = isHighlightedNew(form, threshold);
                        const marker = L.circleMarker([form.lat, form.lon], {
                            radius: 8,
                            fillColor: isNew ? '#ff4444' : '#66b3ff',
                            color: '#fff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8
                        });
                        marker.formIndex = index;
                        markers.addLayer(marker);
                    }
                }
            });
        }

        function searchCity() {
            const query = document.getElementById('search-input').value.toLowerCase().trim();
            const resultsDiv = document.getElementById('search-results');
            
            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            const matches = Object.keys(citiesData)
                .filter(city => city.toLowerCase().includes(query))
                .map(city => ({
                    city,
                    count: getVisibleCityProfiles(city, threshold).length
                }))
                .filter(match => match.count > 0)
                .slice(0, 10);
            
            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            matches.forEach(({ city, count }) => {
                html += '<div class="search-result-item" onclick="showCity(\'' + city.replace(/'/g, "\\'") + '\')">';
                html += '<div class="search-result-city">' + escapeHtml(city) + '</div>';
                html += '<div class="search-result-count">' + count + ' анкет</div>';
                html += '</div>';
            });
            
            resultsDiv.innerHTML = html;
        }

        function showCity(city) {
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            const profiles = getVisibleCityProfiles(city, threshold);

            if (profiles.length === 0) {
                return;
            }

            openSidebar(profiles);
            
            const firstProfile = profiles[0];
            map.setView([firstProfile.lat, firstProfile.lon], 10);
            
            document.getElementById('search-input').value = '';
            document.getElementById('search-results').innerHTML = '';
        }

        function toggleProfile(index) {
            const textDiv = document.getElementById('text-' + index);
            const form = currentProfiles[index];
            const cleanText = stripHtml(form.form_text);
            
            if (expandedStates[index]) {
                expandedStates[index] = false;
                textDiv.className = 'profile-text collapsed';
                textDiv.textContent = cleanText.substring(0, 100) + (cleanText.length > 100 ? '...' : '');
            } else {
                expandedStates[index] = true;
                textDiv.className = 'profile-text';
                textDiv.textContent = cleanText;
            }
        }

        function stripHtml(html) {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        }

        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function safeTelegramUrl(value) {
            const raw = String(value ?? '').trim();
            if (/^https:\/\/t\.me\/[A-Za-z0-9_]{3,}(?:\?[A-Za-z0-9_=&-]+)?$/.test(raw)) {
                return raw;
            }
            if (/^tg:\/\/user\?id=\d+$/.test(raw)) {
                return raw;
            }
            return '';
        }

        function extractTelegramUsername(value) {
            const raw = String(value ?? '').trim();
            const startMatch = raw.match(/^https:\/\/t\.me\/Furrybybot\?start=([A-Za-z0-9_]{3,32})$/i);
            if (startMatch && /[A-Za-z_]/.test(startMatch[1])) {
                return startMatch[1];
            }

            const userMatch = raw.match(/^https:\/\/t\.me\/([A-Za-z0-9_]{3,32})(?:\?.*)?$/i);
            if (userMatch && userMatch[1].toLowerCase() !== 'furrybybot' && /[A-Za-z_]/.test(userMatch[1])) {
                return userMatch[1];
            }

            return '';
        }

        function createProfileAvatarMarkup(form) {
            const link = form && (form.user_link || form.telegram || '');
            const isVk = /^https?:\/\/vk\.com\//i.test(link);
            const iconSvg = isVk
                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12.8 17.6c-6.2 0-9.8-4.2-10-11.2h3.1c.2 5.1 2.3 7.2 4 7.6V6.4h2.9v4.4c1.7-.2 3.4-2.2 4-4.4h2.9c-.5 2.7-2.5 4.7-3.9 5.5 1.4.7 3.7 2.6 4.5 5.7H17c-.7-2.1-2.3-3.7-4.1-3.9v3.9z"/></svg>'
                : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M21.5 4.5c-.3-.2-.7-.3-1.1-.1L2.8 11.2c-.7.3-.7 1.3.1 1.5l4.5 1.4 1.7 5.1c.2.6 1 .8 1.4.3l2.5-3 4.3 3.1c.7.5 1.7.1 1.9-.8L22 5.7c.1-.5-.1-1-.5-1.2zM9.3 13.7l8.2-5.7-6.8 6.6-.3 3.2-1.1-4.1zm2.2 1.7 5.9-5.7-4.6 6.4-1.3-.7z"/></svg>';
            return '<div class="profile-avatar' + (isVk ? ' profile-avatar--vk' : ' profile-avatar--tg') + '">' + iconSvg + '</div>';
        }

        function createTelegramWriteLink(form, className = 'profile-link') {
            const link = form && (form.user_link || form.telegram);
            if (!link) return '';
            const isVk = /^https?:\/\/(www\.)?vk\.com\//i.test(link);
            const safeUrl = isVk ? link : safeTelegramUrl(link);
            if (!safeUrl) return '';
            const label = 'Написать';
            const username = isVk ? '' : extractTelegramUsername(link);
            const dataTag = username ? ' data-telegram-tag="@' + escapeHtml(username) + '"' : '';
            return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer" class="' + className + '"' + dataTag + ' onclick="return handleTelegramWriteClick(event, this)">' + label + '</a>';
        }

        function normalizePhotoPath(value) {
            const raw = String(value ?? '').trim();
            if (!raw) {
                return '';
            }
            if (/file exceeds maximum size/i.test(raw)) {
                return '';
            }
            const furryPhotoMatch = raw.match(/^https?:\/\/(?:www\.)?furry\.by\/(?:github\/)?photos\/([^?#]+)(?:[?#].*)?$/i);
            if (furryPhotoMatch && furryPhotoMatch[1]) {
                return 'photos/' + decodeURIComponent(furryPhotoMatch[1]);
            }
            const feelgramPhotoMatch = raw.match(/^https?:\/\/img\.feelgram\.me\/([^?#]+)(?:[?#].*)?$/i);
            if (feelgramPhotoMatch && feelgramPhotoMatch[1]) {
                return 'photos/' + decodeURIComponent(feelgramPhotoMatch[1]);
            }
            if (/^https?:\/\//i.test(raw)) {
                return raw;
            }
            return raw.replace(/^\.?\//, '').replace(/^\/+/, '');
        }

        function getPhotoCandidates(value) {
            const raw = normalizePhotoPath(value);
            if (!raw) {
                return [];
            }

            if (/^https?:\/\//i.test(raw)) {
                return [raw];
            }

            const fileName = raw.split('/').pop();
            const candidates = [raw];

            if (fileName) {
                candidates.push('photos/' + fileName);
            }

            return [...new Set(candidates.filter(Boolean))];
        }

        function buildPhotoOnError(candidates) {
            if (candidates.length <= 1) {
                return "handleProfilePhotoFail(this);";
            }

            const parts = [];
            for (let i = 1; i < candidates.length; i++) {
                parts.push(`if(this.dataset.fallback!=='${i}') { this.dataset.fallback='${i}'; this.src='${candidates[i]}'; return; }`);
            }
            parts.push("handleProfilePhotoFail(this);");
            return parts.join(' ');
        }

        function handleProfilePhotoLoad(img) {
            if (!img) {
                return;
            }
            img.classList.add('is-loaded');
            const wrap = img.closest('.profile-photo-wrap');
            if (wrap) {
                const loading = wrap.querySelector('.profile-photo-loading');
                if (loading) {

                    loading.remove();
                }
            }
        }
        window.handleProfilePhotoLoad = handleProfilePhotoLoad;

        function handleProfilePhotoFail(img) {
            if (!img) {
                return;
            }
            img.onerror = null;
            img.onload = null;
            const wrap = img.closest('.profile-photo-wrap');
            if (wrap) {
                wrap.classList.add('is-missing');
                const loading = wrap.querySelector('.profile-photo-loading');
                if (loading) {
                    loading.textContent = 'Фото недоступно';
                }
            }
        }
        window.handleProfilePhotoFail = handleProfilePhotoFail;

        function createProfilePhotoMarkup(form) {
            const candidates = getPhotoCandidates(form && form.photo);
            if (candidates.length === 0) {
                return '';
            }

            const safeSrc = escapeHtml(candidates[0]);
            const safeAlt = escapeHtml(form && form.name ? form.name : 'Фото анкеты');
            const safeOnError = escapeHtml(buildPhotoOnError(candidates));
            const safeOnLoad = "handleProfilePhotoLoad(this)";

            return '<div class="profile-photo-wrap"><div class="profile-photo-loading">Загрузка фото...</div><img class="profile-photo" src="' + safeSrc + '" alt="' + safeAlt + '" loading="eager" decoding="async" fetchpriority="low" referrerpolicy="no-referrer" onload="' + safeOnLoad + '" onerror="' + safeOnError + '" onabort="handleProfilePhotoFail(this)"></div>';
        }

        function formatProfileDate(value) {
            if (!value) return '';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return '';
            return date.toLocaleDateString('ru-RU');
        }

        function isHighlightedNew(form, threshold) {
            return form.form_id >= threshold || !form.source_date;
        }

        function shouldDisplayForm(form, threshold) {
            return showOldProfiles || isHighlightedNew(form, threshold);
        }

        function filterVisibleProfiles(profiles, threshold) {
            return profiles.filter(profile => shouldDisplayForm(profile, threshold));
        }

        function getVisibleCityProfiles(city, threshold) {
            const indexes = citiesData[city] || [];
            return indexes
                .map(index => allData[index])
                .filter(profile => shouldDisplayForm(profile, threshold));
        }

        function toggleOldProfiles() {
            showOldProfiles = !showOldProfiles;

            const button = document.getElementById('toggle-old-btn');
            if (button) {
                button.textContent = showOldProfiles ? 'Скрыть старые' : 'Показать старые';
                button.classList.toggle('active', showOldProfiles);
            }

            applyFilters();

            if (document.getElementById('sidebar').classList.contains('open') && sidebarProfilesSource.length > 0) {
                openSidebar(sidebarProfilesSource);
            }

            if (document.getElementById('search-input').value.trim().length >= 2) {
                searchCity();
            }

            const globalSearchInput = document.getElementById('global-search-input');
            if (globalSearchInput && globalSearchInput.value.trim().length >= 2) {
                globalSearch();
            }
        }

        function filterHashtags(hashtags) {
            if (!hashtags) return '';
            
            if (hashtagCache.has(hashtags)) {
                return hashtagCache.get(hashtags);
            }
            
            let filtered = String(hashtags)
                .split(/\s+/)
                .map(tag => tag.startsWith('#') ? tag : '#' + tag)
                .join(' ');
            
            filtered = filtered.replace(/#М(\s|$)/gi, '');
            filtered = filtered.replace(/#Ж(\s|$)/gi, '');
            filtered = filtered.replace(/#FtM(\s|$)/gi, '');
            filtered = filtered.replace(/#MtF(\s|$)/gi, '');
            
            filtered = filtered.replace(/#Гей(\s|$)/gi, '');
            filtered = filtered.replace(/#Лесби(\s|$)/gi, '');
            filtered = filtered.replace(/#Би(\s|$)/gi, '');
            filtered = filtered.replace(/#Пан(\s|$)/gi, '');
            filtered = filtered.replace(/#Гетеро(\s|$)/gi, '');
            filtered = filtered.replace(/#Асексуал(\s|$)/gi, '');
            filtered = filtered.replace(/#Деми(\s|$)/gi, '');
            filtered = filtered.replace(/#Неважно(\s|$)/gi, '');
            filtered = filtered.replace(/#Транс(\s|$)/gi, '');
            filtered = filtered.replace(/#Пансексуал(\s|$)/gi, '');
            
            filtered = filtered.replace(/#[^\s]*область(\s|$)/gi, '');
            filtered = filtered.replace(/#[^\s]*край(\s|$)/gi, '');
            filtered = filtered.replace(/#[^\s]*уезд(\s|$)/gi, '');
            filtered = filtered.replace(/#[^\s]*район(\s|$)/gi, '');
            
            if (cityTagsSet && cityTagsSet.size > 0) {
                cityTagsSet.forEach(cityTag => {
                    const escapedCity = cityTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp('#' + escapedCity, 'gi');
                    filtered = filtered.replace(regex, '');
                });
            }
            
            filtered = filtered.replace(/\s+/g, ' ').trim();
            
            hashtagCache.set(hashtags, filtered);
            
            return filtered;
        }

        function openSidebar(profiles) {
            const sidebar = document.getElementById('sidebar');
            const title = document.getElementById('sidebar-title');
            
            
            // Определяем новые анкеты
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            const newCount = profiles.filter(p => isHighlightedNew(p, threshold)).length;
            
            let titleText = profiles.length === 1 ? 'Анкета' : 'Анкеты (' + profiles.length + ')';
            if (newCount > 0) {
                titleText += ' • <span style="color: #ff4444;">' + newCount + ' новых</span>';
            }
            title.innerHTML = titleText;
            
            // Применить текущую сортировку
            if (currentSortBy === 'new') {
                currentProfiles.sort((a, b) => b.form_id - a.form_id);
            } else if (currentSortBy === 'old') {
                currentProfiles.sort((a, b) => a.form_id - b.form_id);
            } else if (currentSortBy === 'popular') {
                currentProfiles.sort((a, b) => b.likes - a.likes);
            }
            
            renderProfiles();
            sidebar.classList.add('open');
        }

        // Переопределяем рендеринг пользовательских данных через экранирование,
        // чтобы анкеты не могли вставить HTML/JS в выдачу или карточки.
        globalSearch = function() {
            const resultsDiv = document.getElementById('global-search-results');
            const input = document.getElementById('global-search-input');
            if (!resultsDiv || !input) {
                return;
            }
            const query = input.value.toLowerCase().trim();
            
            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            
            const matches = allData.filter(form => {
                if (!shouldDisplayForm(form, threshold)) {
                    return false;
                }
                const name = form.name.toLowerCase();
                const text = form.form_text.toLowerCase();
                return name.includes(query) || text.includes(query);
            }).slice(0, 20);
            
            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 10px; color: #888;">Ничего не найдено</div>';
                return;
            }
            
            let html = '';
            matches.forEach(form => {
                const cleanText = stripHtml(form.form_text);
                const shortText = cleanText.substring(0, 80);
                html += `<div class="global-search-item" onclick="showProfile(${form.form_id})">`;
                html += `<div class="global-search-item-name">${escapeHtml(form.name)}, ${form.age} • ${escapeHtml(form.settlement)}</div>`;
                html += `<div class="global-search-item-text">${escapeHtml(shortText)}...</div>`;
                html += `</div>`;
            });
            
            resultsDiv.innerHTML = html;
        };

        openSidebar = function(profiles) {
            const sidebar = document.getElementById('sidebar');
            const title = document.getElementById('sidebar-title');
            
            currentProfiles = profiles;
            
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            const newCount = profiles.filter(p => isHighlightedNew(p, threshold)).length;
            
            const titleText = profiles.length === 1 ? 'Анкета' : 'Анкеты (' + profiles.length + ')';
            title.textContent = titleText;
            title.dataset.subtitle = newCount > 0
                ? newCount + ' РЅРѕРІС‹С… РІРЅСѓС‚СЂРё СЌС‚РѕР№ С‚РѕС‡РєРё'
                : 'РЎРїРёСЃРѕРє Р°РЅРєРµС‚ РїРѕ РІС‹Р±СЂР°РЅРЅРѕР№ С‚РѕС‡РєРµ РЅР° РєР°СЂС‚Рµ';
            if (newCount > 0) {
                const badge = document.createElement('span');
                badge.style.color = '#ff4444';
                badge.textContent = ' • ' + newCount + ' новых';
                title.appendChild(badge);
            }
            
            if (currentSortBy === 'new') {
                currentProfiles.sort((a, b) => b.form_id - a.form_id);
            } else if (currentSortBy === 'old') {
                currentProfiles.sort((a, b) => a.form_id - b.form_id);
            } else if (currentSortBy === 'popular') {
                currentProfiles.sort((a, b) => b.likes - a.likes);
            }
            
            renderProfiles();
            sidebar.classList.add('open');
        };

        renderProfiles = function() {
            const profileList = document.getElementById('profile-list');

            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }

            if (currentProfiles.length === 0) {
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">Старые анкеты скрыты</div>';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            if (currentProfiles.length <= 50) {
                let html = '';
                currentProfiles.forEach((form, index) => {
                    html += createProfileHTML(form, index, threshold);
                });
                profileList.innerHTML = html;
                return;
            }

            const newProfiles = [];
            const oldProfiles = [];

            currentProfiles.forEach((form, index) => {
                if (isHighlightedNew(form, threshold)) {
                    newProfiles.push({ form, index });
                } else {
                    oldProfiles.push({ form, index });
                }
            });

            let html = '';
            newProfiles.forEach(({ form, index }) => {
                html += createProfileHTML(form, index, threshold);
            });
            profileList.innerHTML = html;

            let currentBatch = 0;
            const batchSize = 30;

            function addOldBatch() {
                const start = currentBatch * batchSize;
                const end = Math.min(start + batchSize, oldProfiles.length);

                let batchHTML = '';
                for (let i = start; i < end; i++) {
                    const { form, index } = oldProfiles[i];
                    batchHTML += createProfileHTML(form, index, threshold);
                }

                profileList.innerHTML += batchHTML;

                currentBatch++;
                if (end < oldProfiles.length) {
                    renderTimeout = setTimeout(addOldBatch, 150);
                }
            }

            if (oldProfiles.length > 0) {
                renderTimeout = setTimeout(addOldBatch, 100);
            }
        };

        applyFilters = function() {
            markers.clearLayers();

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            allData.forEach((form, index) => {
                if (!(form.lat && form.lon && form.age >= 16 && shouldDisplayForm(form, threshold))) {
                    return;
                }

                const hashtag = (form.hashtag || '').toLowerCase();

                let profileGender = null;
                if (hashtag.includes('#Рј')) profileGender = 'Рњ';
                else if (hashtag.includes('#Р¶')) profileGender = 'Р–';
                else if (hashtag.includes('#ftm')) profileGender = 'Рњ';
                else if (hashtag.includes('#mtf')) profileGender = 'Р–';

                if (!profileGender) return;

                let show = false;
                if (lookingFor === 'all') {
                    show = true;
                } else {
                    show = profileGender === lookingFor;
                }

                if (!show) return;

                const isNew = isHighlightedNew(form, threshold);
                const marker = L.circleMarker([form.lat, form.lon], {
                    radius: 8,
                    fillColor: isNew ? '#ff4444' : '#66b3ff',
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                marker.formIndex = index;
                markers.addLayer(marker);
            });
        };

        searchCity = function() {
            const query = document.getElementById('search-input').value.toLowerCase().trim();
            const resultsDiv = document.getElementById('search-results');

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            const matches = Object.keys(citiesData)
                .filter(city => city.toLowerCase().includes(query))
                .map(city => ({
                    city,
                    count: getVisibleCityProfiles(city, threshold).length
                }))
                .filter(match => match.count > 0)
                .slice(0, 10);

            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
                return;
            }

            let html = '';
            matches.forEach(({ city, count }) => {
                html += '<div class="search-result-item" onclick="showCity(\'' + city.replace(/'/g, "\\'") + '\')">';
                html += '<div class="search-result-city">' + escapeHtml(city) + '</div>';
                html += '<div class="search-result-count">' + count + ' анкет</div>';
                html += '</div>';
            });

            resultsDiv.innerHTML = html;
        };

        showCity = function(city) {
            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;
            const profiles = getVisibleCityProfiles(city, threshold);

            if (profiles.length === 0) {
                return;
            }

            openSidebar(profiles);

            const firstProfile = profiles[0];
            map.setView([firstProfile.lat, firstProfile.lon], 10);

            document.getElementById('search-input').value = '';
            document.getElementById('search-results').innerHTML = '';
        };

        globalSearch = function() {
            const resultsDiv = document.getElementById('global-search-results');
            const input = document.getElementById('global-search-input');
            if (!resultsDiv || !input) {
                return;
            }
            const query = input.value.toLowerCase().trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            const matches = allData.filter(form => {
                if (!shouldDisplayForm(form, threshold)) {
                    return false;
                }

                const name = form.name.toLowerCase();
                const text = form.form_text.toLowerCase();
                return name.includes(query) || text.includes(query);
            }).slice(0, 20);

            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 10px; color: #888;">Ничего не найдено</div>';
                return;
            }

            let html = '';
            matches.forEach(form => {
                const cleanText = stripHtml(form.form_text);
                const shortText = cleanText.substring(0, 80);
                html += `<div class="global-search-item" onclick="showProfile(${form.form_id})">`;
                html += `<div class="global-search-item-name">${escapeHtml(form.name)}, ${form.age} • ${escapeHtml(form.settlement)}</div>`;
                html += `<div class="global-search-item-text">${escapeHtml(shortText)}...</div>`;
                html += `</div>`;
            });

            resultsDiv.innerHTML = html;
        };

        openSidebar = function(profiles) {
            const sidebar = document.getElementById('sidebar');
            const title = document.getElementById('sidebar-title');

            const maxId = Math.max(...allData.map(f => f.form_id));
            const minId = Math.min(...allData.map(f => f.form_id));
            const threshold = maxId - (maxId - minId) * 0.2;

            sidebarProfilesSource = profiles.slice();
            currentProfiles = filterVisibleProfiles(profiles, threshold);
            const newCount = currentProfiles.filter(p => isHighlightedNew(p, threshold)).length;

            const titleText = currentProfiles.length === 1 ? 'Анкета' : 'Анкеты (' + currentProfiles.length + ')';
            title.textContent = titleText;
            if (newCount > 0) {
                const badge = document.createElement('span');
                badge.style.color = '#ff4444';
                badge.textContent = ' • ' + newCount + ' новых';
                title.appendChild(badge);
            }

            if (currentSortBy === 'new') {
                currentProfiles.sort((a, b) => b.form_id - a.form_id);
            } else if (currentSortBy === 'old') {
                currentProfiles.sort((a, b) => a.form_id - b.form_id);
            } else if (currentSortBy === 'popular') {
                currentProfiles.sort((a, b) => b.likes - a.likes);
            }

            renderProfiles();
            sidebar.classList.add('open');
        };

        closeSidebar = function() {
            document.getElementById('sidebar').classList.remove('open');
            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }
            currentProfiles = [];
            sidebarProfilesSource = [];
            sidebarVisibleProfiles = [];
            sidebarVisibleCount = sidebarBatchSize;
            expandedStates = {};
            const loadMoreButton = document.getElementById('load-more-btn');
            if (loadMoreButton) {
                loadMoreButton.style.display = 'none';
            }
        };

        function getRecentThresholdDate() {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            return date;
        }

        function getSidebarThresholdDate() {
            const date = new Date();
            date.setMonth(date.getMonth() - 12);
            return date;
        }

        function getProfileSourceTime(form) {
            if (!form || !form.source_date) {
                return 0;
            }

            const time = Date.parse(form.source_date);
            return Number.isFinite(time) ? time : 0;
        }

        function getProfileSearchText(form) {
            if (!form) {
                return '';
            }

            return [
                form.name,
                form.settlement,
                form.hashtag,
                form.tag,
                form.form_text
            ]
                .map(value => String(value || '').toLowerCase())
                .join('\n');
        }

        function primeProfileRuntimeFields(form, index, undatedThreshold) {
            if (!form) {
                return;
            }

            const lat = Number(form.lat);
            const lon = Number(form.lon);
            const sourceTime = getProfileSourceTime(form);
            const formId = Number(form.form_id);
            const age = Number(form.age);

            form._dataIndex = index;
            form._formIdNumber = Number.isFinite(formId) ? formId : 0;
            form._sourceTime = sourceTime;
            form._ageNumber = Number.isFinite(age) ? age : 0;
            form._mapLat = Number.isFinite(lat) ? lat : NaN;
            form._mapLon = Number.isFinite(lon) ? lon : NaN;
            form._searchText = getProfileSearchText(form);
            form._isSidebarRecent = Boolean(sourceTime && sourceTime >= sidebarThresholdTime);
            form._isHighlightedNew = sourceTime
                ? sourceTime >= recentThresholdTime
                : form._formIdNumber >= undatedThreshold;
            form._isMappable = Number.isFinite(form._mapLat)
                && Number.isFinite(form._mapLon)
                && form._ageNumber >= 16;

            if (Number.isFinite(form._mapLat)) {
                form.lat = form._mapLat;
            }
            if (Number.isFinite(form._mapLon)) {
                form.lon = form._mapLon;
            }

            if (form.settlement && /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(form.settlement) && Number.isFinite(form._mapLat) && Number.isFinite(form._mapLon)) {
                form.settlement = resolveCityFromNeighbors(form._mapLat, form._mapLon) || '';
            }
        }

        function getRecentUndatedFormIdThreshold() {
            if (recentUndatedFormIdThreshold !== null) {
                return recentUndatedFormIdThreshold;
            }

            const ids = allData
                .filter(form => form && !form.source_date)
                .map(form => Number(form.form_id))
                .filter(Number.isFinite);

            if (ids.length === 0) {
                recentUndatedFormIdThreshold = Infinity;
                return recentUndatedFormIdThreshold;
            }

            ids.sort((a, b) => a - b);
            const thresholdIndex = Math.max(0, Math.floor(ids.length * 0.8) - 1);
            recentUndatedFormIdThreshold = ids[thresholdIndex];
            return recentUndatedFormIdThreshold;
        }

        isHighlightedNew = function(form) {
            if (!form) {
                return false;
            }

            if (typeof form._isHighlightedNew === 'boolean') {
                return form._isHighlightedNew;
            }

            if (!form.source_date) {
                return Number(form.form_id) >= getRecentUndatedFormIdThreshold();
            }

            const sourceTime = getProfileSourceTime(form);
            if (!sourceTime) {
                return Number(form.form_id) >= getRecentUndatedFormIdThreshold();
            }

            return sourceTime >= (recentThresholdTime || getRecentThresholdDate().getTime());
        };

        function buildSidebarProfiles(profiles) {
            if (profiles.length === 1) {
                return profiles.slice();
            }

            const recentProfiles = profiles.filter(profile => {
                if (!profile || !profile.source_date) {
                    return false;
                }

                const date = new Date(profile.source_date);
                if (Number.isNaN(date.getTime())) {
                    return false;
                }

                return date >= getSidebarThresholdDate();
            });
            if (showOldProfiles) {
                const recentIds = new Set(recentProfiles.map(profile => profile.form_id));
                const oldProfiles = profiles.filter(profile => !recentIds.has(profile.form_id));
                return recentProfiles.concat(oldProfiles);
            }
            return recentProfiles;
        }

        function sortSidebarProfiles() {
            if (currentSortBy === 'new') {
                sidebarVisibleProfiles.sort((a, b) => {
                    const aIsNew = isHighlightedNew(a) ? 1 : 0;
                    const bIsNew = isHighlightedNew(b) ? 1 : 0;
                    if (aIsNew !== bIsNew) {
                        return bIsNew - aIsNew;
                    }

                    const dateA = Number.isFinite(a._sourceTime) ? a._sourceTime : getProfileSourceTime(a);
                    const dateB = Number.isFinite(b._sourceTime) ? b._sourceTime : getProfileSourceTime(b);
                    return dateB - dateA || b.form_id - a.form_id;
                });
            } else if (currentSortBy === 'old') {
                sidebarVisibleProfiles.sort((a, b) => {
                    const dateA = Number.isFinite(a._sourceTime) ? a._sourceTime : getProfileSourceTime(a);
                    const dateB = Number.isFinite(b._sourceTime) ? b._sourceTime : getProfileSourceTime(b);
                    return dateA - dateB || a.form_id - b.form_id;
                });
            } else if (currentSortBy === 'popular') {
                sidebarVisibleProfiles.sort((a, b) => b.likes - a.likes);
            }
        }

        function updateSidebarTitle() {
            const title = document.getElementById('sidebar-title');
            const totalVisible = sidebarVisibleProfiles.length;
            const totalSource = sidebarProfilesSource.length;
            const hiddenOldCount = Math.max(totalSource - totalVisible, 0);
            const titleText = totalVisible === 1 ? 'Анкета' : 'Анкеты (' + totalVisible + ')';
            title.textContent = titleText;

            if (hiddenOldCount > 0 && !showOldProfiles) {
                const badge = document.createElement('span');
                badge.style.color = '#888';
                badge.textContent = ' • скрыто старых: ' + hiddenOldCount;
                title.appendChild(badge);
            }
        }

        function updateLoadMoreButton() {
            const loadMoreButton = document.getElementById('load-more-btn');
            if (!loadMoreButton) {
                return;
            }

            if (sidebarVisibleCount >= sidebarVisibleProfiles.length) {
                loadMoreButton.style.display = 'none';
                return;
            }

            const remaining = sidebarVisibleProfiles.length - sidebarVisibleCount;
            loadMoreButton.textContent = 'Показать больше (' + remaining + ')';
            loadMoreButton.style.display = 'block';
        }

        function refreshSidebarProfiles() {
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            updateSidebarTitle();
            renderProfiles();
        }

        showMoreProfiles = function() {
            sidebarVisibleCount += sidebarBatchSize;
            renderProfiles();
        };

        sortProfiles = function(sortBy, btn) {
            currentSortBy = sortBy;

            document.querySelectorAll('.sort-btn').forEach(button => {
                button.classList.remove('active');
            });
            btn.classList.add('active');

            sortSidebarProfiles();
            renderProfiles();
        };

        toggleOldProfiles = function() {
            showOldProfiles = !showOldProfiles;

            const button = document.getElementById('toggle-old-btn');
            if (button) {
                button.textContent = showOldProfiles ? 'Скрыть старые' : 'Показать старые';
                button.classList.toggle('active', showOldProfiles);
            }

            if (sidebarProfilesSource.length > 0) {
                sidebarVisibleCount = sidebarBatchSize;
                refreshSidebarProfiles();
            }
        };

        let deckMarkerItems = [];
        let markerCanvasFrame = 0;
        let markerCanvasThrottleTimer = null;
        let lastMarkerCanvasRenderAt = 0;
        let markerRefreshTimer = null;
        let markerMapDataDirty = true;
        const MAP_MARKER_SOURCE_ID = 'furry-profile-markers';
        const MAP_MARKER_CIRCLE_LAYER_ID = 'furry-profile-marker-circles';
        const MAP_MARKER_COUNT_LAYER_ID = 'furry-profile-marker-counts';

        function getMarkerCellSize(zoom) {
            let size;
            if (zoom < 5) size = 190;
            else if (zoom < 7) size = 165;
            else if (zoom < 10) size = 136;
            else if (zoom < 12) size = 108;
            else if (zoom < 15) size = 78;
            else size = 48;
            return MAP_IS_LOW_POWER ? Math.round(size * 1.15) : size;
        }

        function buildDeckMarkerItems(filterFn) {
            const zoom = map && typeof map.getZoom === 'function' ? map.getZoom() : 0;
            const cellSize = getMarkerCellSize(zoom);
            const groups = new Map();
            const items = [];
            const sourceProfiles = mappableProfiles.length > 0 ? mappableProfiles : allData;

            for (let listIndex = 0; listIndex < sourceProfiles.length; listIndex++) {
                const form = sourceProfiles[listIndex];
                const index = Number.isFinite(form && form._dataIndex) ? form._dataIndex : listIndex;
                if (!filterFn(form, index)) {
                    continue;
                }

                const lon = Number.isFinite(form && form._mapLon) ? form._mapLon : Number(form && form.lon);
                const lat = Number.isFinite(form && form._mapLat) ? form._mapLat : Number(form && form.lat);
                if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                    continue;
                }

                const pixel = map.project([lon, lat]);
                const key = Math.floor(pixel.x / cellSize) + ':' + Math.floor(pixel.y / cellSize);
                let group = groups.get(key);
                if (!group) {
                    group = { forms: [], newCount: 0, sumX: 0, sumY: 0 };
                    groups.set(key, group);
                }
                group.forms.push(form);
                group.newCount += isHighlightedNew(form) ? 1 : 0;
                group.sumX += pixel.x;
                group.sumY += pixel.y;
            }

            groups.forEach(group => {
                if (group.forms.length === 1) {
                    const form = group.forms[0];
                    items.push({
                        type: 'point',
                        form,
                        profiles: [form],
                        count: 1,
                        newCount: group.newCount,
                        lon: Number.isFinite(form._mapLon) ? form._mapLon : Number(form.lon),
                        lat: Number.isFinite(form._mapLat) ? form._mapLat : Number(form.lat)
                    });
                    return;
                }

                const center = map.unproject([
                    group.sumX / group.forms.length,
                    group.sumY / group.forms.length
                ]);
                items.push({
                    type: 'cluster',
                    profiles: group.forms,
                    count: group.forms.length,
                    newCount: group.newCount,
                    lon: center.lng,
                    lat: center.lat
                });
            });

            return items;
        }

        function getDeckFillColor(item, alpha = 220) {
            if (!item) {
                return [102, 179, 255, alpha];
            }
            if (item.type === 'cluster') {
                const ratio = item.count > 0 ? item.newCount / item.count : 0;
                return ratio >= 0.3 ? [255, 68, 68, alpha] : [102, 179, 255, alpha];
            }
            return item.newCount > 0 ? [255, 68, 68, alpha] : [102, 179, 255, alpha];
        }

        function rgbToHex(color) {
            return '#' + color.slice(0, 3).map(value => {
                const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

        function getDeckRadius(item) {
            if (!item || item.type !== 'cluster') {
                const zoom = map && typeof map.getZoom === 'function' ? map.getZoom() : 0;
                if (zoom < 7) return 5;
                if (zoom < 10) return 6;
                if (zoom < 13) return 8;
                return 9;
            }
            const zoom = map && typeof map.getZoom === 'function' ? map.getZoom() : 0;
            const scale = zoom < 7 ? 0.72 : (zoom < 10 ? 0.84 : 1);
            if (item.count > 100) return Math.round(30 * scale);
            if (item.count > 50) return Math.round(26 * scale);
            if (item.count > 10) return Math.round(22 * scale);
            return Math.round(18 * scale);
        }

        function resizeMarkerCanvas() {
            const canvas = document.getElementById('marker-canvas');
            if (!canvas) {
                return null;
            }
            canvas.style.display = 'block';
            const rect = canvas.getBoundingClientRect();
            const maxRatio = MAP_IS_LOW_POWER ? 1.25 : 1.6;
            const ratio = Math.max(1, Math.min(window.devicePixelRatio || 1, maxRatio));
            const width = Math.max(1, Math.floor(rect.width * ratio));
            const height = Math.max(1, Math.floor(rect.height * ratio));
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            }
            return { canvas, ratio };
        }

        function drawCanvasMarker(ctx, item, x, y, ratio) {
            const isCluster = item.type === 'cluster';
            const color = getDeckFillColor(item, 255);
            const r = getDeckRadius(item) * ratio;
            const rgba = alpha => 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')';

            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = rgba(isCluster ? 0.66 : 0.62);
            ctx.strokeStyle = 'rgba(5,10,16,0.98)';
            ctx.lineWidth = (isCluster ? 1.8 : 1.3) * ratio;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (isCluster) {
                const fontSize = Math.max(10, Math.min(14, getDeckRadius(item) * 0.48)) * ratio;
                ctx.fillStyle = 'rgba(245,250,255,0.96)';
                ctx.strokeStyle = 'rgba(0,0,0,0.55)';
                ctx.lineWidth = 2.4 * ratio;
                ctx.font = '800 ' + fontSize + 'px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.strokeText(String(item.count), x, y + ratio);
                ctx.fillText(String(item.count), x, y + ratio);
            }
        }

        function ensureMapMarkerLayers() {
            if (!map || !map.isStyleLoaded || !map.isStyleLoaded()) {
                return false;
            }

            if (!map.getSource(MAP_MARKER_SOURCE_ID)) {
                map.addSource(MAP_MARKER_SOURCE_ID, {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] }
                });
            }

            const beforeLabelLayer = map.getLayer('russian-place-labels')
                ? 'russian-place-labels'
                : (map.getLayer('russian-road-labels') ? 'russian-road-labels' : undefined);

            if (!map.getLayer(MAP_MARKER_CIRCLE_LAYER_ID)) {
                map.addLayer({
                    id: MAP_MARKER_CIRCLE_LAYER_ID,
                    type: 'circle',
                    source: MAP_MARKER_SOURCE_ID,
                    paint: {
                        'circle-radius': ['get', 'radius'],
                        'circle-color': ['get', 'color'],
                        'circle-opacity': ['get', 'opacity'],
                        'circle-stroke-color': 'rgba(5,10,16,0.82)',
                        'circle-stroke-width': ['get', 'strokeWidth'],
                        'circle-stroke-opacity': 0.9
                    }
                }, beforeLabelLayer);
            } else if (beforeLabelLayer) {
                try {
                    map.moveLayer(MAP_MARKER_CIRCLE_LAYER_ID, beforeLabelLayer);
                } catch (error) {
                    console.warn('Marker circle layer order was not changed:', error);
                }
            }

            if (!map.getLayer(MAP_MARKER_COUNT_LAYER_ID)) {
                map.addLayer({
                    id: MAP_MARKER_COUNT_LAYER_ID,
                    type: 'symbol',
                    source: MAP_MARKER_SOURCE_ID,
                    filter: ['>', ['get', 'count'], 1],
                    layout: {
                        'text-field': ['to-string', ['get', 'count']],
                        'text-font': ['Open Sans Bold'],
                        'text-size': ['get', 'fontSize'],
                        'text-allow-overlap': true,
                        'text-ignore-placement': true
                    },
                    paint: {
                        'text-color': '#f8fbff',
                        'text-halo-color': 'rgba(0,0,0,0.78)',
                        'text-halo-width': 1.7,
                        'text-opacity': 1
                    }
                });
            }

            return true;
        }

        function syncMapMarkerLayers(force = false) {
            // MapLibre marker layers caused visible jitter while panning. Keep the old canvas renderer.
            return false;
        }

        function renderCanvasMarkers(forceSync = false) {
            const state = resizeMarkerCanvas();
            if (!state) {
                return;
            }

            const { canvas, ratio } = state;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!deckMarkerItems || deckMarkerItems.length === 0 || !map || typeof map.project !== 'function') {
                window.__furryMarkerDebug = {
                    totalData: allData.length,
                    deckItems: deckMarkerItems ? deckMarkerItems.length : 0,
                    reason: 'empty_or_no_project'
                };
                return;
            }

            if (syncMapMarkerLayers(forceSync)) {
                window.__furryMarkerDebug = {
                    totalData: allData.length,
                    deckItems: deckMarkerItems.length,
                    drawn: deckMarkerItems.length,
                    zoom: map.getZoom(),
                    mapLibreMarkers: true
                };
                return;
            }

            let drawn = 0;
            const visibleBounds = map && typeof map.getBounds === 'function'
                ? map.getBounds().pad(map.getZoom() >= 10 ? 0.18 : 0.35)
                : null;
            deckMarkerItems.forEach(item => {
                if (visibleBounds && !visibleBounds.contains([item.lat, item.lon])) {
                    return;
                }
                const projected = map.project([item.lon, item.lat]);
                const x = projected.x * ratio;
                const y = projected.y * ratio;
                if (x < -100 || y < -140 || x > canvas.width + 100 || y > canvas.height + 140) {
                    return;
                }
                drawCanvasMarker(ctx, item, x, y, ratio);
                drawn++;
            });
            window.__furryMarkerDebug = {
                totalData: allData.length,
                deckItems: deckMarkerItems.length,
                drawn,
                zoom: map.getZoom(),
                canvasMarkers: true
            };
        }

        function requestCanvasMarkerRender(force = false) {
            if (markerCanvasFrame) {
                return;
            }

            const now = performance.now();
            const minGap = isMapInteracting
                ? 16
                : (MAP_IS_LOW_POWER ? 82 : 42);
            if (!force && lastMarkerCanvasRenderAt && now - lastMarkerCanvasRenderAt < minGap) {
                if (!markerCanvasThrottleTimer) {
                    markerCanvasThrottleTimer = setTimeout(() => {
                        markerCanvasThrottleTimer = null;
                        requestCanvasMarkerRender(true);
                    }, Math.max(16, minGap - (now - lastMarkerCanvasRenderAt)));
                }
                return;
            }

            markerCanvasFrame = requestAnimationFrame(() => {
                markerCanvasFrame = 0;
                lastMarkerCanvasRenderAt = performance.now();
                renderCanvasMarkers(force);
            });
        }

        function scheduleStableMarkerSync(delay = 120) {
            window.setTimeout(() => {
                if (!deckMarkerItems || deckMarkerItems.length === 0) {
                    if (currentMarkerFilterFn) {
                        deckMarkerItems = buildDeckMarkerItems(currentMarkerFilterFn);
                        markerMapDataDirty = true;
                    } else {
                        return;
                    }
                }
                requestCanvasMarkerRender(true);
            }, delay);
        }

        function getCanvasMarkerAt(point) {
            if (!point || !deckMarkerItems || deckMarkerItems.length === 0) {
                return null;
            }

            let best = null;
            let bestDistance = Infinity;
            deckMarkerItems.forEach(item => {
                const projected = map.project([item.lon, item.lat]);
                const radius = item.type === 'cluster' ? Math.max(24, getDeckRadius(item)) : 18;
                const dx = projected.x - point.x;
                const dy = projected.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance <= radius && distance < bestDistance) {
                    best = item;
                    bestDistance = distance;
                }
            });
            return best;
        }

        function handleCanvasMarkerClick(event) {
            const item = getCanvasMarkerAt(event && event.point);
            if (!item) {
                return;
            }

            if (item.type === 'cluster') {
                openSidebar(item.profiles || []);
                return;
            }

            const form = item.form;
            if (form) {
                const profiles = getProfilesAtSamePoint(form);
                openSidebar(profiles.length > 0 ? profiles : [form]);
            }
        }

        async function rebuildMarkers(filterFn, statusLabel) {
            const renderToken = ++markerRenderToken;
            currentMarkerFilterFn = filterFn;
            const loading = document.getElementById('loading');
            if (loading && loading.style.display !== 'none') {
                setLoadingStatus(statusLabel);
            }

            await waitForMapReady();
            if (renderToken !== markerRenderToken) {
                return;
            }

            const build = () => {
                if (renderToken !== markerRenderToken) {
                    return;
                }
                deckMarkerItems = buildDeckMarkerItems(filterFn);
                markerMapDataDirty = true;
                requestCanvasMarkerRender(true);
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(build, { timeout: 500 });
            } else {
                setTimeout(build, 0);
            }
        }

        function scheduleMarkerRefresh(delay = MAP_IS_LOW_POWER ? 240 : 140) {
            if (!currentMarkerFilterFn) {
                return;
            }
            if (markerRefreshTimer) {
                clearTimeout(markerRefreshTimer);
            }
            markerRefreshTimer = setTimeout(() => {
                markerRefreshTimer = null;
                rebuildMarkers(currentMarkerFilterFn, 'Обновляем метки...');
            }, delay);
        }

        function hasProfileCoordinates(form) {
            return Boolean(
                form
                && Number.isFinite(Number.isFinite(form._mapLat) ? form._mapLat : Number(form.lat))
                && Number.isFinite(Number.isFinite(form._mapLon) ? form._mapLon : Number(form.lon))
            );
        }

        function isMappableProfile(form) {
            if (form && typeof form._isMappable === 'boolean') {
                return form._isMappable;
            }
            return hasProfileCoordinates(form) && Number(form && form.age) >= 16;
        }

        showAllMarkers = function() {
            return rebuildMarkers(
                form => isMappableProfile(form),
                'Рисуем метки...'
            );
        };

        applyFilters = function() {
            return rebuildMarkers(form => {
                if (!isMappableProfile(form)) {
                    return false;
                }

                const hashtag = (form.hashtag || '').toLowerCase();
                let profileGender = null;
                if (hashtag.includes('#м')) profileGender = 'М';
                else if (hashtag.includes('#ж')) profileGender = 'Ж';
                else if (hashtag.includes('#ftm')) profileGender = 'М';
                else if (hashtag.includes('#mtf')) profileGender = 'Ж';

                if (!profileGender) return false;
                return lookingFor === 'all' ? true : profileGender === lookingFor;
            }, 'Фильтруем анкеты...');
        };

        searchCity = function() {
            const query = document.getElementById('search-input').value.toLowerCase().trim();
            const resultsDiv = document.getElementById('search-results');

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const matches = Object.keys(citiesData)
                .filter(city => city.toLowerCase().includes(query))
                .map(city => ({
                    city,
                    count: citiesData[city].length
                }))
                .slice(0, 10);

            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
                return;
            }

            let html = '';
            matches.forEach(({ city, count }) => {
                html += '<div class="search-result-item" onclick="showCity(\'' + city.replace(/'/g, "\\'") + '\')">';
                html += '<div class="search-result-city">' + escapeHtml(city) + '</div>';
                html += '<div class="search-result-count">' + count + ' анкет</div>';
                html += '</div>';
            });

            resultsDiv.innerHTML = html;
        };

        showCity = function(city) {
            const profiles = (citiesData[city] || []).map(index => allData[index]);
            if (profiles.length === 0) {
                return;
            }

            openSidebar(profiles);


            const firstProfile = profiles[0];
            map.setView([firstProfile.lat, firstProfile.lon], 10);

            document.getElementById('search-input').value = '';
            document.getElementById('search-results').innerHTML = '';
        };

        globalSearch = function() {
            const resultsDiv = document.getElementById('global-search-results');
            const input = document.getElementById('global-search-input');
            if (!resultsDiv || !input) {
                return;
            }
            const query = input.value.toLowerCase().trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const matches = allData.filter(form => {
                if (!isHighlightedNew(form)) {
                    return false;
                }
                const name = form.name.toLowerCase();
                const text = form.form_text.toLowerCase();
                return name.includes(query) || text.includes(query);
            }).slice(0, 20);

            if (matches.length === 0) {
                resultsDiv.innerHTML = '<div style="padding: 10px; color: #888;">Ничего не найдено</div>';
                return;
            }

            let html = '';
            matches.forEach(form => {
                const cleanText = stripHtml(form.form_text);
                const shortText = cleanText.substring(0, 80);
                html += `<div class="global-search-item" onclick="showProfile(${form.form_id})">`;
                html += `<div class="global-search-item-name">${escapeHtml(form.name)}, ${form.age} • ${escapeHtml(form.settlement)}</div>`;
                html += `<div class="global-search-item-text">${escapeHtml(shortText)}...</div>`;
                html += `</div>`;
            });

            resultsDiv.innerHTML = html;
        };

        showProfile = function(formId) {
            const form = allData.find(profile => profile.form_id === formId);
            if (!form || !form.lat || !form.lon) {
                return;
            }

            map.setView([form.lat, form.lon], 12);
            openSidebar([form]);
            const panel = document.getElementById('global-search-panel');
            if (panel) panel.classList.remove('active');
        };

        renderProfiles = function() {
            const profileList = document.getElementById('profile-list');

            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }

            if (sidebarVisibleProfiles.length === 0) {
                currentProfiles = [];
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">Нет анкет за последние 6 месяцев</div>';
                updateLoadMoreButton();
                return;
            }

            const threshold = 0;
            currentProfiles = sidebarVisibleProfiles.slice(0, sidebarVisibleCount);
            expandedStates = {};

            let html = '';
            currentProfiles.forEach((form, index) => {
                html += createProfileHTML(form, index, threshold);
            });
            profileList.innerHTML = html;
            updateLoadMoreButton();
        };

        openSidebar = function(profiles) {
            const sidebar = document.getElementById('sidebar');

            sidebarProfilesSource = profiles.slice();
            sidebarVisibleCount = sidebarBatchSize;
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            updateSidebarTitle();
            renderProfiles();
            sidebar.classList.add('open');
        };

        toggleOldProfiles = function() {
            showOldProfiles = !showOldProfiles;

            const button = document.getElementById('toggle-old-btn');
            if (button) {
                button.textContent = showOldProfiles ? 'Скрыть старые' : 'Показать старые';
                button.classList.toggle('active', showOldProfiles);
            }

            if (sidebarProfilesSource.length > 0) {
                sidebarVisibleCount = sidebarBatchSize;
                sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
                sortSidebarProfiles();
                updateSidebarTitle();
                renderProfiles();
            }
        };

        renderProfiles = function() {
            const profileList = document.getElementById('profile-list');

            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }

            if (sidebarVisibleProfiles.length === 0) {
                currentProfiles = [];
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">' + (showOldProfiles ? 'Анкеты не найдены' : 'Нет анкет за последние 12 месяцев') + '</div>';
                updateLoadMoreButton();
                return;
            }

            currentProfiles = sidebarVisibleProfiles.slice(0, sidebarVisibleCount);
            expandedStates = {};

            let html = '';
            currentProfiles.forEach((form, index) => {
                html += createProfileHTML(form, index, 0);
            });
            profileList.innerHTML = html;
            updateLoadMoreButton();
        };

        openSidebar = function(profiles) {
            const sidebar = document.getElementById('sidebar');

            sidebarProfilesSource = profiles.slice();
            sidebarVisibleCount = sidebarBatchSize;
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            updateSidebarTitle();
            renderProfiles();
            sidebar.classList.add('open');
        };

        updateSidebarTitle = function() {
            const title = document.getElementById('sidebar-title');
            const totalCount = sidebarProfilesSource.length;
            const newCount = sidebarProfilesSource.filter(profile => isHighlightedNew(profile)).length;
            const titleText = totalCount === 1
                ? '\u0410\u043d\u043a\u0435\u0442\u0430'
                : '\u0410\u043d\u043a\u0435\u0442\u044b (' + totalCount + ')';
            title.textContent = titleText;
            if (newCount > 0) {
                const badge = document.createElement('span');
                badge.style.color = '#ff6b6b';
                badge.textContent = ' • ' + newCount + ' новые';
                title.appendChild(badge);
            }
            title.dataset.kicker = '\u0422\u043e\u0447\u043a\u0430 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
            title.dataset.subtitle = newCount > 0
                ? newCount + ' \u043d\u043e\u0432\u044b\u0445 \u0432\u043d\u0443\u0442\u0440\u0438 \u044d\u0442\u043e\u0439 \u0442\u043e\u0447\u043a\u0438'
                : '\u0421\u043f\u0438\u0441\u043e\u043a \u0430\u043d\u043a\u0435\u0442 \u043f\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0442\u043e\u0447\u043a\u0435 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
        };

        function isSidebarRecentProfile(profile) {
            if (!profile || !profile.source_date) {
                return false;
            }

            if (typeof profile._isSidebarRecent === 'boolean') {
                return profile._isSidebarRecent;
            }

            const sourceTime = getProfileSourceTime(profile);
            return Boolean(sourceTime && sourceTime >= (sidebarThresholdTime || getSidebarThresholdDate().getTime()));
        }

        function matchesSidebarSearch(profile, query) {
            const normalizedQuery = String(query || '').trim().toLowerCase();
            if (!normalizedQuery) {
                return true;
            }

            const haystack = profile && profile._searchText
                ? profile._searchText
                : getProfileSearchText(profile);

            return haystack.includes(normalizedQuery);
        }

        buildSidebarProfiles = function(profiles) {
            if (profiles.length <= 1) {
                return profiles.filter(profile => matchesSidebarSearch(profile, sidebarSearchQuery));
            }

            const recentProfiles = [];
            const oldProfiles = [];

            profiles.forEach(profile => {
                if (isSidebarRecentProfile(profile)) {
                    recentProfiles.push(profile);
                } else {
                    oldProfiles.push(profile);
                }
            });

            return recentProfiles.concat(oldProfiles).filter(profile => matchesSidebarSearch(profile, sidebarSearchQuery));
        };

        updateSidebarTitle = function() {
            const title = document.getElementById('sidebar-title');
            const totalCount = sidebarProfilesSource.length;
            const shownProfiles = sidebarVisibleProfiles.slice(0, Math.min(sidebarVisibleCount, sidebarVisibleProfiles.length));
            const newCount = shownProfiles.filter(profile => isHighlightedNew(profile)).length;
            const titleText = totalCount === 1
                ? '\u0410\u043d\u043a\u0435\u0442\u0430'
                : '\u0410\u043d\u043a\u0435\u0442\u044b (' + totalCount + ')';
            title.textContent = titleText;
            if (newCount > 0) {
                const badge = document.createElement('span');
                badge.style.color = '#ff6b6b';
                badge.textContent = ' • ' + newCount + ' новые';
                title.appendChild(badge);
            }
            title.dataset.kicker = '\u0422\u043e\u0447\u043a\u0430 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
            title.dataset.subtitle = newCount > 0
                ? newCount + ' \u043d\u043e\u0432\u044b\u0445 \u0441\u0435\u0439\u0447\u0430\u0441 \u0432 \u0441\u043f\u0438\u0441\u043a\u0435'
                : '\u0421\u043f\u0438\u0441\u043e\u043a \u0430\u043d\u043a\u0435\u0442 \u043f\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u043e\u0439 \u0442\u043e\u0447\u043a\u0435 \u043d\u0430 \u043a\u0430\u0440\u0442\u0435';
        };

        showMoreProfiles = function() {
            sidebarVisibleCount = Math.min(sidebarVisibleCount + sidebarBatchSize, sidebarVisibleProfiles.length);
            renderProfiles();
        };

        filterSidebarProfiles = function() {
            const input = document.getElementById('sidebar-search-input');
            sidebarSearchQuery = input ? input.value.trim() : '';
            sidebarVisibleCount = sidebarBatchSize;
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            updateSidebarTitle();
            renderProfiles();
        };

        toggleOldProfiles = function() {
            showOldProfiles = !showOldProfiles;

            const button = document.getElementById('toggle-old-btn');
            if (button) {
                button.textContent = showOldProfiles ? 'Свернуть список' : 'Показать старые';
                button.classList.toggle('active', showOldProfiles);
            }

            if (sidebarProfilesSource.length > 0) {
                sidebarVisibleCount = showOldProfiles ? sidebarVisibleProfiles.length : sidebarBatchSize;
                renderProfiles();
            }
        };

        renderProfiles = function() {
            const profileList = document.getElementById('profile-list');

            if (renderTimeout) {
                clearTimeout(renderTimeout);
                renderTimeout = null;
            }

            if (sidebarVisibleProfiles.length === 0) {
                currentProfiles = [];
                updateSidebarTitle();
                profileList.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">Анкеты не найдены</div>';
                updateLoadMoreButton();
                return;
            }

            currentProfiles = sidebarVisibleProfiles.slice(0, sidebarVisibleCount);
            updateSidebarTitle();
            expandedStates = {};

            let html = '';
            currentProfiles.forEach((form, index) => {
                html += createProfileHTML(form, index, 0);
            });
            profileList.innerHTML = html;
            updateLoadMoreButton();
        };

        openSidebar = function(profiles) {
            const sidebar = document.getElementById('sidebar');
            const sidebarSearchInput = document.getElementById('sidebar-search-input');

            sidebarProfilesSource = profiles.slice();
            sidebarSearchQuery = '';
            if (sidebarSearchInput) {
                sidebarSearchInput.value = '';
            }
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            sidebarVisibleCount = showOldProfiles ? sidebarVisibleProfiles.length : sidebarBatchSize;
            updateSidebarTitle();
            renderProfiles();
            sidebar.scrollTop = 0;
            sidebar.classList.add('open');
        };

        const sidebarElement = document.getElementById('sidebar');
        if (sidebarElement && !sidebarElement.dataset.infiniteReady) {
            sidebarElement.dataset.infiniteReady = '1';
            sidebarElement.addEventListener('scroll', function() {
                if (showOldProfiles) {
                    return;
                }

                const nearBottom = sidebarElement.scrollTop + sidebarElement.clientHeight >= sidebarElement.scrollHeight - 160;
                if (nearBottom && sidebarVisibleCount < sidebarVisibleProfiles.length) {
                    showMoreProfiles();
                }
            });
        }

        function setLoadingStatus(text) {
            const loading = document.getElementById('loading');
            const textNode = loading.querySelector('.loading-text') || loading.querySelector('div:last-child');
            if (textNode) {
                textNode.textContent = text;
            }
        }

async function loadFormsData() {
    setLoadingStatus('Загрузка анкет...');
    const payload = await fetchJsonWithTimeout(
        API_BASE_URL + '/api/map-data',
        { credentials: 'include', cache: 'no-store' },
        30000
    );
    if (!payload || !payload.ok || !Array.isArray(payload.profiles)) {
        throw new Error('bad_map_data_payload');
    }
    return payload.profiles;
}

        async function prepareDerivedData() {
            setLoadingStatus('Подготовка карты...');
            citiesData = {};
            cityTagsSet = new Set();
            hashtagCache = new Map();
            mappableProfiles = [];
            profilesById = new Map();
            recentThresholdTime = getRecentThresholdDate().getTime();
            sidebarThresholdTime = getSidebarThresholdDate().getTime();
            recentUndatedFormIdThreshold = null;
            const undatedThreshold = getRecentUndatedFormIdThreshold();

            for (let index = 0; index < allData.length; index++) {
                const form = allData[index];
                primeProfileRuntimeFields(form, index, undatedThreshold);
                if (form && Number.isFinite(form._formIdNumber)) {
                    profilesById.set(form._formIdNumber, form);
                }
                if (!form || form._ageNumber < 16) continue;

                if (form.settlement) {
                    const city = form.settlement.trim();
                    cityTagsSet.add(city.toLowerCase());
                    cityTagsSet.add(city.replace(/\s+/g, '').toLowerCase());
                    cityTagsSet.add(city.replace(/-/g, '').toLowerCase());
                    cityTagsSet.add(city.replace(/\s+/g, '').replace(/-/g, '').toLowerCase());
                }

                if (form._isMappable) {
                    mappableProfiles.push(form);
                    if (!citiesData[form.settlement]) {
                        citiesData[form.settlement] = [];
                    }
                    citiesData[form.settlement].push(index);
                }

                if (index > 0 && index % 150 === 0) {
                    setLoadingStatus('Подготовка карты... ' + index + ' / ' + allData.length);
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }
        }

        function deferInitialMarkerRender() {
            const render = () => {
                Promise.resolve(showAllMarkers()).catch(error => {
                    console.error('Ошибка первичной отрисовки меток:', error);
                });
            };

            if ('requestIdleCallback' in window) {
                requestIdleCallback(render, { timeout: 1200 });
                return;
            }

            requestAnimationFrame(() => {
                setTimeout(render, 0);
            });
        }

        async function initApp() {
            try {
                Promise.resolve(tryCenterMapToUserLocation()).catch(error => {
                    console.warn('IP-центрирование пропущено:', error);
                });

                allData = await loadFormsData();
                recentUndatedFormIdThreshold = null;
                document.getElementById('loading').style.display = 'none';
                await prepareDerivedData();
                updateHeroMetrics();
                waitForMapReady().then(() => {
                    renderCanvasMarkers();
                });

                document.getElementById('search-input').addEventListener('input', function() { searchCity(); });
                map.on('movestart', () => {
                    isMapInteracting = true;
                    setMapMovingVisualState(true);
                    window.clearTimeout(tileCachePurgeTimer);
                });
                map.on('render', () => {
                    if (isMapInteracting) {
                        requestCanvasMarkerRender(false);
                    }
                });
                map.on('move', () => requestCanvasMarkerRender(false));
                map.on('resize', () => requestCanvasMarkerRender(true));
                map.on('moveend', () => {
                    requestCanvasMarkerRender(true);
                    scheduleMarkerRefresh(MAP_IS_LOW_POWER ? 900 : 650);
                    scheduleRussianMapLabels(MAP_IS_LOW_POWER ? 360 : 220);
                    scheduleVectorDetailsAfterIdle(MAP_IS_LOW_POWER ? 560 : 360);
                });
                map.on('zoomend', () => {
                    scheduleMarkerRefresh();
                    scheduleRussianMapLabels(MAP_IS_LOW_POWER ? 260 : 160);
                    scheduleVectorDetailsAfterIdle(MAP_IS_LOW_POWER ? 420 : 260);
                });
                map.on('click', handleCanvasMarkerClick);

                deferInitialMarkerRender();
            } catch (error) {
                console.error('Ошибка:', error);
                const loading = document.getElementById('loading');
                loading.innerHTML = '<div style="font-size: 14px; line-height: 1.5;">Ошибка загрузки.<br>Попробуйте обновить страницу или открыть сайт в современном браузере.</div>';
            }
        }

        applyUiCopy();
        initApp();

        async function runUnifiedSearch(query) {
            const normalizedQuery = String(query || '').toLowerCase().trim();
            const resultsDiv = document.getElementById('search-results');
            const requestToken = ++searchRequestToken;

            if (normalizedQuery.length < 2) {
                resultsDiv.innerHTML = '';
                return;
            }

            const cityMatches = Object.keys(citiesData)
                .filter(city => city.toLowerCase().includes(normalizedQuery))
                .sort((a, b) => {
                    const aStarts = a.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
                    const bStarts = b.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
                    if (aStarts !== bStarts) return aStarts - bStarts;
                    return a.localeCompare(b, 'ru');
                })
                .slice(0, 8);

            let profileMatches = [];
            try {
                const payload = await fetchJsonWithTimeout(
                    API_BASE_URL + '/api/search?q=' + encodeURIComponent(normalizedQuery) + '&limit=12',
                    { credentials: 'include' },
                    12000
                );
                if (requestToken !== searchRequestToken) {
                    return;
                }
                if (payload && payload.ok && Array.isArray(payload.profiles)) {
                    profileMatches = payload.profiles;
                    profileMatches.forEach(form => {
                        if (form && Number.isFinite(Number(form.form_id))) {
                            profileDetailsCache.set(Number(form.form_id), form);
                        }
                    });
                }
            } catch (error) {
                console.warn('Поиск через API недоступен:', error);
            }

            if (profileMatches.length === 0) {
                const cacheMatches = [];
                if (typeof profileDetailsCache !== 'undefined' && profileDetailsCache.size > 0) {
                    profileDetailsCache.forEach(form => {
                        if (!form || form._ageNumber < 16) return;
                        const text = [form.name, form.settlement, form.hashtag, form.form_text]
                            .map(v => String(v || '').toLowerCase()).join(' ');
                        if (text.includes(normalizedQuery)) cacheMatches.push(form);
                    });
                }
                if (cacheMatches.length === 0 && Array.isArray(allData)) {
                    allData.forEach(form => {
                        if (!form || form._ageNumber < 16) return;
                        const text = [form.settlement, form.hashtag]
                            .map(v => String(v || '').toLowerCase()).join(' ');
                        if (text.includes(normalizedQuery)) cacheMatches.push(form);
                    });
                }
                profileMatches = cacheMatches.slice(0, 12);
            }

            if (cityMatches.length === 0 && profileMatches.length === 0) {
                resultsDiv.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
                return;
            }

            let html = '';

            if (cityMatches.length > 0) {
                html += '<div class="search-result-item" style="cursor: default; background: #262626;">';
                html += '<div class="search-result-city">Города</div>';
                html += '</div>';

                cityMatches.forEach(city => {
                    const count = (citiesData[city] || []).length;
                    html += '<div class="search-result-item" onclick="showCity(\'' + city.replace(/'/g, "\\'") + '\')">';
                    html += '<div class="search-result-city">' + escapeHtml(city) + '</div>';
                    html += '<div class="search-result-count">' + count + ' анкет</div>';
                    html += '</div>';
                });
            }

            if (profileMatches.length > 0) {
                html += '<div class="search-result-item" style="cursor: default; background: #262626;">';
                html += '<div class="search-result-city">Анкеты</div>';
                html += '</div>';

                profileMatches.forEach(form => {
                    const cleanText = stripHtml(form.form_text || '');
                    const shortText = cleanText.substring(0, 80);
                    html += '<div class="search-result-item" onclick="showProfile(' + form.form_id + ')">';
                    html += '<div class="search-result-city">' + escapeHtml(form.name) + ', ' + escapeHtml(form.settlement) + '</div>';
                    html += '<div class="search-result-count">' + escapeHtml(shortText) + (cleanText.length > 80 ? '...' : '') + '</div>';
                    html += '</div>';
                });
            }

            resultsDiv.innerHTML = html;
        }

        toggleGlobalSearch = function() {
            const input = document.getElementById('search-input');
            if (input) {
                input.focus();
                input.select();
            }
        };

        searchCity = function() {
            const input = document.getElementById('search-input');
            runUnifiedSearch(input ? input.value : '');
        };

        globalSearch = function() {
            const rightInput = document.getElementById('search-input');
            runUnifiedSearch(rightInput ? rightInput.value : '');
        };

        showCity = function(city) {
            const profiles = (citiesData[city] || []).map(index => allData[index]);
            if (profiles.length === 0) {
                return;
            }

            openSidebar(profiles);

            const firstProfile = profiles[0];
            map.setView([firstProfile.lat, firstProfile.lon], 10);

            const rightInput = document.getElementById('search-input');
            const resultsDiv = document.getElementById('search-results');
            if (rightInput) rightInput.value = '';
            if (resultsDiv) resultsDiv.innerHTML = '';
        };

        showProfile = function(formId) {
            const numericFormId = Number(formId);
            const form = profilesById.get(numericFormId) || allData.find(profile => profile.form_id === formId);
            if (!form || !form.lat || !form.lon) {
                return;
            }

            map.setView([form.lat, form.lon], 12);
            openSidebar([form]);

            const rightInput = document.getElementById('search-input');
            const resultsDiv = document.getElementById('search-results');
            if (rightInput) rightInput.value = '';
            if (resultsDiv) resultsDiv.innerHTML = '';
        };

        openSidebar = async function(profiles) {
            const sidebar = document.getElementById('sidebar');
            const sidebarSearchInput = document.getElementById('sidebar-search-input');
            const sourceProfiles = Array.isArray(profiles) ? profiles.slice() : [];

            sidebarProfilesSource = sourceProfiles;
            sidebarSearchQuery = '';
            if (sidebarSearchInput) {
                sidebarSearchInput.value = '';
            }
            sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
            sortSidebarProfiles();
            sidebarVisibleCount = showOldProfiles ? sidebarVisibleProfiles.length : sidebarBatchSize;
            updateSidebarTitle();
            setSidebarLoading('Загружаем анкеты...');
            sidebar.scrollTop = 0;
            sidebar.classList.add('open');

            const hydrationToken = ++sidebarHydrationToken;

            try {
                const hydratedProfiles = sourceProfiles.every(isHydratedProfile)
                    ? sourceProfiles
                    : await fetchProfilesBatch(sourceProfiles.map(profile => profile && profile.form_id));

                if (hydrationToken !== sidebarHydrationToken) {
                    return;
                }

                sidebarProfilesSource = hydratedProfiles;
                sidebarVisibleProfiles = buildSidebarProfiles(sidebarProfilesSource);
                sortSidebarProfiles();
                sidebarVisibleCount = showOldProfiles ? sidebarVisibleProfiles.length : sidebarBatchSize;
                updateSidebarTitle();
                renderProfiles();
            } catch (error) {
                if (hydrationToken !== sidebarHydrationToken) {
                    return;
                }
                console.error('Ошибка загрузки анкет через API:', error);
                setSidebarLoading('Не удалось загрузить анкеты');
            }
        };

        function getDistanceMeters(lat1, lon1, lat2, lon2) {
            const toRad = value => value * Math.PI / 180;
            const earthRadius = 6371000;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return earthRadius * c;
        }

        function resolveCityFromNeighbors(lat, lon) {
            const RADIUS = 50000;
            const cityCounts = {};
            const source = typeof allData !== 'undefined' && Array.isArray(allData) ? allData : [];
            for (const p of source) {
                if (!p || !p.settlement || /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(p.settlement)) continue;
                const pl = Number(p._mapLat) || Number(p.lat);
                const pn = Number(p._mapLon) || Number(p.lon);
                if (!Number.isFinite(pl) || !Number.isFinite(pn)) continue;
                if (Math.abs(pl - lat) > 1 || Math.abs(pn - lon) > 1) continue;
                if (getDistanceMeters(lat, lon, pl, pn) <= RADIUS) {
                    const c = p.settlement.trim().toLowerCase();
                    cityCounts[c] = (cityCounts[c] || 0) + 1;
                }
            }
            let best = '';
            let bestCount = 0;
            for (const [city, count] of Object.entries(cityCounts)) {
                if (count > bestCount) { best = city; bestCount = count; }
            }
            return best ? best.charAt(0).toUpperCase() + best.slice(1) : '';
        }

        function getPointGroupingRadiusMeters() {
            const zoom = map && typeof map.getZoom === 'function' ? map.getZoom() : 0;
            return zoom >= 13 ? 5 : 500;
        }

        function getProfilesAtSamePoint(form) {
            const lat = Number.isFinite(form && form._mapLat) ? form._mapLat : Number(form && form.lat);
            const lon = Number.isFinite(form && form._mapLon) ? form._mapLon : Number(form && form.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                return [];
            }

            const radiusMeters = getPointGroupingRadiusMeters();
            const latDelta = radiusMeters / 111320;
            const lonDelta = radiusMeters / Math.max(25000, 111320 * Math.cos(lat * Math.PI / 180));
            const sourceProfiles = mappableProfiles.length > 0 ? mappableProfiles : allData;

            return sourceProfiles.filter(candidate => {
                if (!candidate) {
                    return false;
                }

                const candidateLat = Number.isFinite(candidate._mapLat) ? candidate._mapLat : Number(candidate.lat);
                const candidateLon = Number.isFinite(candidate._mapLon) ? candidate._mapLon : Number(candidate.lon);
                return Number.isFinite(candidateLat)
                    && Number.isFinite(candidateLon)
                    && Math.abs(candidateLat - lat) <= latDelta
                    && Math.abs(candidateLon - lon) <= lonDelta
                    && getDistanceMeters(candidateLat, candidateLon, lat, lon) <= radiusMeters;
            });
        }

        function showToast(text) {
            const toast = document.getElementById('site-toast');
            if (!toast) {
                return;
            }
            toast.textContent = text;
            toast.classList.add('visible');
            if (toastTimer) {
                clearTimeout(toastTimer);
            }
            toastTimer = setTimeout(() => {

                toast.classList.remove('visible');
            }, 2600);
        }

        function isRussiaVisitor() {
            const code = String(visitorCountryCode || '').toUpperCase();
            return code === 'RU' || code === 'RUSSIA' || code === 'РОССИЯ';
        }

        async function copyBotTag() {
            try {
                await copyTextToClipboard(BOT_TAG);
                showToast('Тег бота скопирован');
                return true;
            } catch (error) {
                showToast('Не удалось скопировать тег автоматически');
                return false;
            }
        }

        async function copyTextToClipboard(text) {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                await navigator.clipboard.writeText(text);
                return;
            }

            const input = document.createElement('input');
            input.value = text;
            input.setAttribute('readonly', 'readonly');
            input.style.position = 'fixed';
            input.style.left = '-9999px';
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }

        async function copyFurryBazaTelegramLink(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            try {
                await copyTextToClipboard('https://t.me/furbaza');
                showToast('Telegram может не открываться. Ссылка скопирована, вставьте её в Telegram');
            } catch (error) {
                showToast('Скопируйте ссылку вручную: https://t.me/furbaza');
            }

            return false;
        }

        async function handleTelegramWriteClick(event, link) {
            if (event) {
                event.stopPropagation();
            }

            const href = link && link.getAttribute ? link.getAttribute('href') || '' : '';
            if (/^https?:\/\/(www\.)?vk\.com\//i.test(href)) {
                return true;
            }

            if (event) {
                event.preventDefault();
            }

            const tag = link && link.dataset ? String(link.dataset.telegramTag || '').trim() : '';
            const text = tag || href;

            if (!text) return false;

            try {
                await copyTextToClipboard(text);
                showToast('Telegram в России не работает. Ссылка скопирована');
            } catch (error) {
                showToast('Скопируйте вручную: ' + text);
            }

            return false;
        }

        function closeCopyBotPanel() {
            const panel = document.getElementById('copy-bot-panel');
            if (panel) {
                panel.classList.remove('open');
            }
        }

        async function openCopyBotPanel() {
            await copyBotTag();
            const panel = document.getElementById('copy-bot-panel');
            if (panel) {
                panel.classList.add('open');
            }
        }

        let selectedGender = '';
        let selectedPhotoData = '';

        let pickedLat = null;
        let pickedLon = null;
        let pickingInProgress = false;

        function toggleAddProfilePanel() {
            const panel = document.getElementById('add-profile-panel');
            if (!panel) return;
            panel.classList.toggle('open');
        }

        function showAddPlatformSelector() {
            const panel = document.getElementById('platform-selector');
            if (!panel) return;
            panel.classList.add('open');
        }

        function closePlatformSelector() {
            const panel = document.getElementById('platform-selector');
            if (panel) panel.classList.remove('open');
        }

        function selectPlatform(platform) {
            closePlatformSelector();
            if (platform === 'vk') {
                toggleAddProfilePanel();
            } else if (platform === 'telegram') {
                openCopyBotPanel();
            }
        }

        function selectGender(btn) {
            document.querySelectorAll('.add-profile-gender-btn[data-gender]').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            selectedGender = btn.getAttribute('data-gender');
        }

        function removePickMarker() {
            try {
                if (map.getLayer('profile-pick-marker-layer')) map.removeLayer('profile-pick-marker-layer');
                if (map.getSource('profile-pick-source')) map.removeSource('profile-pick-source');
            } catch (e) {}
        }

        function startMapPick() {
            if (pickingInProgress) return;
            pickingInProgress = true;
            toggleAddProfilePanel();
            map.getCanvas().style.cursor = 'crosshair';
            showToast('Кликни на карте, чтобы указать место');
            map.once('click', onMapPick);
        }

        function onMapPick(e) {
            pickingInProgress = false;
            map.getCanvas().style.cursor = '';
            pickedLat = e.lngLat.lat;
            pickedLon = e.lngLat.lng;
            removePickMarker();
            try {
                map.addSource('profile-pick-source', {
                    type: 'geojson',
                    data: { type: 'Point', coordinates: [pickedLon, pickedLat] }
                });
                map.addLayer({
                    id: 'profile-pick-marker-layer',
                    type: 'circle',
                    source: 'profile-pick-source',
                    paint: {
                        'circle-radius': 12,
                        'circle-color': '#f80',
                        'circle-opacity': 1,
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#fff'
                    }
                });
            } catch (e) {}
            var locEl = document.getElementById('map-confirm-location');
            if (locEl) locEl.textContent = 'Загрузка...';
            var panel = document.getElementById('add-profile-map-confirm');
            if (panel) panel.classList.add('open');
            reverseGeocodeForPick(pickedLat, pickedLon);
        }

        async function reverseGeocodeForPick(lat, lon) {
            try {
                var res = await fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json&accept-language=ru', {
                    headers: { 'User-Agent': 'FurryMap/1.0' }
                });
                var data = await res.json();
                var addr = data && data.address;
                var city = addr && (addr.city || addr.town || addr.village || addr.municipality || addr.county);
                var locEl = document.getElementById('map-confirm-location');
                if (locEl) locEl.textContent = city || lat.toFixed(4) + ', ' + lon.toFixed(4);
            } catch (e) {
                var locEl2 = document.getElementById('map-confirm-location');
                if (locEl2) locEl2.textContent = lat.toFixed(4) + ', ' + lon.toFixed(4);
            }
        }

        function confirmMapPick() {
            document.getElementById('add-profile-map-confirm').classList.remove('open');
            var statusEl = document.getElementById('pf-location-status');
            var cityEl = document.getElementById('pf-city');
            var latEl = document.getElementById('pf-lat');
            var lonEl = document.getElementById('pf-lon');

            var locEl = document.getElementById('map-confirm-location');
            if (locEl && cityEl) cityEl.value = locEl.textContent;
            if (latEl) latEl.value = pickedLat;
            if (lonEl) lonEl.value = pickedLon;
            if (statusEl && locEl) {
                statusEl.textContent = locEl.textContent;
                statusEl.className = 'pf-location-status pf-location-set';
            }
            toggleAddProfilePanel();
        }

        function moveMapPick() {
            document.getElementById('add-profile-map-confirm').classList.remove('open');
            removePickMarker();
            pickingInProgress = true;
            map.getCanvas().style.cursor = 'crosshair';
            showToast('Кликни на карте, чтобы переместить метку');
            map.once('click', onMapPick);
        }

        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'pf-photo-input') {
                var file = e.target.files[0];
                if (!file) return;
                var nameEl = document.getElementById('pf-photo-name');
                if (nameEl) nameEl.textContent = file.name;
                var reader = new FileReader();
                reader.onload = function(ev) {
                    selectedPhotoData = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        async function submitAddProfileForm() {
            var statusEl = document.getElementById('pf-status');
            if (!statusEl) return;
            statusEl.textContent = 'Отправляем...';

            var nick = (document.getElementById('pf-nick').value || '').trim();
            var age = parseInt(document.getElementById('pf-age').value, 10);
            var city = (document.getElementById('pf-city').value || '').trim();
            var telegram = (document.getElementById('pf-telegram').value || '').trim();
            var about = (document.getElementById('pf-about').value || '').trim();

            if (!nick) { statusEl.textContent = 'Укажи имя'; return; }
            if (!age || age < 16 || age > 99) { statusEl.textContent = 'Проверь возраст'; return; }
            if (!telegram) { statusEl.textContent = 'Укажи ссылку VK'; return; }
            if (!/^https?:\/\/(www\.)?vk\.com\//i.test(telegram)) { statusEl.textContent = 'Напиши ссылку'; return; }
            if (!selectedGender) { statusEl.textContent = 'Укажи пол'; return; }
            if (about.length < 100) { statusEl.textContent = 'Слишком короткое описание (мин. 100 символов)'; return; }
            if (!selectedPhotoData) { statusEl.textContent = 'Добавь фото'; return; }
            if (pickedLat === null || pickedLon === null) { statusEl.textContent = 'Укажи место на карте'; return; }

            try {
                var response = await fetch(API_BASE_URL + '/api/forms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nick: nick,
                        age: age,
                        city: city || 'Точка на карте',
                        telegram: telegram,
                        tags: selectedGender,
                        about: about,
                        lat: pickedLat,
                        lon: pickedLon,
                        photoData: selectedPhotoData || ''
                    })
                });
                var data = await response.json();
                if (data.ok) {
                    toggleAddProfilePanel();
                    showToast('Анкета отправлена на модерацию!');
                    document.getElementById('pf-nick').value = '';
                    document.getElementById('pf-age').value = '';
                    document.getElementById('pf-city').value = '';
                    document.getElementById('pf-telegram').value = '';
                    document.getElementById('pf-about').value = '';
                    document.getElementById('pf-lat').value = '';
                    document.getElementById('pf-lon').value = '';
                    var pn = document.getElementById('pf-photo-name');
                    if (pn) pn.textContent = '';
                    var ls = document.getElementById('pf-location-status');
                    if (ls) { ls.textContent = 'Не указано'; ls.className = 'pf-location-status'; }
                    removePickMarker();
                    pickedLat = null;
                    pickedLon = null;
                    selectedGender = '';
                    selectedPhotoData = '';
                    document.querySelectorAll('.add-profile-gender-btn[data-gender]').forEach(function(b) {
                        b.classList.remove('active');
                    });
                } else {
                    statusEl.textContent = data.error || 'Ошибка создания';
                }
            } catch (e) {
                statusEl.textContent = 'Ошибка сервера. Попробуй позже.';
            }
        }

        function updateLikeCount(formId, likes) {
            const nextLikes = Number.isFinite(Number(likes)) ? Number(likes) : 0;

            [allData, currentProfiles, sidebarProfilesSource, sidebarVisibleProfiles].forEach(collection => {
                if (!Array.isArray(collection)) {
                    return;
                }
                collection.forEach(form => {
                    if (form && Number(form.form_id) === Number(formId)) {
                        form.likes = nextLikes;
                    }
                });
            });

            document.querySelectorAll('[data-like-form-id="' + formId + '"]').forEach(node => {
                node.textContent = '❤️ ' + nextLikes;
            });
        }

        likeProfile = async function(formId) {
            if (!formId || pendingLikes.has(formId)) {
                return;
            }

            pendingLikes.add(formId);
            try {
                const response = await fetch(
                    API_BASE_URL + '/api/like?form_id=' + encodeURIComponent(formId),
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                );
                if (response.status === 429) {
                    const limited = await response.json().catch(() => null);
                    const retryAfter = limited && limited.retry_after ? limited.retry_after : 60;
                    throw new Error('rate_limited:' + retryAfter);
                }
                if (!response.ok) {
                    throw new Error('bad_status_' + response.status);
                }

                const data = await response.json();
                if (!data || !data.ok) {
                    throw new Error('bad_payload');
                }

                updateLikeCount(formId, data.likes);
                if (data.duplicate) {
                    showToast('Вы уже ставили лайк');
                } else if (data.ignored && data.reason === 'cooldown') {
                    showToast('Лайки временно ограничены. Попробуйте позже');
                } else {
                    showToast('Лайк поставлен');
                }
            } catch (error) {
                console.error('Ошибка лайка через API:', error);
                if (String(error && error.message || '').startsWith('rate_limited:')) {
                    showToast('Слишком много запросов. Подождите немного');
                } else {
                    showToast('Не удалось поставить лайк');
                }
            } finally {
                pendingLikes.delete(formId);
            }
        };
        [
            ['toggleTheme', typeof toggleTheme !== 'undefined' ? toggleTheme : null],
            ['setLookingFor', typeof setLookingFor !== 'undefined' ? setLookingFor : null],
            ['showMoreProfiles', typeof showMoreProfiles !== 'undefined' ? showMoreProfiles : null],
            ['sortProfiles', typeof sortProfiles !== 'undefined' ? sortProfiles : null],
            ['closeSidebar', typeof closeSidebar !== 'undefined' ? closeSidebar : null],
            ['showCity', typeof showCity !== 'undefined' ? showCity : null],
            ['showProfile', typeof showProfile !== 'undefined' ? showProfile : null],
            ['toggleProfile', typeof toggleProfile !== 'undefined' ? toggleProfile : null],
            ['handleTelegramWriteClick', typeof handleTelegramWriteClick !== 'undefined' ? handleTelegramWriteClick : null],
            ['copyFurryBazaTelegramLink', typeof copyFurryBazaTelegramLink !== 'undefined' ? copyFurryBazaTelegramLink : null],
            ['copyBotTag', typeof copyBotTag !== 'undefined' ? copyBotTag : null],
            ['closeCopyBotPanel', typeof closeCopyBotPanel !== 'undefined' ? closeCopyBotPanel : null],
            ['likeProfile', typeof likeProfile !== 'undefined' ? likeProfile : null],
            ['toggleAddProfilePanel', typeof toggleAddProfilePanel !== 'undefined' ? toggleAddProfilePanel : null],
            ['showAddPlatformSelector', typeof showAddPlatformSelector !== 'undefined' ? showAddPlatformSelector : null],
            ['closePlatformSelector', typeof closePlatformSelector !== 'undefined' ? closePlatformSelector : null],
            ['selectPlatform', typeof selectPlatform !== 'undefined' ? selectPlatform : null],
            ['selectGender', typeof selectGender !== 'undefined' ? selectGender : null],
            ['submitAddProfileForm', typeof submitAddProfileForm !== 'undefined' ? submitAddProfileForm : null],
            ['startMapPick', typeof startMapPick !== 'undefined' ? startMapPick : null],
            ['confirmMapPick', typeof confirmMapPick !== 'undefined' ? confirmMapPick : null],
            ['moveMapPick', typeof moveMapPick !== 'undefined' ? moveMapPick : null]
        ].forEach(([name, handler]) => {
            if (handler) {
                window[name] = handler;
            }
        });
        };
        if (window.__maplibreReady) {
            window.__startFurryApp();
        }

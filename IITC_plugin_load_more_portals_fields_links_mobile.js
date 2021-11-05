// ==UserScript==
// @id             iitc-plugin-load-more-portals-fields-links-mobile@q
// @name           IITC plugin: Load more portals, fields, links
// @category       Tweaks
// @version        1.0.0.20211105
// @updateURL      https://raw.githubusercontent.com/q82/q_iitc_plugins/main/IITC_plugin_load_more_portals_fields_links_mobile.js
// @downloadURL    https://raw.githubusercontent.com/q82/q_iitc_plugins/main/IITC_plugin_load_more_portals_fields_links_mobile.js
// @description    Force load more portals, fields, links.
// @include        *://*.ingress.com/mission/*
// @include        *://intel.ingress.com/*
// @match          *://*.ingress.com/mission/*
// @match          *://intel.ingress.com/*
// @grant          none
// ==/UserScript==

/*
********* What's New?
* 1.0.0 : Initial relase.
*/

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function () {
    };

    // PLUGIN START ////////////////////////////////////////////////////////
    window.plugin.loadMorePFL = function () {
    };

    let ZOOM_DEFAULT = 0,
        ZOOM_ALL_LINKS = 1,
        ZOOM_ALL_PORTALS = 2,
        ZOOM_MAX_MODE = ZOOM_ALL_PORTALS,
        mode_text = ["Default", "All links/fields", "All portals"],
        standard_zoom
    ;

    window.plugin.loadMorePFL.mode = ZOOM_DEFAULT;

    window.plugin.loadMorePFL.getDataZoomForMapZoom = function (zoom) {
        let mode = window.plugin.loadMorePFL.mode,
            map_zoom = zoom
        ;

        if (mode === ZOOM_DEFAULT) {
            return standard_zoom(zoom);
        }

        while (zoom < 21 && (zoom - map_zoom < 5)) {
            let params = window.getMapZoomTileParameters(zoom);

            if ((mode === ZOOM_ALL_LINKS && params.minLinkLength === 0) || (mode === ZOOM_ALL_PORTALS && params.hasPortals)) {
                break;
            }

            zoom = zoom + 1;
        }

        return zoom;
    };

    window.plugin.loadMorePFL.setmode = function (mode) {
        let old_zoom = window.getDataZoomForMapZoom(map.getZoom());

        window.plugin.loadMorePFL.mode = mode;
        $('#loadMorePFL-status').html(mode_text[mode]);

        if (old_zoom < window.getDataZoomForMapZoom(map.getZoom())) {
            window.mapDataRequest.start();
        }
    };

    window.plugin.loadMorePFL.toggle = function () {
        let new_mode = (window.plugin.loadMorePFL.mode + 1) % (ZOOM_MAX_MODE + 1);

        window.plugin.loadMorePFL.setmode(new_mode);
    };

    window.plugin.loadMorePFL.setup = function () {
        $('#updatestatus').prepend('<div id="loadMorePFL" style="padding-bottom: 8px;"><strong>Get More Info:</strong> <span id="loadMorePFL-status"></span></div>');
        $('#loadMorePFL').click(window.plugin.loadMorePFL.toggle);

        standard_zoom = window.getDataZoomForMapZoom;
        window.getDataZoomForMapZoom = window.plugin.loadMorePFL.getDataZoomForMapZoom;
        window.plugin.loadMorePFL.setmode(ZOOM_DEFAULT);
    };

    let setup = window.plugin.loadMorePFL.setup;
    // PLUGIN END //////////////////////////////////////////////////////////

    setup.info = plugin_info; //add the script info data to the function as a property

    if (!window.bootPlugins) {
        window.bootPlugins = [];
    }
    window.bootPlugins.push(setup);

    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function') {
        setup();
    }
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

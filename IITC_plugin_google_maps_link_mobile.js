// ==UserScript==
// @id             iitc-plugin-google-maps-link-mobile@q
// @name           IITC plugin: Google Maps Link
// @category       Portal Info
// @version        1.0.0.20210916
// @updateURL      https://github.com/q82/q_iitc_plugins/raw/master/IITC_plugin_google_maps_link_mobile.js
// @downloadURL    https://github.com/q82/q_iitc_plugins/raw/master/IITC_plugin_google_maps_link_mobile.js
// @description    Force show link to google maps in portal info for mobile.
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
    window.plugin.googleMapsLink = {
        onPortalSelected: function (event) {
            /*console.log('jedynka');
            if (event.selectedPortalGuid === event.unselectedPortalGuid) {
                return;
            }*/
            if (window.selectedPortal === null) {
                return;
            }
            let portal = window.portals[window.selectedPortal];
            if (!portal) {
                return;
            }

            let getLatLng = portal.getLatLng(),
                encodedName = 'undefined',
                googleMapsUrl
            ;

            if (portal.options.data.title !== undefined) {
                encodedName = encodeURIComponent(portal.options.data.title);
            }

            if (getLatLng && encodedName) {
                googleMapsUrl = 'https://maps.google.com/maps?ll=' + getLatLng.lat + ',' + getLatLng.lng + '&q=' + getLatLng.lat + ',' + getLatLng.lng + '%20(' + encodedName + ')';
            }

            setTimeout(function () {
                $('.linkdetails').append('<aside><a target="_blank" rel="noopener noreferrer" tabindex="0" href="' + googleMapsUrl + '" >Google Maps Link</a></aside>');
            }, 0);
        }
    };

    var setup = function () {
        window.addHook('portalSelected', window.plugin.googleMapsLink.onPortalSelected.bind(this));
    };
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

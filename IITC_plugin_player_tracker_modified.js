// ==UserScript==
// @id             iitc-plugin-player-tracker-modified@q
// @name           IITC plugin: Player tracker modified
// @category       Layer
// @version        1.0.0.20211205
// @updateURL      https://raw.githubusercontent.com/q82/q_iitc_plugins/main/IITC_plugin_player_tracker_modified.js
// @downloadURL    https://raw.githubusercontent.com/q82/q_iitc_plugins/main/IITC_plugin_player_tracker_modified.js
// @description    Player tracker modified, with labels or more information
// @include        *://intel.ingress.com/*
// @match          *://intel.ingress.com/*
// @grant          none
// @require        http://leaflet.github.io/Leaflet.label/leaflet.label.js
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
    window.PLAYER_TRACKER_MAX_TIME = 24*60*60*1000; // in milliseconds
    window.PLAYER_TRACKER_MIN_OPACITY = 0.5;
    window.PLAYER_TRACKER_MIN_ZOOM = 7;
    window.PLAYER_TRACKER_LINE_COLOUR = '#000';//'#FF00FD';

    window.plugin.playerTrackerMod = {
        labelLayers: {},
        labelLayerGroup: null,

        initalize: function () {
            if (!window.plugin.playerTracker) {
                dialog({
                    title: 'Player tracker modified',
                    html: 'The "<a href="https://iitc.app/download_desktop.html#player-activity-tracker_bqy_breunigs_release" target="_blank"><b>Player activity tracker</b></a>" plugin is required.</span>',
                });
            }

            addHook('publicChatDataAvailable', window.plugin.playerTrackerMod.setupHook);

            $('<style>')
                .prop('type', 'text/css')
                .html(
                    '.ptm-player-name { color: #ffffff; text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000, 0 0 5px #000; text-align: center; width: 126px; line-height: 1.1em; }' +
                    '.ptm-player-name .f11 { font-size: 11px; }' +
                    '.ptm-player-name .f10 { font-size: 10px; }' +
                    ''
                )
                .appendTo('head')
            ;

            window.plugin.playerTrackerMod.labelLayerGroup = new L.LayerGroup();
            window.addLayerGroup('Player Tracker Names', window.plugin.playerTrackerMod.labelLayerGroup, true);

            window.plugin.playerTrackerMod.clearAllLabels();
        },

        removeLabel: function (guid) {
            let previousLayer = window.plugin.playerTrackerMod.labelLayers[guid];

            if (previousLayer) {
                window.plugin.playerTrackerMod.labelLayerGroup.removeLayer(previousLayer);
                delete window.plugin.playerTrackerMod.labelLayers[guid];
            }
        },

        clearAllLabels: function () {
            for (let guid in window.plugin.playerTrackerMod.labelLayers) {
                window.plugin.playerTrackerMod.removeLabel(guid);
            }
        },

        setupHook: function () {
            window.plugin.playerTrackerMod.clearAllLabels();

            window.plugin.playerTracker.drawnTracesRes.eachLayer(function(layer) {
                if (layer && layer.options.desc && layer.options.referenceToPortal && layer._latlng) {
                    let guid = layer.options.referenceToPortal,
                        playerData = layer.options.title.split(',');
                    ;

                    let label = L.marker(layer._latlng,
                        {
                            icon: L.divIcon({
                                className: 'ptm-player-name',
                                iconAnchor: [63,66],
                                iconSize: [126,30],
                                html: '<div class="f11">'+playerData[0].trim()+'</div><div class="f10">'+playerData[1].trim()+'</div>'
                            }),
                            guid: guid
                        }
                    );
                    window.plugin.playerTrackerMod.labelLayers[guid] = label;
                    label.addTo(window.plugin.playerTrackerMod.labelLayerGroup);
                }
            });

            window.plugin.playerTracker.drawnTracesEnl.eachLayer(function(layer) {
                if (layer && layer.options.desc && layer.options.referenceToPortal && layer._latlng) {
                    let guid = layer.options.referenceToPortal,
                        playerData = layer.options.title.split(',');
                    ;

                    let label = L.marker(layer._latlng,
                        {
                            icon: L.divIcon({
                                className: 'ptm-player-name',
                                iconAnchor: [63,66],
                                iconSize: [126,30],
                                html: '<div class="f11">'+playerData[0].trim()+'</div><div class="f10">'+playerData[1].trim()+'</div>'
                            }),
                            guid: guid
                        }
                    );
                    window.plugin.playerTrackerMod.labelLayers[guid] = label;
                    label.addTo(window.plugin.playerTrackerMod.labelLayerGroup);
                }
            });
        }
    };

    var setup = function () {
        window.plugin.playerTrackerMod.initalize();
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
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);

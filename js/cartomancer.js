$(document).ready(function() {
    /*$("#map").css({
        height: $(document).innerHeight()
    });*/
    configInit();
    var cartomancer = {promise: {summaryTable: []}};
    var map = new Map();
    var mapData = new Model();
    var modelQuery;
    var loadScreen = new LoadScreen();
    loadScreen.showLoadingAnim(true);
    var locationHovered = "Nepal";
    var persistentLayerIDs = {};
    var featureStyles = new FeatureStyles();

    var schoolPointsReady = false; //TODO: this is a temporary hack;

    var hoverSettings = new HoverSettings();
    var clickSettings = new ClickSettings();


    cartomancerGlobals = {mouseWheel: false, map: map, mapData: mapData, loadScreen: loadScreen, persistentLayerIDs: persistentLayerIDs};

    var modelQueryDeferred = $.Deferred();

    map.init();
    //setting map pan limit
    map.getMap().setMaxBounds(map.getMap().getBounds());

//    map.getMap().on("movestart", function(){
//
//    });

    map.getMap().on("move", function() {
        //alert("move triggered!!");
        /**temoporary code block**/

        if (this.getZoom() < 6) {
            $("#infoPanel").hide(300, function() {
                $(this).addClass("hidden");

            });
        } else if (this.getZoom() >= 6 && this.getZoom() <= 12) {


            var country = "";

            try {
                //var cPip;
                //if(cartomancerGlobals.mouseWheel)
                //var cPip = leafletPip.pointInLayer(this.getMouseCoords(), this._layers[persistentLayerIDs.countries], true);
                //else
                var cPip = leafletPip.pointInLayer(this.getCenter(), this._layers[persistentLayerIDs.countries], true);
                country = cPip[0].feature.properties.country;
                $("#infoPanel").show(200, function() {
                    $(this).removeClass("hidden");

                });
            } catch (err) {
                if (!country) {
                    $("#infoPanel").hide(300, function() {
                        $(this).addClass("hidden");
                    });
                    //country="none";
                }
            }

            $("#infoPanel").find("a.title").remove();

            $("#infoPanel").children("h3").excecuteOnEach(function() {
                if ($(this).text() === country.replace(/_/g," "))
                    return;
                var element = this;
                setTimeout(function() {
                    $(element).text(country.replace(/_/g," "));

                    $(element).trigger("mapLocationChange", {
                        function: "getSummary",
                        type: "country",
                        country: country,
                        city: "all"
                        , requestType: "GET"
                    });
                }, 0);
            });
            var notErasing = $.Deferred();
            notErasing.resolve();
            this.fire("zoomendTrigger", notErasing.promise());

        } else if (this.getZoom() > 12) {

            var city = "";
            var country = "";

            try {
                //var cPip;
                //if(cartomancerGlobals.mouseWheel)
                //var cPip = leafletPip.pointInLayer(this.getMouseCoords(), this._layers[persistentLayerIDs.countries], true);
                //else
                for (var citiesLayerID in persistentLayerIDs.cities) {
                    var cPip = leafletPip.pointInLayer(this.getCenter(), this._layers[persistentLayerIDs.cities[citiesLayerID]], false);
                    if (cPip.length) {
                        city = cPip[0].feature.properties.city;
                        country = cPip[0].feature.properties.country;
                        break;
                    }
                }

                /**temporary solution**/
                var cPip = leafletPip.pointInLayer(this.getCenter(), this._layers[persistentLayerIDs.countries], true);
                country = cPip[0].feature.properties.country;
                /****/


                $("#infoPanel").show(200, function() {
                    $(this).removeClass("hidden");
                });
            } catch (err) {
                if (!country) {
                    $("#infoPanel").hide(300, function() {
                        $(this).addClass("hidden");
                    });
                    //country="none";
                }
            }

            if (!$("#infoPanel").find("a.title").length)
                $("<a class='title'></a>").insertAfter($("#infoPanel").find("h3"));

            $("#infoPanel").children("h3").excecuteOnEach(function() {
                if ($(this).text() === city)
                    return;
                var element = this;

                setTimeout(function() {
                    $(element).text(city);
                    $(element).parent().find("a.title").text(country.replace(/_/g, " "));
                    if (city) {

                        $(element).trigger("mapLocationChange", {
                            function: "getSummary",
                            type: "city",
                            country: country,
                            city: city
                            , requestType: "GET"
                        });
                    } else {
                        $(element).trigger("mapLocationChange", {
                            function: "getSummary",
                            type: "country",
                            country: country,
                            city: "all"
                            , requestType: "GET"
                        });
                    }
                }, 0);
            });


            var notErasing = $.Deferred();
            notErasing.resolve();
            this.fire("zoomendTrigger", notErasing.promise());

        }
        /**end of temporary code block**/
        cartomancerGlobals.mapBounds = this.getBounds();
    });

    map.getMap().on("viewreset", function() {
        /**TODO: experimental feature: needs feedback**/
        /*if (map.getPreviousZoom() <= 12 && this.getZoom() > 12) {
         this.zoomIn(14 - this.getZoom());
         map.initPreviousZoomVal();
         } else if (map.getPreviousZoom() >= 14 && this.getZoom() < 14) {
         this.zoomOut(this.getZoom() - 12);
         map.initPreviousZoomVal();
         }*/
        /****/

        this.fire("zoomend");
    });


    map.getMap().on("zoomend", function() {
        var context_this = this;

        var eraseDeferred = $.Deferred();

        setTimeout(function() {
            map.getMap().eachLayer(function(layer) {
                /*console.log("context_this");
                 console.log(context_this === map.getMap());
                 console.log(layer._leaflet_id);
                 console.log(layer._leaflet_id+1);
                 console.log(map.getMap()._layers[persistentLayerIDs.countries]._layers);
                 console.log(inJSONKeys(layer._leaflet_id+"", map.getMap()._layers[persistentLayerIDs.countries]._layers));
                 */

                /*if (layer !== map.getOSMTileLayer() && layer !== context_this._layers[persistentLayerIDs.countries] && !inJSONKeys(layer._leaflet_id + "", context_this._layers[persistentLayerIDs.countries]._layers))
                 context_this.removeLayer(layer);
                 else if (inJSONKeys(layer._leaflet_id + "", context_this._layers[persistentLayerIDs.countries]._layers)) {
                 if (context_this.getZoom() >= 6) {
                 layer.setStyle({
                 fillOpacity: 0
                 });
                 //                        console.log("logging path");
                 //                        console.log($(layer["_path"]));
                 layer.unbindPopup();

                 } else {
                 layer.setStyle({
                 fillOpacity: 0.35
                 });
                 }

                 }*/

                /*if (context_this.getZoom() < 6) {

                    //if(persistentLayerIDs.testPointIDS) delete persistentLayerIDs.testPointIDS;
                    if (layer !== map.getOSMTileLayer() && layer !== context_this._layers[persistentLayerIDs.countries] && !inJSONKeys(layer._leaflet_id + "", context_this._layers[persistentLayerIDs.countries]._layers)) {
                        context_this.removeLayer(layer);

                    } else if (inJSONKeys(layer._leaflet_id + "", context_this._layers[persistentLayerIDs.countries]._layers)) {

                        layer.setStyle({
                            fillOpacity: 0.35
                        });
//                        console.log("logging path");
//                        console.log($(layer["_path"]));


                    }
                } else if (context_this.getZoom() >= 6) {
                    if (inJSONKeys(layer._leaflet_id + "", context_this._layers[persistentLayerIDs.countries]._layers)) {
                        layer.setStyle({
                            fillOpacity: 0
                        });
                        layer.unbindPopup();
                    }


                    if (context_this.getZoom() <= 12) {
                        console.log("layer id: "+layer._leaflet_id);
                        console.log(Boolean($.inArray(layer._leaflet_id, persistentLayerIDs.testPointLayerIDs) + 1));
                        if (Boolean($.inArray(layer._leaflet_id, persistentLayerIDs.testPointLayerIDs) + 1) || Boolean($.inArray(layer._leaflet_id, persistentLayerIDs.schoolLayerIDs) + 1)) {
                            console.log(layer._leaflet_id);
                            console.log("removingLayer");
                            context_this.removeLayer(layer);
                        }

                        if ($(".leaflet-marker-icon.city").hasClass("hidden")) {
                            $(".leaflet-marker-icon.city").removeClass("hidden");
                            $(".leaflet-marker-icon.testPoint").addClass("hidden");
                            $(".leaflet-marker-icon.school").addClass("hidden");
                        }
                    } else {
                        if (!$(".leaflet-marker-icon.city").hasClass("hidden")) {
                            $(".leaflet-marker-icon.city").addClass("hidden");
                            $(".leaflet-marker-icon.testPoint").removeClass("hidden");
                            $(".leaflet-marker-icon.school").removeClass("hidden");
                        }
                    }


                }*/

                if(context_this.getZoom()>12){
                    console.log($(".leaflet-marker-icon.city"));
                    $(".leaflet-marker-icon.city").hide();
                    $(".leaflet-marker-icon.testPoint").show();
                }else if(context_this.getZoom()<=12 && context_this.getZoom()>=6){
                    $(".leaflet-marker-icon.city").show();
                    $(".leaflet-marker-icon.testPoint").hide();
                }else if(context_this.getZoom()<6){
                    $(".leaflet-marker-icon.city").hide();
                    $(".leaflet-marker-icon.testPoint").hide();
                }

                try{
                if(layer.options.visibility){
                    if((layer.options.visibility.minZoom && context_this.getZoom()<layer.options.visibility.minZoom) || (layer.options.visibility.maxZoom && context_this.getZoom()>layer.options.visibility.maxZoom)){
                        layer.setStyle({
                            opacity:0,
                            fillOpacity: 0
                        });
                        console.log(layer);
                        if(layer._icon)$(layer._icon).hide();
                        layer.unbindPopup();
                    }else{
                        console.log(layer._icon);
                        if(layer._icon)$(layer._icon).show();
                        layer.setStyle({
                            fillOpacity: 0.35
                        });
                    }
                }
            }catch(e){
                console.log("NEEDS REVIEW");
            }


                if(layer.options.persistence){
                    if((layer.options.persistence.minZoom && context_this.getZoom()<layer.options.persistence.minZoom) || (layer.options.persistence.maxZoom && context_this.getZoom()>layer.options.persistence.maxZoom)){
                        context_this.removeLayer(layer);
                        if(layer._icon){
                            $(layer._icon).remove();
                        }
                    }

                }






            });
            eraseDeferred.resolve();
        }, 30);

        //eraseDeferred.done(function(){
        this.fire("zoomendTrigger", eraseDeferred.promise());
        //});
    });

    map.getMap().on("zoomendTrigger", function(eraseDeferred) {

        console.log("zoomend: here");
        //console.log(this.getZoom());
        var context_this = this;

        function vectorFetchingAndDrawingRules() {
            var context_this = this;



            var zoomL = this.getZoom();
            //console.log(zoomL);
            var params = {
                function: "getMapFeatures"
                , requestType: "GET"
            };
            var functions = {
                onEachFeature: null,
                pointToLayer: null,
                eventHandlers: null
            };



            if (zoomL < 6) {
                //cartomancerGlobals.z6=1;

//            console.log("yeah");
                //delete persistentLayerIDs.cities;
                delete persistentLayerIDs.testPointLayerIDs;
                delete persistentLayerIDs.testPointIDS;
                delete persistentLayerIDs.schoolIDs;
                delete persistentLayerIDs.schoolLayerIDs;

//            console.log("yeah");

                if (persistentLayerIDs.countries) {
                    return;
                }

                //console.log("here");
                params.type = "countries";

                functions.onEachFeature = function(feature, layer) {
                    //persistentLayers.countries.push(layer);
//                console.log("inside geojson");
//                console.log(feature);
//                console.log(layer);
//                if (feature.geometry.type !== "Polygon")
//                    return;
                    layer.setStyle({
                        opacity: 0,
                        fillColor: featureStyles.countryColors[feature.properties.country],
                        fillOpacity: 0.35
                    });
                    layer.options.visibility = {
                        maxZoom: 5
                     };


                };

                functions.pointToLayer = function() {
                    //do nothing;
                };

                functions.eventHandlers = {
                    onMouseOver: function(e) {
                        if (map.getMap().getZoom() < 6)
                            hoverSettings.featureHovered(e);
                        cartomancerGlobals.e = e;

                    },
                    onMouseOut: function(e) {
                        if (map.getMap().getZoom() < 6)
                            hoverSettings.featureHoveredOut(e);
                    },
                    onFeatureClick: function(e) {
                        cartomancerGlobals.eClicked = e;

                        //e.layer.unbindPopup();

                        //console.log(map.getMap().getZoom());

                        if (!(map.getMap().getZoom() < 6))
                            return;

                        var sandglass = new SandGlass().setContent("<a class='title'>" + e.layer.feature.properties.country.replace(/_/g, " ") + "</a>");

                        var summaryQuery = mapData.fetchMapFeatures({
                            function: "getSummary",
                            type: "country",
                            country: e.layer.feature.properties.country,
                            city: "all",
                            requestType: "GET"
                        });

                        //var sandDeferred = $.Deferred();

                        var sand = new Sand(null, "");

                        sandglass.setContent(sand.getSand());
                        clickSettings.featureClicked(e, sandglass.getSandGlass());

                        summaryQuery.done(function(summaryTable, params) {
                            var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), false);
                            //pp=popupContent;

                            sand.setDeferred(popupContent.getConstructorState());

                            popupContent.getConstructorState().done(function() {

                                sandglass.setContent(popupContent.getPopupContent());
                                sandglass.setContent(new sandglass.BalloonTurn());

                                $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

                            });
                        });

                    }
                };

            }
            else if (zoomL >= 6 && zoomL <= 12) {
                cartomancerGlobals.z6=1;

                delete persistentLayerIDs.testPointLayerIDs;
                delete persistentLayerIDs.testPointIDS;
                delete persistentLayerIDs.schoolIDs;
                delete persistentLayerIDs.schoolLayerIDs;
//            for (var key in map.getMap()._layers[persistentLayerIDs.countries]._layers) {
//                map.getMap()._layers[persistentLayerIDs.countries]._layers[key].setStyle(featureStyles.elvenCloak);
//                //persistentLayers.countries[key].clearEventHandlers();
//            }
                map.getMap()._layers[persistentLayerIDs.countries].setStyle(featureStyles.elvenCloak);
                params.type = "cities";
                //params.country = locationHovered;
                //function=getCityGeoJSON&southWestLat=0&southWestLng=70&northEastLat=28&northEastLng=87
                params.function = "getCityGeoJSON";
                /*params.bounds = this.getBounds();*/
                params.bounds = this.getBounds().pad(4);
                params.southWestLat = params.bounds._southWest.lat;
                params.southWestLng = params.bounds._southWest.lng;
                params.northEastLat = params.bounds._northEast.lat;
                params.northEastLng = params.bounds._northEast.lng;
                delete params.bounds; //yes, i know it looks funny..params.bounds is for the caching algrithm which will be deployed later;


                functions.onEachFeature = function(feature, layer) {
                    console.log(feature);
                    setTimeout(function() {

                        for (var citiesLayerID in persistentLayerIDs.cities) {
                            var cityNearCity = leafletPip.pointInLayer(feature.geometry.coordinates, context_this._layers[persistentLayerIDs.cities[citiesLayerID]], false);
                            if (cityNearCity.length) {
                                context_this.removeLayer(layer);
                                return;
                            }
                        }
                        if (context_this.getZoom() < 6) {
                            context_this.removeLayer(layer);
                            return;
                        }
                        //var cityNearCity = leafletPip.pointInLayer(this.getCenter(), this._layers[persistentLayerIDs.countries], true);
                        var nearCity = feature;
                        nearCity.geometry = {
                            type: "Polygon",
                            coordinates: [[
                                    [feature.geometry.coordinates[0] - 0.1, feature.geometry.coordinates[1] + 0.1],
                                    [feature.geometry.coordinates[0] + 0.1, feature.geometry.coordinates[1] + 0.1],
                                    [feature.geometry.coordinates[0] + 0.1, feature.geometry.coordinates[1] - 0.1],
                                    [feature.geometry.coordinates[0] - 0.1, feature.geometry.coordinates[1] - 0.1]
                                ]]
                        };
                        var nearCityLayer = L.geoJson(nearCity, {
                            onEachFeature: function(feature, layer) {
                                layer.setStyle({
                                    opacity: 0,
                                    fillColor: "#000000",
                                    fillOpacity: 0
                                });
                                layer.options={
                                    persistence:{
                                        minZoom: 1,
                                        maxZoom: 22
                                    }
                                };
                            }
                        }).addTo(context_this);
                        if (!persistentLayerIDs.cities)
                            persistentLayerIDs.cities = new Array();
                        persistentLayerIDs.cities.push(nearCityLayer._leaflet_id);
                        console.log(nearCityLayer);
                    }, 0);


                    //do nothing;
                };

                functions.pointToLayer = function(feature, latlng) {

                    return (context_this.getZoom() >= 6 && context_this.getZoom() <= 12) ? L.marker(latlng, {
                        icon: L.divIcon({
                            html: "<img src='img/city.png'/>",
                            iconSize: [20, 35],
                            iconAnchor: [10, 17.5],
                            className: "city"
                        }),
                        /*persistence:{
                            minZoom:6,
                            maxZoom: 12
                        },*/
                        visibility:{
                          minZoom:6,
                          maxZoom:12
                        },
                        riseOnHover: true

                    }) : false;

                };

                functions.eventHandlers = {
                    onMouseOver: function(e) {
                        if (map.getMap().getZoom() <= 12)
                            hoverSettings.featureHovered(e);
                        cartomancerGlobals.e = e;

                    },
                    onMouseOut: function(e) {
                        if (map.getMap().getZoom() <= 12)
                            hoverSettings.featureHoveredOut(e);
                    },
                    onFeatureClick: function(e) {
                        cartomancerGlobals.eClicked = e;

                        //e.layer.unbindPopup();

                        //console.log(map.getMap().getZoom());

                        if (!(map.getMap().getZoom() <= 12))
                            return;

                        var countryByTemporaryMethod = leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true)[0].feature.properties.country;

                        var sandglass = new SandGlass().setContent("<a class='title'>" + e.layer.feature.properties.city + "</a>, <a class='title'>" + countryByTemporaryMethod.replace(/_/g," ") + "</a>");

                        //console.log(leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true));

                        var summaryQuery = mapData.fetchMapFeatures({
                            function: "getSummary",
                            type: "city",
                            //country: e.layer.feature.properties.country,
                            country: countryByTemporaryMethod,
                            city: e.layer.feature.properties.city,
                            requestType: "GET"
                        });

                        //var sandDeferred = $.Deferred();

                        var sand = new Sand(null, "");

                        sandglass.setContent(sand.getSand());
                        clickSettings.featureClicked(e, sandglass.getSandGlass());

                        summaryQuery.done(function(summaryTable, params) {
                            var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), false);
                            //pp=popupContent;

                            sand.setDeferred(popupContent.getConstructorState());

                            popupContent.getConstructorState().done(function() {

                                sandglass.setContent(popupContent.getPopupContent());
                                sandglass.setContent(new sandglass.BalloonTurn());

                                if($($(sandglass.getSanGlass()).find(".title")[0]).text()==="hydrerabad")$($(sandglass.getSanGlass()).find(".title")[0]).text("hyderabad");

                                $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

                            });


                        });

                    }
                };

            } else if (zoomL > 12) {
                cartomancerGlobals.z12=1;
                map.getMap()._layers[persistentLayerIDs.countries].setStyle(featureStyles.elvenCloak);

                var queryBoundsPoly = boundsToPolyString(this.getBounds());
                var schoolQueryAndDrawRules = {
                    action: "fetchMapFeatures",
                    queryBoundsPoly: queryBoundsPoly,
                    params: {
                        /*url: config.osmAPI.url + "?" + config.osmAPI.schoolQueryPrefix + queryBoundsPoly + config.osmAPI.schoolQueryMiddle + queryBoundsPoly + config.osmAPI.schoolQuerySuffix,*/
                        function: "getSchoolsGeoJSON",
                        requestType: "GET",
                        bounds: this.getBounds()
                    },
                    functions: {
                        onEachFeature: function(feature, layer) {
                            setTimeout(function() {

                                //for (var testPointIDs in persistentLayerIDs.testPointIDs){
                                if (persistentLayerIDs.schoolIDs && $.inArray(feature.properties.name, persistentLayerIDs.schoolIDs) + 1) {
                                    context_this.removeLayer(layer);
                                    return;
                                }
                                //}

                                if (!persistentLayerIDs.schoolIDs)
                                    persistentLayerIDs.schoolIDs = new Array();
                                persistentLayerIDs.schoolIDs.push(feature.properties.name);

                                if (!persistentLayerIDs.schoolLayerIDs)
                                    persistentLayerIDs.schoolLayerIDs = new Array();
                                persistentLayerIDs.schoolLayerIDs.push(layer._leaflet_id);



                            }, 0);

                        },
                        pointToLayer: function(feature, latlng) {
                            return (context_this.getZoom() > 12 && !$.inArray(feature.properties.name, persistentLayerIDs.schoolIDs) + 1) ? L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<img src='img/school.png'/>",
                                    iconSize: [20, 35],
                                    iconAnchor: [10, 17.5],
                                    className: "school " + feature.properties.name
                                }),
                                riseOnHover: true,
                                persistence:{
                                    minZoom: 13
                                }

                            }) : function(){delete feature; return false;}();
                        },
                        eventHandlers: {
                            onMouseOver: function(e) {

                            },
                            onMouseOut: function(e) {

                            },
                            onFeatureClick: function(e) {
                                cartomancerGlobals.eClicked = e;

                                //e.layer.unbindPopup();

                                //console.log(map.getMap().getZoom());

                                if (!(map.getMap().getZoom() > 12))
                                    return;

                                console.log(persistentLayerIDs.cities);

                                var nearbyCity;
                                var inCountry;

                                for (var citiesLayerID in persistentLayerIDs.cities) {
                                    nearbyCity = leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.cities[citiesLayerID]], true);
                                    console.log(nearbyCity);
                                    if (nearbyCity.length) {
                                        nearbyCity = nearbyCity[0];
                                        inCountry = nearbyCity.feature.properties.country;
                                        nearbyCity = nearbyCity.feature.properties.city;
                                        break;
                                    }
                                }

                                //var nearbyCity = leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.cities], true)[0].feature.properties.country;

                                var sandglass = new SandGlass().setContent("<a class='title'>" + e.layer.feature.properties.name + "</a>,<a class='title'>" + nearbyCity + "</a>, <a class='title'>" + inCountry + "</a>");
                                sandglass.setContent(new UI_Button({
                                    attributes: {
                                        class: "link-school trigger"
                                    },
                                    eventHandlers: {
                                        click: function(clickEvent) {
                                            var this_element = this;
                                            $(this_element).toggleClass("active");
                                            setTimeout(function() {
                                                for (var linkLayerID in persistentLayerIDs.school_testPoint_link) {
                                                    context_this.removeLayer(context_this._layers[persistentLayerIDs.school_testPoint_link[linkLayerID]]);
                                                }
                                                delete persistentLayerIDs.school_testPoint_link;

                                                if ($(this_element).hasClass("active")) {
                                                    console.log("here");
                                                    var testPointLatLng;
                                                    for (var tp in persistentLayerIDs.testPointLayerIDs) {
                                                        console.log(context_this._layers[persistentLayerIDs.testPointLayerIDs[tp]]);
                                                        if (context_this._layers[persistentLayerIDs.testPointLayerIDs[tp]].feature.properties.school === e.layer.feature.properties.name) {
                                                            testPointLatLng = L.latLng(context_this._layers[persistentLayerIDs.testPointLayerIDs[tp]].feature.geometry.coordinates[1], context_this._layers[persistentLayerIDs.testPointLayerIDs[tp]].feature.geometry.coordinates[0]);
                                                            var line = L.polyline([e.latlng, testPointLatLng]).addTo(context_this);
                                                            if (!persistentLayerIDs.school_testPoint_link)
                                                                persistentLayerIDs.school_testPoint_link = [];
                                                            persistentLayerIDs.school_testPoint_link.push(line._leaflet_id);
                                                            console.log(line);
                                                        }
                                                    }

                                                }
                                            }, 0);
                                        }
                                    },
                                    content: function() {
                                        return $("<a>View Test Points</a>");
                                    }
                                }));

                                //console.log(leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true));

                                /*var summaryQuery = mapData.fetchMapFeatures({
                                 function: "getTestPointDetails",
                                 //type: "testPoint",
                                 id: e.layer.feature.properties.id,
                                 requestType: "GET"
                                 });*/

                                var summaryQuery = $.Deferred();

                                //var sandDeferred = $.Deferred();

                                var sand = new Sand(null, "");

                                sandglass.setContent(sand.getSand());
                                clickSettings.featureClicked(e, sandglass.getSandGlass());

                                summaryQuery.resolve({
                                    number_of_test_points: 3,
                                    participating_in_survey_since: "September, 2014"
                                }, {});

                                summaryQuery.done(function(summaryTable, params) {
                                    var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), false);
                                    //pp=popupContent;

                                    sand.setDeferred(popupContent.getConstructorState());

                                    popupContent.getConstructorState().done(function() {

                                        sandglass.setContent(popupContent.getPopupContent());
                                        sandglass.setContent(new sandglass.BalloonTurn());

                                        $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

                                    });
                                });
                            }
                        }
                    }
                };






                params.type = "testPoints";
                //params.country = locationHovered;
                //function=getCityGeoJSON&southWestLat=0&southWestLng=70&northEastLat=28&northEastLng=87
                params.function = "getMapFeatures";
                /*params.bounds = this.getBounds();*/
                /*params.bounds = {
                    _southWest:{
                        lat: 0,
                        lng: 18
                    },
                    _northEast:{
                        lat: 35,
                        lng: 100
                    }
                };*/
                params.bounds = this.getBounds().pad(600);
                params.southWestLat = params.bounds._southWest.lat;
                params.southWestLng = params.bounds._southWest.lng;
                params.northEastLat = params.bounds._northEast.lat;
                params.northEastLng = params.bounds._northEast.lng;

                functions.onEachFeature = function(feature, layer) {
                    //console.log(feature);

                    setTimeout(function() {

                        //for (var testPointIDs in persistentLayerIDs.testPointIDs){
                        if (persistentLayerIDs.testPointLayerIDs && $.inArray(feature.properties.id, persistentLayerIDs.testPointIDs) + 1) {
                            context_this.removeLayer(layer);
                            return;
                        }
                        //}

//                    for (var citiesLayerID in persistentLayerIDs.cities) {
//                        var cityNearCity = leafletPip.pointInLayer(feature.geometry.coordinates, context_this._layers[persistentLayerIDs.cities[citiesLayerID]], false);
//                        if (cityNearCity.length) {
//                            context_this.removeLayer(layer);
//                            return;
//                        }
//                    }

                        //var cityNearCity = leafletPip.pointInLayer(this.getCenter(), this._layers[persistentLayerIDs.countries], true);
//                    /*var nearCity = feature;
//                    nearCity.geometry = {
//                        type: "Polygon",
//                        coordinates: [[
//                                [feature.geometry.coordinates[0] - 0.1, feature.geometry.coordinates[1] + 0.1],
//                                [feature.geometry.coordinates[0] + 0.1, feature.geometry.coordinates[1] + 0.1],
//                                [feature.geometry.coordinates[0] + 0.1, feature.geometry.coordinates[1] - 0.1],
//                                [feature.geometry.coordinates[0] - 0.1, feature.geometry.coordinates[1] - 0.1]
//                            ]]
//                    };
//                    var nearCityLayer = L.geoJson(nearCity, {
//                        onEachFeature: function(feature, layer) {
//                            layer.setStyle({
//                                opacity: 0,
//                                fillColor: "#000000",
//                                fillOpacity: 0
//                            });
//                        }
//                    }).addTo(context_this);
                        if (!persistentLayerIDs.testPointIDs)
                            persistentLayerIDs.testPointIDs = new Array();
                        persistentLayerIDs.testPointIDs.push(feature.properties.id);

                        if (!persistentLayerIDs.testPointLayerIDs)
                            persistentLayerIDs.testPointLayerIDs = new Array();
                        persistentLayerIDs.testPointLayerIDs.push(layer._leaflet_id);

                        /*if (!persistentLayerIDs.cities)
                         persistentLayerIDs.cities = new Array();
                         persistentLayerIDs.cities.push(nearCityLayer._leaflet_id);
                         console.log(nearCityLayer);*/

                    }, 0);

                    //do nothing;
                };

                functions.pointToLayer = function(feature, latlng) {

                    return (context_this.getZoom() > 12 && !$.inArray(feature.properties.id, persistentLayerIDs.testPointIDs) + 1) ? L.marker(latlng, {
                        icon: L.divIcon({
                            html: "<img src='img/raindrop.png'/>",
                            iconSize: [20, 35],
                            iconAnchor: [10, 17.5],
                            className: "testPoint"
                        }),
                        riseOnHover: true,
                        /*persistence:{
                            minZoom: 13
                        }*/
                        visibility:{
                            minZoom:13
                        }

                    }) : false;

                };

                functions.eventHandlers = {
                    onMouseOver: function(e) {
//                    if (map.getMap().getZoom() <= 9)
//                        hoverSettings.featureHovered(e);
                        cartomancerGlobals.e = e;

                    },
                    onMouseOut: function(e) {
//                    if (map.getMap().getZoom() <= 9)
//                        hoverSettings.featureHoveredOut(e);
                    },
                    onFeatureClick: function(e) {
                        cartomancerGlobals.eClicked = e;

                        //e.layer.unbindPopup();

                        //console.log(map.getMap().getZoom());

                        if (!(map.getMap().getZoom() > 12))
                            return;

                        console.log(persistentLayerIDs.cities);

                        var nearbyCity;
                        var inCountry;

                        for (var citiesLayerID in persistentLayerIDs.cities) {
                            nearbyCity = leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.cities[citiesLayerID]], true);
                            console.log(nearbyCity);
                            if (nearbyCity.length) {
                                nearbyCity = nearbyCity[0];
                                inCountry = nearbyCity.feature.properties.country;
                                nearbyCity = nearbyCity.feature.properties.city;
                                break;
                            }
                        }

                        //var nearbyCity = leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.cities], true)[0].feature.properties.country;

                        var sandglass = new SandGlass().setContent("<a class='title'>A testpoint <span style='text-transform:none;'>in</span> " + nearbyCity.replace(/_/g," ") + ",</a> <a class='title'>" + inCountry.replace(/_/g, " ") + "</a>");

                        //console.log(leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true));

                        var summaryQuery = mapData.fetchMapFeatures({
                            function: "getTestPointDetails",
                            //type: "testPoint",
                            id: e.layer.feature.properties.id,
                            requestType: "GET"
                        });

                        //var sandDeferred = $.Deferred();

                        var sand = new Sand(null, "");

                        sandglass.setContent(sand.getSand());
                        clickSettings.featureClicked(e, sandglass.getSandGlass());

                        summaryQuery.done(function(summaryTable, params) {
                            var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), false);
                            //pp=popupContent;

                            sand.setDeferred(popupContent.getConstructorState());

                            popupContent.getConstructorState().done(function() {

                                sandglass.setContent(popupContent.getPopupContent());
                                sandglass.setContent(new sandglass.BalloonTurn());
                                $($(sandglass.getSandGlass()).find("a.title")[0]).text(summaryTable.description);
                                $($(sandglass.getSandGlass()).find("a.title")[1]).remove();

                                $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

                            });
                        });

                    }
                };

                /****functions.rulesForFurtherActions = schoolQueryAndDrawRules;***/
            }

            return {
                params: params,
                functions: functions
            };
        }

        if (eraseDeferred.done) {
//            eraseDeferred.done(function() {
//                context_this.fire("commandLoadGeoJSONData", {
//                    params: params,
//                    functions: functions
//                });

//                if (zoomL > 12)
//                    context_this.fire("commandLoadGeoJSONData", {
//                        params: schoolQueryAndDrawRules.schoolAjaxParams,
//                        functions: schoolQueryAndDrawRules.schoolFunctions
//                    });
            //});
        } else {  //TODO: check dependencies and remove this conditional check
            console.log("what!!??");//context_this.fire("commandLoadGeoJSONData", {params: params, functions: functions});
//            if (zoomL > 12)
//                context_this.fire("commandLoadGeoJSONData", {
//                    params: schoolQueryAndDrawRules.schoolAjaxParams,
//                    functions: schoolQueryAndDrawRules.schoolFunctions
//                });
        }
        eraseDeferred.done(function() {
            if((context_this.getZoom()>12&&cartomancerGlobals.z12)||(context_this.getZoom()>=6&&context_this.getZoom()<=12&&cartomancerGlobals.z6)) return;
            var paramsNFunctions = vectorFetchingAndDrawingRules.call(context_this);
            context_this.fire("commandLoadGeoJSONData", paramsNFunctions);
        });

    });


    map.getMap().on("commandLoadGeoJSONData", function(params) {
        var functions = params.functions;
        params = params.params;

//        console.log("commandLoadGeoJSONData triggered");
//        console.log(params);

        loadScreen.showLoadingAnim(false);


        modelQuery = mapData.fetchMapFeatures(params);

        //if (modelQuery.state && modelQuery.done) {
        //console.log("here");
        modelQuery.done(function(jsonData, params) {
            var featuresNParams = {
                jsonData: jsonData,
                params: params,
                functions: functions
            };
            map.getMap().fire("commandDrawFeatures", featuresNParams);  //TODO: is the second parameter needed??
        });
        /*} else {
         //console.log(modelQuery);
         var jsonData = modelQuery;
         var featuresNParams = {
         jsonData: jsonData,
         params: params,
         functions: functions
         };
         map.getMap().fire("commandDrawFeatures", featuresNParams);  //TODO: is the second parameter needed??
         }*/

    });

    /**TODO: **||This is a temporary hack**/
    /*map.getMap().on("overpassSchoolsQuery", function(params) {
     setTimeout(function() {
     console.log("overpassSchoolsQuery");
     var queryBoundsPoly = boundsToPolyString(params.bounds);
     console.log(queryBoundsPoly);
     console.log("url: " + config.osmAPI.url + "?" + config.osmAPI.schoolQueryPrefix + queryBoundsPoly + config.osmAPI.schoolQueryMiddle + queryBoundsPoly + config.osmAPI.schoolQuerySuffix);
     var url = config.osmAPI.url + "?" + config.osmAPI.schoolQueryPrefix + queryBoundsPoly + config.osmAPI.schoolQueryMiddle + queryBoundsPoly + config.osmAPI.schoolQuerySuffix;

     var schoolAjaxParams = {
     url: url,
     function: "getSchoolsGeoJSON",
     requestType: "GET",
     bounds: params.bounds
     };
     console.log(schoolAjaxParams);
     new mapData.getSchools(schoolAjaxParams).done(function() {
     schoolPointsReady = true;
     });
     }, 0);
     });*/
    /**This is a temporary hack||**/


    map.getMap().on("commandDrawFeatures", function(featuresNParams) {  //TODO: is the second parameter needed??
        var jsonData = featuresNParams.jsonData;
        var params = featuresNParams.params;
        var functions = featuresNParams.functions;
//        console.log("newDataHasArrived");
//        console.log(this);
//        console.log(params);
//        console.log("mapadding features type:");
//
//        console.log(jsonData);
//        returnedData = jsonData;

        /*if (params.function === "getSchoolsGeoJSON") {
         console.log("drawing schools");
         console.log(jsonData);
         }*/


        var features = L.geoJson(null, {
            onEachFeature: functions.onEachFeature,
            pointToLayer: functions.pointToLayer
        }).addTo(this);

//        console.log("YAHA!!");
//        console.log(features._leaflet_id);



        if (params && params.type === "countries") {

            persistentLayerIDs.countries = features._leaflet_id;
            var selectmenu = $("#splashScreen").find(".ui-objects>select.country");
            console.log(selectmenu);
            //$(selectmenu).html("<option class='msg'>Select a Country</option>");
            for (var c in jsonData.features) {
                $("<option>").attr({
                    value: jsonData.features[c].properties.country
                }).text(jsonData.features[c].properties.country.replace(/_/g, " ")).appendTo($(selectmenu));
            }
            $(selectmenu).selectmenu("refresh");
            $($(selectmenu).selectmenu("menuWidget").find("li")[0]).addClass("hidden");

            /*console.log(features.getBounds());
             this.fire("overpassSchoolsQuery", {
             bounds: features.getBounds()
             });*/ /*causes unresponsice script*/
        }

        console.log(jsonData);

        if (functions.rulesForFurtherActions && jsonData.features.length) {
            switch (functions.rulesForFurtherActions.action) {
                case "fetchMapFeatures":
                    var deferred = $.Deferred();

                    var vS = "";

                    for (var v in jsonData.features) {
                        vS += jsonData.features[v].properties.school ? jsonData.features[v].properties.school : "Montessori Cottage Pre-School";
                        if (v < jsonData.features.length - 1)
                            vS += "|";
                    }

                    console.log(vS);

                    var prefix = "data=[out:json];(way['name'~'" + vS + "'](";
                    var middle = ");node(w);node['name'~'" + vS + "'](";
                    console.log(prefix);
                    console.log(middle);

                    var context_this = this;

                    deferred.resolve({
                        prefix: prefix,
                        middle: middle,
                        functions: functions,
                        this: context_this
                    });


                    deferred.done(function(urlParams) {
                        console.log(urlParams.prefix);
                        console.log(urlParams.middle);
                        //urlParams.functions.rulesForFurtherActions.params.url = config.osmAPI.url + "?" + urlParams.prefix + functions.rulesForFurtherActions.queryBoundsPoly + urlParams.middle + functions.rulesForFurtherActions.queryBoundsPoly + config.osmAPI.schoolQuerySuffix;
                        //urlParams.functions.rulesForFurtherActions.params.url="http://localhost/hello";
                        console.log(urlParams.functions.rulesForFurtherActions.params);
                        urlParams.functions.rulesForFurtherActions.params.prefix = urlParams.prefix;
                        urlParams.functions.rulesForFurtherActions.params.middle = urlParams.middle;
                        urlParams.this.fire("commandLoadGeoJSONData", {
                            params: urlParams.functions.rulesForFurtherActions.params,
                            functions: urlParams.functions.rulesForFurtherActions.functions
                        });
                    });
            }
        }

        features.addData(jsonData);

        cartomancerGlobals.features = features;
        cartomancerGlobals.params = params;



        features.on("mouseout", function(e) {

            functions.eventHandlers.onMouseOut(e);
        });

        features.on("mouseover", function(e) {

            functions.eventHandlers.onMouseOver(e);

        });

        features.on("click", function(e) {

            functions.eventHandlers.onFeatureClick(e);

        });



    });





//    map.getMap().getContainer().addEventListener("onmousewheel", function(e){
//        cartomancerGlobals.mouseWheel = true;
//        setTimeout(function(){
//            cartomancerGlobals.mouseWheel = false;
//        }, 500);
//    });
//    map.getMap().getContainer().addEventListener("DOMMouseScroll", function(e){
//        cartomancerGlobals.mouseWheel = true;
//        setTimeout(function(){
//            cartomancerGlobals.mouseWheel = false;
//        }, 500);
//    });


    //map.getMap().addControl(new CompareButton());

    $("#splashScreen").append($(new CloseButton()).on("click", function(e) {
        $("#freezeScreen").hide();
        if (map.getMap().getZoom() >= 6)
            $("#infoPanel").show();
    }));



    /***************||jQuery plugins**************/
    $.fn.fillWithQueryReturn = function(params) {
        $(this).html("");
        var sandglass = new SandGlass();

        //console.log(leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true));

        var summaryQuery = mapData.fetchMapFeatures(params);

        //var sandDeferred = $.Deferred();

        var sand = new Sand(null, "");

        sandglass.setContent(sand.getSand());
        //clickSettings.featureClicked(e, sandglass.getSandGlass());
        $(this).html(sandglass.getSandGlass());

        summaryQuery.done(function(summaryTable, params) {

            /**temporary hack**/
            delete summaryTable.count_cities;
            delete summaryTable.count_schools;
            delete summaryTable.count_testPoints;
            //summaryTable.;
            /****/


            var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), true);
            //pp=popupContent;

            sand.setDeferred(popupContent.getConstructorState());

            popupContent.getConstructorState().done(function() {

                sandglass.setContent(popupContent.getPopupContent());

                $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

            });
        });
    };
    /***************jQuery plugins||**************/

    /***************||CompareScreen**********************************/
    /*function onSelectmenuCreate(e, ui) {
     console.log($(this));
     console.log($(e.target));
     $("<option></option>")
     .appendTo($(this))
     .addClass("msg default")
     .attr("value", "")
     .text("Select a " + $(this).attr("class"));
     $(this).selectmenu("refresh");
     /*var elements = $(this).next(".ui-selectmenu-button").toArray();
     for (var el in elements) {
     $(elements[el]).attr("select", $(this).attr("class"));

     $(elements[el]).children(".ui-selectmenu-text").excecuteOnEach(function() {
     var context = $(this);
     $(this).append(function() {
     return $("<div></div>").text("Select a " + $(context).parent().attr("select"));
     }());
     });
     }*\/
     }*/

    function onSelectmenuSelect(e, ui, params, _fn, _params) {
        if (_fn)
            _fn.call(e.target, _params);

        console.log($(this));
        console.log($(e.target));


        $(e.target).closest(".compare").find(".sandglass-container").fillWithQueryReturn({
            function: "getSummary",
            type: params.type,
            country: params.country,
            city: params.city,
            requestType: "GET"
        });
    }



    $("#splashScreen").find(".ui-objects>select.country").excecuteOnEach(function() {
        $(this).selectmenu({
            create: function(e, ui) {
                $("<option></option>")
                        .appendTo($(e.target))
                        .addClass("msg default")
                        .attr("value", "")
                        .text("Select " + $(this).attr("class"));
                $(this).selectmenu("refresh");
                $($(this).selectmenu("menuWidget").find("li")[0]).addClass("hidden");
            },
            select: function(e, ui) {
                onSelectmenuSelect(e, ui, {
                    type: "country",
                    country: ui.item.value,
                    city: "all"
                }, function() {
                    $(this).children("option.default").remove();
                    $(this).selectmenu("refresh");
                    $(this).siblings("select.city").append(function() {
                        return $("<option></option>")
                                .addClass("msg default")
                                .attr({
                                    value: "all",
                                    country: ui.item.value
                                })
                                .text("All Cities");
                    }()).selectmenu("enable");
                    var sand = new Sand(null, "");
                    $(this).siblings("select.city").append(function() {
                        return $("<option></option>").addClass("loading-anim").append(sand.getSand())[0];
                    }());
                    console.log("now making ajax call");
                    var cityListQuery = mapData.fetchMapFeatures({
                        function: "getMapFeatures",
                        type: "cities",
                        country: ui.item.value,
                        requestType: "GET"
                    });


                    var context_this = $(this).siblings("select.city");

                    cityListQuery.done(function(jsonData, params) {
                        $(context_this).find("option:not(.default:first)").remove();
//                        $("<option></option>")
//                                .appendTo($(context_this))
//                                .addClass("msg default")
//                                .text("Select a City");
                        for (var city in jsonData.features) {
                            $("<option></option>")
                                    .appendTo($(context_this))
                                    .attr({
                                        value: jsonData.features[city].properties.city,
                                        country: ui.item.value
                                    }).text(jsonData.features[city].properties.city);
                        }
                        $(context_this).selectmenu("refresh");
                    });
                });
            }
        }).selectmenu("menuWidget").addClass("country");
    });

    $("#splashScreen").find(".ui-objects>select.city").excecuteOnEach(function() {
        $(this).selectmenu({
            create: function(e, ui) {

            },
            select: function(e, ui) {
                var params = {
                    type: ui.item.value === "all" ? "country" : "city",
                    country: ui.item.element.context.getAttribute("country"),
                    city: ui.item.value
                };
                onSelectmenuSelect(e, ui, params, function() {
                    if (!$(this).children(".msg:not(.default)").length)
                        $("<option></option>")
                                .appendTo($(this))
                                .addClass("msg")
                                .attr("value", "all")
                                .attr("country", ui.item.element.context.getAttribute("country"))
                                .text("All Cities");
                });
            }
        }).selectmenu("disable").selectmenu("menuWidget").addClass("City");
    });
    /***************CompareScreen||**********************************/


    $($("ul.navbar-nav").find("li")[0]).after(function() {
        var compareButton = new UI_Button({
            attributes: {
                //class: "trigger leaflet-control cartograph-control-button compare"
            },
            content: function() {
                return $("<div>Compare</div>");
            },
            eventHandlers: {
                click: function() {
                    $("#freezeScreen").show();
                    $("#infoPanel").hide();
                    $("#splashScreen").removeClass("hidden");
                }
            }
        });
        return $("<li class='compare'/>").append(compareButton);
    });

    $("#infoPanel").on("mapLocationChange", function(e, params) {
        $("#infoPanel").find(".info-container").html("");
        var sandglass = new SandGlass();

        //console.log(leafletPip.pointInLayer(e.latlng, context_this._layers[persistentLayerIDs.countries], true));

        var summaryQuery = mapData.fetchMapFeatures(params);

        //var sandDeferred = $.Deferred();

        var sand = new Sand(null, "");

        sandglass.setContent(sand.getSand());
        //clickSettings.featureClicked(e, sandglass.getSandGlass());
        $("#infoPanel").find(".info-container").html(sandglass.getSandGlass());

        summaryQuery.done(function(summaryTable, params) {
            var popupContent = new PopupContent(summaryTable, waterParams, new ParameterLabels().getParameterLabels(params), true);
            //pp=popupContent;

            sand.setDeferred(popupContent.getConstructorState());

            popupContent.getConstructorState().done(function() {

                sandglass.setContent(popupContent.getPopupContent());
                //$(sandglass.getSandGlass()).find("h4");

                $(sandglass.getSandGlass()).find(".scale-container").each(function(index){
                                    if($.inArray($(this).attr("type"),["benthic_macroinvertebrates","coliform_bacteria"])+1)return;
									if($(this).attr("type")==="biochemical_oxygen_demand") $(this).find("h4.scale-name").text("BOD:");
									if(!$(this).attr("parameter-value")) return;
                                    if($(this).attr("unit")) $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10+$(this).attr("unit") +"</p>");
                                    else $(this).find("h4").html($(this).find("h4").html()+" <p class='units'>"+Math.round(Number($(this).attr("parameter-value"))*10)/10 +"</p>");
                                });

            });
        });
    });


    $(document).on("click", "div.sandglass a.next", function() {
        console.log("a.next clicked");
        if ($(this).hasClass("disabled"))
            return;

        $(this).parent().find("a.prev").removeClass("disabled");

        $(this).parent().find(".nonpersistent.visible")
                .add($(this).parent().find(".nonpersistent.visible")
                        .nextAll(".nonpersistent:not(.visible)")
                        .selectFirstNItems(3).filter("div"))
                .toggleClass("visible");
        try {
            $(this).parent().find(".nonpersistent.visible")
                    .add($(this).parent().find(".nonpersistent.visible")
                            .nextAll(".nonpersistent:not(.visible)")
                            .selectFirstNItems(3).filter("div"));
        } catch (e) {
            $(this).addClass("disabled");
        }

    });

    $(document).on("click", "div.sandglass a.prev", function() {
        console.log("a.prev clicked");
        if ($(this).hasClass("disabled"))
            return;

        $(this).parent().find("a.next").removeClass("disabled");

        $(this).parent().find(".nonpersistent.visible")
                .add($(this).parent().find(".nonpersistent.visible")
                        .prevAll(".nonpersistent:not(.visible)")
                        .selectLastNItems(3).filter("div"))
                .toggleClass("visible");
        try {
            $(this).parent().find(".nonpersistent.visible")
                    .add($(this).parent().find(".nonpersistent.visible")
                            .prevAll(".nonpersistent:not(.visible)")
                            .selectLastNItems(3).filter("div"));
        } catch (e) {
            $(this).addClass("disabled");
        }

    });

});


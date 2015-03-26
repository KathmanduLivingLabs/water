/**TODO: IMPORTANT!!!!
 **fetchMapFeatures(params)change passed params to = {data:{function:xyz, type:xyz, city:xyz, city:xyz}, url:{}, requestType:{}, action:{}}
 **rather than params:{function:, type:country: city:} (currently in use) and use these (new) parameters accordingly;
 **/



function Model() {

    var mapFeatures = {
        cities: {},
        testPoints: {},
        schools: {}
    };
    var summary = {
        country: {},
        city: {}
    };
    var details = {
        testPoint: {},
        school: {}
    };

    var functionalKeys = {"fetchMapFeatures": {"index": 0}};  //TODO: is this needed??

    var overpassRequests = false;

    var scope = this;
    //var city={};
    //var testPoints={};

    var setIntervalFor = function(fn, fnParams, interval) {
        //xyz=this;
        var loopOn = setInterval(fn, interval);
        //if (loopOn) setTimeout(setIntervalFor(fn), interval);
    };

    this.getAllMapFeatures = function() {
        return mapFeatures;
    };

    this.getAllSummaries = function() {
        return summary;
    };

    this.getAllDetails = function() {
        return details;
    };

    this.getMapFeature = function(type) {
        return mapFeatures[type];
    };
    var setMapFeature = function(type, value) {
        mapFeatures[type] = value;
    };

    this.getFunctionalKeyList = function(functionName) {
        return functionalKeys[functionName];
    };

    this.getFunctionalKey = function(functionName, key) {
        return functionalKeys[functionName][key];
    };

    this.prepareArrayOfIdentifiers = function(jsonObj) {

    };

    var removeDuplicatesFromJSONArray = function(params) {

    };

    var queryModel = function(params) {

        /**keep error object ready, for in case there's an error in model query**/
        var e = function(params) {
            this.name = "Invalid Model Query Error";
            this.message = "Wrong query params.";
            this.params = params;
        };
        e.prototype = new Error();
        e.prototype.constructor = e;
        /****/

        switch (params.function) {
            case "getMapFeatures":
                if (params.type && params.country) {
                    if (mapFeatures[params.type][params.country])
                        return mapFeatures[params.type][params.country];  //mapFeatures ~= {cities:{countryName:{GeoJSON for cities inside countryName}}
                    else
                        break;
                } else if (params.type && params.southWestLat && params.southWestLng && params.northEastLat && params.northEastLng) {
                    if (mapFeatures[params.type]) {
                        /**no-cache solution**/
                        if (mapFeatures.testPoints.type) {
                            var returnJSON = mapFeatures.testPoints;
                            mapFeatures.testPoints = {};
                            return returnJSON;
                        } else {
                            break;
                        }
                        /****/
                    } else {
                        break;
                    }
                } else if (params.type) {
                    if (mapFeatures[params.type])
                        return mapFeatures[params.type];
                    else
                        break;
                } else {
//                      console.log("/**fetchMapFeatures(params): Error in Query with params:");
//                      console.log(params);
//                      console.log("**/");


                    console.log(new e(params));
                    throw new e(params);
                }
                break;

            case "getSummary":
                if (params.type && params.country && params.city === "all") {

                    if (summary[params.type][params.country])
                        return summary[params.type][params.country];
                    else
                        break;

                } else if (params.type && params.country && params.city) {

                    if (summary[params.type][params.country] && summary[params.type][params.country][params.city])
                        return summary[params.type][params.country][params.city];
                    else
                        break;

                } else {
                    console.log(new e(params));
                    throw new e(params);
                }
                break;

            case "getCityGeoJSON":
                if (params.southWestLat && params.southWestLng && params.northEastLat && params.northEastLng) {
                    //if(mapFeatures.cities){

                    /* var geoJSON = {
                     "type": "FeatureCollection",
                     "features": []
                     };

                     for (var country in mapFeatures.cities) {
                     for (var city in mapFeatures.cities[country].features) {
                     if (
                     (mapFeatures.cities[country].features[city].geometry.coordinates[0] >= params.southWestLng) && (mapFeatures.cities[country].features[city].geometry.coordinates[0] <= params.northEastLng)
                     &&
                     (mapFeatures.cities[country].features[city].geometry.coordinates[1] >= params.southWestLat) && (mapFeatures.cities[country].features[city].geometry.coordinates[1] <= params.northEastLat)
                     )
                     geoJSON.push(mapFeatures.cities[country].features[city]);
                     }
                     }

                     if (geoJSON.features.length)
                     return geoJSON;
                     else
                     break;
                     */

                    /**no-cache solution**/
                    console.log("no-cache solution for city points");
                    if (mapFeatures.cities.type) {
                        var returnJSON = mapFeatures.cities;
                        mapFeatures.cities = {};
                        return returnJSON;
                    } else {
                        break;
                    }
                    /****/


//                    }else{
//                        break;
//                    }

                } else {
                    console.log(new e(params));
                    throw new e(params);
                }
                break;
            case "getTestPointDetails":
                if (params.id) {
                    if (details.testPoint[params.id]) {
                        return details.testPoint[params.id];
                    } else {
                        break;
                    }
                } else {
                    console.log(new e(params));
                    throw new e(params);
                }
                break;
            case "getSchoolsGeoJSON":
                if (!mapFeatures.schools.properties || !mapFeatures.schools.properties.bounds || !mapFeatures.schools.properties.bounds.contains(params.bounds)) {
                    console.log("creating schools data cache bounds");
                    console.log(params.bounds);
                    console.log(params.bounds.pad(1));
                    console.log(boundsToPolyString(params.bounds.pad(1)));
                    var queryBoundsPoly = boundsToPolyString(params.bounds.pad(1));
                    params.url = config.osmAPI.url + "?" + params.prefix + queryBoundsPoly + params.middle + queryBoundsPoly + config.osmAPI.schoolQuerySuffix;
                    break;
                }
                /**no-cache solution**/
                if (mapFeatures.schools.type) {
                    //var returnJSON = mapFeatures.schools;
                    //mapFeatures.schools = {};
                    var returnJSON = {
                        type: "FeatureCollection",
                        features: []
                    };
                    console.log("HEHEHHEHAHAHAhere");
                    for (var school in mapFeatures.schools.features) {
                        if (params.bounds.contains(L.latLng(mapFeatures.schools.features[school].geometry.coordinates[1], mapFeatures.schools.features[school].geometry.coordinates[0]))) {
                            returnJSON.features.push(mapFeatures.schools.features[school]);
                        }
                    }
                    console.log(returnJSON);
                    return returnJSON;
                } else {
                    break;
                }
                /****/
                return false;
        }  //switch

        return false;
    };

//  var triggerEvent(eventType){
//      scope.trigger()
//  }

    var onJSONReturn = function(jsonObj, params) {
        console.log("onJSONReturn()");
        //console.log(jsonObj.toSource());
        console.log(params);
        switch (params.function) {
            case "getMapFeatures":
                if (params.type && params.country) {
                    if (mapFeatures[params.type][params.country])
                        $.extend(mapFeatures[params.type][params.country], jsonObj);
                    else
                        mapFeatures[params.type][params.country] = jsonObj;
                    break;
                } else if (params.type) {
                    if (mapFeatures[params.type])
                        $.extend(mapFeatures[params.type], jsonObj);
                    else
                        mapFeatures[params.type] = jsonObj;
                    break;
                }
                break;




            case "getSummary":

                if (params.type && params.country && params.city === "all") {
                    //try{
                    if (summary[params.type][params.country])
                        $.extend(summary[params.type][params.country], jsonObj);
                    else {
                        //if(!summary[params.type][params.country])
                        //summary[params.type][params.country] = {};
                        summary[params.type][params.country] = jsonObj;
                    }

                    break;
                } else if (params.type && params.country && params.city) {

                    if (!summary[params.type][params.country])
                        summary[params.type][params.country] = {}

                    summary[params.type][params.country][params.city] = jsonObj;

                }
                break;

            case "getCityGeoJSON":
                //if(params.southWestLat && params.southWestLng && params.northEastLat && params.northEastLng){
                //if(mapFeatures.cities){

                /*var geoJSON = {
                 "type":"FeatureCollection",
                 "features":[]
                 };*/


                /*
                 for (var city in jsonObj.features) {
                 if (!mapFeatures.cities[jsonObj.features[city].properties.country])
                 mapFeatures.cities[jsonObj.features[city].properties.country] = {
                 type: "FeatureCollection",
                 features: []
                 };

                 mapFeatures.cities[jsonObj.features[city].properties.country].push(jsonObj.features[city]);


                 }



                 break;
                 */

                /**no-cache solution**/

                mapFeatures.cities = jsonObj;
                break;

                /****/



                //}else{
                //break;
                //}
//                }else{
//                    console.log(new e(params));
//                    throw new e(params);
//                }


            case "getTestPointDetails":
                details.testPoint[params.id] = jsonObj;
                break;

            case "getSchoolsGeoJSON":

                //setTimeout(function() {
                var result = jsonObj;
                var points = {};
                points.type = "Features Collection";
                points.features = [];
                for (var i = 0; i < result.elements.length; ++i) {
                    var curr = result.elements[i];
                    if (curr.hasOwnProperty('tags')) {
                        var point = {};
                        point.type = "Feature";
                        point.properties = {};
                        point.properties.name = curr.tags.name;
                        point.geometry = {};
                        point.geometry.type = "Point";
                        point.geometry.coordinates = [];
                        if (curr.type === "node") {
                            point.geometry.coordinates = new Array(curr.lon, curr.lat);
                        }
                        else if (curr.type === "way") {
                            var lats = 0.0;
                            var lons = 0.0;
                            var count = 0;
                            for (var k = 0; k < curr.nodes.length; ++k) {
                                for (var l = 0; l < result.elements.length; ++l) {
                                    if (result.elements[l].id === curr.nodes[k]) {
                                        lats += result.elements[l].lat;
                                        lons += result.elements[l].lon;
                                    }
                                    break;
                                }
                            }
                            lats /= curr.nodes.length;
                            lons /= curr.nodes.length;
                            point.geometry.coordinates = new Array(lons, lats);
                        }
                        points.features.push(point);
                    }
                }

                console.log(points);

                mapFeatures.schools = points;
                mapFeatures.schools.properties = {
                    bounds: params.bounds.pad(1)
                };

                //}, 0);
                break;

        } //switch
//      $(scope).trigger("newDataHasArrived", params);
        return;
        //$(document).trigger..
    };




    this.fetchMapFeatures = function(params) {


        //return mapfeatures[params.type];


        console.log("inside mapData.fetchmapFeatures()");
        console.log(params);
        //delete params.bounds;


        return function(params) {
            var apiCall = $.Deferred();
            var modelQueryResult = queryModel(params);
            apiCall.resolve(modelQueryResult, params);
            return modelQueryResult ? apiCall.promise() : false;
        }(params) || function(params) {
            console.log("data not found in local cache..making ajax call;");
            var apiCall = $.Deferred();

            var url = config.api;
            var requestType = "POST";
            //var id="name";

            var bounds = params.bounds;
            delete params.bounds;

            if (Boolean(params.url)) {
                url = params.url;
                //delete params.url;
            }
            if (Boolean(params.requestType)) {
                requestType = params.requestType;
            }
            //    if(Boolean(params.id)){
            //        id=params.id;
            //        delete params.id;
            //    }

            if (overpassRequests) {
                apiCall.resolve({
                    type: "FeatureCollection",
                    features: []
                }, params);
            } else {

                $.ajax({
                    type: requestType,
                    url: url,
                    data: params,
                    success: function(data) {
                        params.bounds = bounds;
                        onJSONReturn(data, params);


                        if (overpassRequests)
                            overpassRequests = false;

                        apiCall.resolve(queryModel(params), params);
                    },
                    dataType: "json",
                    cache: false
                            /*,headers: {Connection: "close"}*/
                });
            }
            if (url.indexOf("overpass") + 1) {
                overpassRequests = true;
            }


            return apiCall.promise();

        }(params);


    };

    /*this.getSchools = function(schoolAjaxParams) {

     var deferred = $.Deferred();

     $.ajax({
     url: schoolAjaxParams.url,
     async: true,
     success: function(result) {
     setTimeout(function(){
     console.log("making schools geoJson");
     console.log(result);
     var points = {};
     points.type = "Features Collection";
     points.features = [];
     for (var i = 0; i < result.elements.length; ++i) {
     var curr = result.elements[i];
     if (curr.hasOwnProperty('tags')) {
     var point = {};
     point.type = "Feature";
     point.properties = {};
     point.properties.name = curr.tags.name;
     point.geometry = {};
     point.geometry.type = "Point";
     point.geometry.coordinates = [];
     if (curr.type === "node") {
     point.geometry.coordinates = curr.lat + ", " + curr.lon;
     }
     else if (curr.type === "way") {
     var lats = 0.0;
     var lons = 0.0;
     var count = 0;
     for (var k = 0; k < curr.nodes.length; ++k) {
     for (var l = 0; l < result.elements.length; ++l) {
     if (result.elements[l].id === curr.nodes[k]) {
     lats += (result.elements[l].lat);
     lons += (result.elements[l].lon);
     break;
     }

     }
     }
     lats /= curr.nodes.length;
     lons /= curr.nodes.length;
     point.geometry.coordinates = lats + ", " + lons;
     }
     points.features.push(point);
     }
     }
     mapFeatures.schools = points;
     deferred.resolve(points);
     },0);},
     error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR);
     console.log(textStatus);
     throw errorThrown;
     }
     });

     return deferred.promise();
     };*/

    this.getSchools = function(schoolAjaxParams) {

        var deferred = $.Deferred();

        $.ajax({
            url: schoolAjaxParams.url,
            async: true,
            success: function(result) {
                setTimeout(function() {
                    console.log("making schools geoJson");
                    console.log(result);
                    var points = {};
                    points.type = "Features Collection";
                    points.features = [];
                    for (var i = 0; i < result.elements.length; ++i) {
                        var curr = result.elements[i];
                        if (curr.hasOwnProperty('tags')) {
                            var point = {};
                            point.type = "Feature";
                            point.properties = {};
                            point.properties.name = curr.tags.name;
                            point.geometry = {};
                            point.geometry.type = "Point";
                            point.geometry.coordinates = [];
                            if (curr.type === "node") {
                                point.geometry.coordinates = curr.lat + ", " + curr.lon;
                            }
                            else if (curr.type === "way") {
                                var lats = 0.0;
                                var lons = 0.0;
                                var count = 0;
                                for (var k = 0; k < curr.nodes.length; ++k) {
                                    for (var l = 0; l < result.elements.length; ++l) {
                                        if (result.elements[l].id === curr.nodes[k]) {
                                            lats += (result.elements[l].lat);
                                            lons += (result.elements[l].lon);
                                            break;
                                        }

                                    }
                                }
                                lats /= curr.nodes.length;
                                lons /= curr.nodes.length;
                                point.geometry.coordinates = lats + ", " + lons;
                            }
                            points.features.push(point);
                        }
                    }
                    mapFeatures.schools = points;
                    deferred.resolve(points);
                }, 0);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                throw errorThrown;
            }
        });

        return deferred.promise();
    };
}

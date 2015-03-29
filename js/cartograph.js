function Map() {
    var map = L.map('map', {
        center: [27, 85],
        zoom: 4,
        doubleClickZoom: true
                /*,scrollWheelZoom: "center"*/
    });
    var osmTileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        attribution: 'Base Map &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>, Supported by: <a href="http://nepal.usembassy.gov/" target="_blank">American Embassy <img src="img/team/1.jpg" height="30px"></a>, System Designed and Developed by: <a href="http://www.kathmandulivinglabs.org" target="_blank">Kathmandu Living Labs <img src="img/team/4.jpg" height="30px"/></a>',
        maxZoom: 18,
        minZoom: 4
    });

    var _startingZoomLevel = map.getZoom();

//    map.on("zoomstart", function(){
//        _startingZoomLevel = map.getZoom();
//    });


    var mouseCoords = {};

    map.on("mousemove", function(e) {
        mouseCoords = e.latlng;
    });



//    this.zoomLevelChangedTo = function(){
//        if(zoomLevel1 > )
//    }

    this.getMap = function() {
        return map;
    };

    this.getOSMTileLayer = function() {
        return osmTileLayer;
    };

    this.getMouseCoords = function() {
        return mouseCoords;
    };

    this.getPreviousZoom = function() {
        return _startingZoomLevel;
    };
    this.initPreviousZoomVal = function() {
        _startingZoomLevel = map.getZoom();
    };


    osmTileLayer.once("load", function() {
        var notErasing = $.Deferred();
        notErasing.resolve();
        map.fire("zoomendTrigger", notErasing.promise());
        //map.fire("zoomendTrigger", false);
    });

    this.init = function() {
        osmTileLayer.addTo(map);
    };
}



function LoadScreen() {
    var anim = 0;
    this.showLoadingAnim = function(bool) {
        var deg = 0;
        if (anim)
            clearInterval(anim);
        if (bool) {
            anim = setInterval(function() {
                //$("#waitForMe>img").css("transform","rotate("+deg+"deg)");
                $("#loadScreen").find("div.animBall").css("margin-left", Math.abs(50 + Math.sin(deg) * 30) + "%");
                deg += 0.05;
                //console.log(deg);
            }, 30);
            $("#loadScreen").css("display", "block");
        } else {
            $("#loadScreen").css("display", "none");
            clearInterval(anim);
            anim = 0;
            //$("#waitForMe>img").css("transform","rotate(0deg)");
        }
    };
}

function FeatureStyles() {
    this.elvenCloak = {
        opacity: 0,
        fillOpacity: 0
    };
    this.subside = {
        weight: 0,
        fillColor: "#666666",
        fillOpacity: 0.4
    };
    this.hilight = {
        weight: 2,
        color: "#ffffcc",
        opacity: 0.6,
        fillColor: "#ffffcc",
        fillOpacity: 0.6
    };

    this.countryColors = {
        nepal: "#D90000",
        india: "#ccaa00",
        /*Bangladesh: "#FFBF00",*/
        sri_lanka: "#006600"
    };

    //var subsideMask = new RegionalMask(map);

//    this.getStyle = function(style) {
//        switch (style) {
//            case "elvenCloak":
//                return elvenCloak;
//            case "subside":
//                return subside;
//            case "hilight":
//                return hilight;
//            default:
//                throw new Error("Select a style");
//                break;
//        }
//    };
}

function FeatureChisel(feature) {

}
;


function HoverSettings() {


    this.featureHovered = function(e) {
        try {
            //geoJson.setStyle(elvenCloak);
            //subsideMask.setMaskGeoJSON(e.layer);
            var layerStyle = {
                fillOpacity: 0.15
            };
            //if(e.type==="mouseover"){

            e.layer.setStyle(layerStyle);
            //popup.setLatLng

            //}else if(e.type==="mouseout"){
            // e.layer.setStyle(layerStyle);
            //}
        } catch (e) {
            console.log("NEEDS REVIEW");
        }
    };

    this.featureHoveredOut = function(e) {
        try {



            e.layer.setStyle({
                fillOpacity: 0.35
            });
        } catch (e) {
            console.log("NEEDS REVIEW");
        }
    };



//    this.openPopup =  function(layer){
//        layer.openPopup();
//    }




}

function InfoBox(initObj) {
    if (!initObj)
        initObj = {};
    var closeOnBlur = inJSONKeys("closeOnBlur", initObj) ? Boolean(initObj.closeOnBlur) : true;
    var infoBox = $("<div class='panel info-box'></div>")
            .addClass(initObj.cssClass)
            .addClass(closeOnBlur ? "closeOnBlur" : "")
            .addClass(initObj.float ? "float" : "docked")
            .addClass(initObj.dock ? initObj.dock : "bottom-left")
            .addClass("hidden")
            //.append($("<a class='close trigger'><div class='icon'>X</div></a>"))
            .append($("<div class='info contents'></div>"));

    /*$(infoBox).on("click", function(e) {
     console.log(e);
     if ($(e.target).is($(infoBox).find("a.close")))
     $(infoBox).addClass("hidden");
     });*/

    /*$("<a class='close trigger'><div class='icon'>X</div></a>")
     .appendTo(infoBox)
     .click(function(e) {
     $(this).parent().addClass("hidden");
     });*/

    $(infoBox).append(new CloseButton());


    this.getInfoBox = function() {
        return infoBox;
    };
    this.setContent = function(content) {
        $(infoBox).find(".info.contents").html(content);
        if($(infoBox).find(".scale").length)
            console.log("yess!!");
    };

    this.bindTrigger = function(trigger) {
        trigger.on("click", function() {
            $(infoBox).appendTo(trigger._map._container);
        });
    };

    this.attachToContainer = function(container) {
        $(container).append(infoBox);
        /*$(container).on("click", function(e) {
         console.log(e);
         if (!$(e.target).is($(".panel.info-box").find("*:not('a.close')")))
         //setTimeout(function(){
         $(infoBox).addClass("hidden");
         //},0);
         });*/
    };

    this.unBindTrigger = function(trigger) {
        $(infoBox).remove();
    };

    this.showInfoBox = function() {
        $(infoBox).removeClass("hidden");
    };
}

function ClickSettings() {
    var popup = L.popup({
        autoPan: true,
        keepInView: true
    });
    //geoJson.bindPopup(popup);

    this.updatePopup = function(e, sandglass) {
//        console.log("updatePopup()");
//        console.log(sandglass);
        e.layer.bindPopup(popup);

        popup.setContent(sandglass);

        e.layer.openPopup();
        popup.setLatLng(e.latlng);
        popup.update();

        e.layer.once({
            popupclose: function() {
                e.layer.unbindPopup();
            }
        });



        //geoJson.openPopup();
        //popup.openOn(map);
    };

    var infoBox = new InfoBox();
    this.updateInfoBox = function(e, sandglass) {
        infoBox.setContent(sandglass);
        infoBox.attachToContainer(e.layer._map._container);
        if ($(infoBox.getInfoBox()).hasClass("hidden"))
            infoBox.showInfoBox();
    }

    this.featureClicked = function(e, sandglass) {
        //this.updatePopup(e, sandglass);
        this.updateInfoBox(e, sandglass);
    };
}


function RegionalMask(map) {
    var regionalMask = L.geoJson(null);
    var asyncID = 0;
    var deferred = $.Deferred();
    var maskStyle = {
        weight: 0,
        fillColor: "#666666",
        fillOpacity: 0.4,
        clickable: false
    };
    this.setMaskStyle = function(style) {
        maskStyle = style;
    };
    this.setMaskGeoJSON = function(geoJSON) {
        //console.log(geoJSON.features[0].geometry.coordinates[0]);
        var multiPolygon = {type: "Feature", properties: {name: "mask"}, geometry: {type: "MultiPolygon"}};
        //this.clipBoundsGeoJson = geoJSON;
        //var fnc = this;
        asyncID = setTimeout(function() {
//            var geoJsonBoundsArray = new Array();
//
            //regionalMask = geoJSON;
            //multiPolygon.type="Feature";
            //multiPolygon.geometry = {type:"MultiPolygon"};
            multiPolygon.geometry.coordinates = new Array(new Array(new Array(
                    [-180, 90],
                    [180, 90],
                    [180, -90],
                    [-180, -90]
                    )));
            console.log(multiPolygon);
//            try{
//                for(var key in geoJSON.features){
//                    multiPolygon.geometry.coordinates[0].push(
//                            geoJSON.features[key].geometry.coordinates[0]
//                            );
//                }
//            }catch(e){
            //for(var key in geoJSON.features){
            multiPolygon.geometry.coordinates[0].push(
                    geoJSON.feature.geometry.coordinates[0]
                    );
            //}
//            }
            cartomancer.multiPolygon = multiPolygon;
            //regionalMask.addData(multiPolygon);
            regionalMask.addData(multiPolygon).setStyle(maskStyle);
            console.log(multiPolygon.toSource());
            deferred.resolve();
        }, 1000);
    };
    this.clearMasks = function() {
        clearTimeout(asyncID);
        regionalMask.setData(null);
        regionalMask.on("mouseover", function() {
            map.removeLayer(this);
        });
        deferred.resolve();
    };

    deferred.done(function() {
        console.log(map);

        regionalMask.addTo(map);
    });
}



//function PopupContents(){
//
//}

function UI_TimedContent(options) {
    var content = $("<div class='timed-content'/>");
    var c = 0;
    var timer = setInterval(function() {
        content.html(options.content[c++]);
        if (c === options.content.length)
            options.repeat ? c = 0 : clearInterval(timer);
    }, options.timer);
    return content[0];
}







function SandGlass() {
    var scope = this;
    var trigger = $.Deferred();
//    var sandglass_style = {
////        width: "220px",
////        "max-height": "200px",
////        padding: "2px"
//    };


    this.BalloonTurn = function() {
        return $("<a class='prev disabled'>Prev</a><a class='next'>Next</a>");
    };







    var sandglass = $("<div class='sandglass'></div>");
    //var sand = $("<div class='sand'></div>");
    //$(sandglass).css(sandglass_style);
    //$(sand).css(sand_style);
    //$(sand).appendTo($(sandglass)).click(function() {
    //  console.log("sandglass: reload clicked!!");
    //});

    this.setTrigger = function(promise) {
        trigger = promise;
    };

    this.setContent = function(tableData) {

        $(sandglass).append(tableData);

        return scope;
    };

    trigger.done(function(tableData) {
        $(sandglass).remove(".sand").append(tableData);
    });

    this.getSandGlass = function() {
        //console.log($(sandglass));
        return $(sandglass)[0];
    };
    return this;
}

function Sand(promise, replacement) {
    var animID;
    var t = 0;
    var sandHTML = $("<div class='sand'><div class='sand-grain'/></div>");
    var startAnim = function() {
        return setInterval(function() {
            $(sandHTML).find(".sand-grain").cssByFunction(function() {
                return {
                    "margin-left": function() {
                        return 100 + 100 * Math.sin(t);
                    }
                };
            });
            t += 0.3;
        }, 60);
    };

    var setResolveAction = function() {
        promise.done(function(jsonObj) {
            clearInterval(animID);
            $(sandHTML).replaceWith(typeof replacement === "function" ? replacement.call(this, jsonObj) : replacement);
        });
    };

    if (promise)
        setResolveAction();

    this.getSand = function() {
        animID = startAnim();
        return sandHTML;
    };

    this.setDeferred = function(deferred) {
        promise = deferred;
        setResolveAction();
    };

    this.setReplacement = function(replacementHTML) {
        replacement = replacementHTML;
    };
}
/**
 function PopupContent(summaryTable) {
 var deferred = $.Deferred();
 //axd=summaryTable;

 if (!$("#popupContent").find(".pointer.avg").length) {
 $("#popupContent").find(".scale").append(function() {
 var scale = $(this).parent(".nonpersistant").attr("class").replace("nonpersistant", "");
 scale = scale.replace("min", "");
 scale = scale.replace("max", "");
 scale = scale.replace("minmax", "");
 scale = scale.replace("bool", "");
 scale = scale.replace("visible", "");
 scale = scale.replace(/ /g, "");
 var scaleSize = $(this).outerWidth();
 var scaleAvg = 220 * summaryTable[scale] / 10;
 console.log(scaleSize);
 console.log(summaryTable[scale]);
 return $("<div class='pointer avg'></div>").css({
 "margin-left": scaleAvg
 });
 });
 }
 var popupContent = $("#popupContent");
 var popupContent = $("<div class='popupContent'></div>").append(popupContent.html());
 deferred.resolve();
 this.getPopupContent = function() {
 //return document.getElementById("#popupContent");
 return popupContent[0];
 };
 this.getPromise = function() {
 return deferred.promise();
 };

 }
 **/




/**
 function PopupContent(waterParams, metaWaterParams, onePage) {
 var deferred = $.Deferred();
 var c = 0;
 //axd=summaryTable;
 var contentDiv = $("<div class='info-container'></div>");

 for(var key in metaWaterParams){

 $("<div class='item description meta-info persistent'></div>")
 .appendTo(contentDiv)
 .append(function(){

 if(metaWaterParams[key]==="image"){
 elementHTML = "<a class='icon'><img alt='Photo loading..'></img></a>";
 }else{
 var elementHTML = "<h4>"+key.replace(/_/g," ")+"</h4>";
 //var elementHTML = "<h4>"+metaWaterParams[key]+"</h4>";
 }

 return $(elementHTML);
 })
 .addClass(key);
 }
 for(var key in waterParams){

 $("<div class='item description scale-container'></div>")
 .appendTo($(contentDiv))
 .append(function(){

 var elementHTML = "<h4 class='scale-name'>"+key.replace(/_/g, " ")+": </h4> <div class='scale'></div>";
 //var elementHTML = "<h4 class='scale-name'>"+key+": </h4> <div class='scale'></div>";

 return $(elementHTML);
 })
 .attr(function(){

 var attrPairs = {type:key};
 for(var innerKey in waterParams[key]){
 attrPairs[innerKey] = waterParams[key][innerKey];
 }

 return attrPairs;

 }())
 .addClass(function(){
 if(onePage) return;
 var className = "nonpersistent";
 className += (c++ < 3)? " visible": "";
 return className;
 });
 }


 this.setPopupContent = function(summaryTable){

 if (!$(contentDiv).find(".pointer.agg").length) {
 $(contentDiv).find(".scale").append(function() {
 var scale = $(this).parent().attr("type");
 var scaleSize = $(this).outerWidth();
 var scaleAgg = 220 * summaryTable[scale] / 10;
 console.log(scaleSize);
 console.log(summaryTable[scale]);
 return $("<div class='pointer agg'></div>").css({
 "margin-left": scaleAgg
 });
 });
 }

 deferred.resolve();
 };

 //    var popupContent = $("#popupContent");
 //    var popupContent = $("<div class='popupContent'></div>").append(popupContent.html());

 this.getPopupContent = function() {
 //return document.getElementById("#popupContent");
 return contentDiv[0];
 };
 this.getPromise = function() {
 return deferred.promise();
 };

 }
 **/

function InfoStylingRules() {
    var infoStylingRules = {
        ph: {
            intro: "pH is the scale used to measure the acidity of water.",
            gradientColors: ["#f00", ["#ff0", "good-min"], "#0f0", ["#ff0", "good-max"], "#f00"]
        },
        dissolved_oxygen: {
            intro: "Dissolved Oxygen is a measure of how much oxygen is dissolved in water.it is a key indicator of water quality.",
            gradientColors: ["#0f0", ["#ff0", "good-min"], "#ff0", "#f00"]
        },
        temperature: {
            intro: "Arsenic is a naturally occuring element in the Earth's crust.",
            gradientColors: ["#aaa", ["#aaa", "cool"], "#aaa", "#aaa", ["#aaa", "warm"]]
        },
        turbidity: {
            intro: "Turbidity is a measure of the water’s lack of clarity.",
            gradientColors: ["#0f0", ["#ff0", "good-max"], "#f00"]
        },
        biochemical_oxygen_demand: {
            intro: "BOD, or Biochemical Oxygen Demand is used as a measure of the degree of water pollution. BOD is the amount of oxygen required by aerobic micro-organisms to decompose the organic matter in a sample of water, such as that polluted by sewage.",
            gradientColors: ["#ff0", ["#0f0", "good-min"], ["#ff0", "good-max"], "#f00"]
        },
        nitrate: {
            intro: "Nitrate is an essential nutrient for aquatic plants and animals and is the form in which plants utilise nitrogen.",
            gradientColors: ["#f00", ["#0f0", "good-min"], ["#ff0", "good-max"], "#f00"]
        },
        phosphate: {
            intro: "Phosphorus is essential for plant growth and metabolic reactions in animals and plants.",
            gradientColors: ["#f00", ["#0f0", "good-min"], ["#ff0", "good-max"], "#f00"]
        },
        benthic_macroinvertebrates: {
            intro: "Benthic macroinvertebrates are animals without backbones, that are visible with the naked eye, living on the bottoms of streams, river, lakes, and ponds."
        },
        coliform_bacteria: {
            intro: "Coliform Bacteria are rod-shaped bacteria found in the intestinal tract of humans and other animals. Its presence in water indicates fecal contamination and can cause diarrhea and other dysenteric symptoms."
        }
    };

    this.getInfoStylingRules = function() {
        return infoStylingRules;
    };
}








function CSSGradient(colorStops) {

    if (typeof colorStops === "function")
        colorStops = colorStops.call();

    var gradArray = [];
    var gradAngle = 90;

    this.setAngle = function(aDeg) {
        gradAngle = aDeg;
        return this;
    };

    for (var cs in colorStops) {
        if (typeof colorStops[cs] === "string")
            gradArray.push(colorStops[cs]);
        else
            gradArray.push(colorStops[cs][0] + " " + colorStops[cs][1] + "%");
    }


//TODO://
//    this.getRadialGradient = function(){
//
//    };
//      this.scaleMidRange = function(scaleFactor){
//
//      };
//:TODO//

    this.getLinearGradient = function() {
        return "linear-gradient(" + gradAngle + "deg, " + gradArray.join() + ")";
    };

}

function VisualizationFunctions() {
    var fnDefnObj = {
        ph: function(scaleStylingRules, paramsTable) {

            var scale = "ph";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 14;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange,
                                "good-max": 100 * ($(this).attr("good-max")) / scaleRange

                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }
                };

            });

        },
        dissolved_oxygen: function(scaleStylingRules, paramsTable) {

            var scale = "dissolved_oxygen";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 18;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }
                };

            });

        },
        temperature: function(scaleStylingRules, paramsTable) {

            $(this).closest(".scale-container").find(".scale-name").text("arsenic");

            var scale = "temperature";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 40000;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 50000;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            //scaleRange = 50;

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "cool": 100 * ($(this).attr("cool")) / scaleRange,
                                "warm": 100 * ($(this).attr("warm")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }

                };

            });
        },
        biochemical_oxygen_demand: function(scaleStylingRules, paramsTable) {

            var scale = "biochemical_oxygen_demand";

            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 18;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange,
                                "good-max": 100 * ($(this).attr("good-max")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }

                };

            });
        },
        nitrate: function(scaleStylingRules, paramsTable) {

            var scale = "nitrate";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 5;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange,
                                "good-max": 100 * ($(this).attr("good-max")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }

                };

            });


        },
        phosphate: function(scaleStylingRules, paramsTable) {

            var scale = "phosphate";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 5;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange,
                                "good-max": 100 * ($(this).attr("good-max")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }

                };

            });

        },
        count_schools: function(scaleStylingRules, paramsTable) {

        },
        count_testPoints: function(scaleStylingRules, paramsTable) {

        },
        coliform_bacteria_positive: function(scaleStylingRules, paramsTable) {

        },
        coliform_bacteria_negative: function(scaleStylingRules, paramsTable) {

        },
        benthic_macroinvertebrates_positive: function(scaleStylingRules, paramsTable) {

        },
        benthic_macroinvertebrates_negative: function(scaleStylingRules, paramsTable) {

        },
        turbidity: function(scaleStylingRules, paramsTable) {

            var scale = "turbidity";
            var scaleSize = $(this).outerWidth();
            var unimax, unimin;
            var scaleRange = $(this).closest(".scale-container")
                    .excecuteOnEach(function() {
                        unimin = $(this).attr("min");
                        unimin = unimin ? unimin : 0;
                        unimax = $(this).attr("max");
                        unimax = unimax ? unimax : 5;
                        return unimax - unimin;
                    }
                    )[0];

            $(this).closest(".scale-container").attr("title", scaleStylingRules.intro);

            $(this).append(function() {

                return (paramsTable[scale] && Number(paramsTable[scale]) >= unimin && Number(paramsTable[scale]) <= unimax) ? $("<div class='pointer agg'></div>").cssByFunction(function() {

                    return {
                        "margin-left": function() {
                            return scaleSize * paramsTable[scale] / scaleRange;
                        }
                    };
                }) : function(context){ 	$(context).addClass("not-available"); 	return $("<div class='msg reading-erroneous'>Not Available</div>"); }(this);
            });

            $(this).cssByFunction(function() {
                return {
                    "background": function() {

                        var colorStops = {};
                        var gradArray = [];

                        $(this).closest(".scale-container").excecuteOnEach(function() {
                            colorStops = {
                                "good-min": 100 * ($(this).attr("good-min")) / scaleRange,
                                "good-max": 100 * ($(this).attr("good-max")) / scaleRange
                            };
                        });

                        for (var cs in scaleStylingRules.gradientColors) {
                            if (typeof scaleStylingRules.gradientColors[cs] === "string")
                                gradArray.push(scaleStylingRules.gradientColors[cs]);
                            else
                                gradArray.push(new Array(scaleStylingRules.gradientColors[cs][0], colorStops[scaleStylingRules.gradientColors[cs][1]]));
                        }

                        return new CSSGradient(gradArray).getLinearGradient();
                    }

                };

            });
        },
        coliform_bacteria: function(scaleStylingRules, paramsTable) {
            var scale = "coliform_bacteria";
            var vizbox = $(this).closest(".scale-container");

            vizbox.attr("title", scaleStylingRules.intro);

            vizbox.find(".scale").remove();
            vizbox.append(function() {
                if(!(typeof paramsTable[scale]==="string" || typeof paramsTable[scale]==="number")) {
                    //Object.keys(paramsTable[scale]).length;
                    return "<div class='frequency-scale'>Present in " + paramsTable[scale].present + " out of " + Number(paramsTable[scale].present + paramsTable[scale].absent) + " samples.</div>";
                }else {
                    switch (paramsTable[scale]) {
                        case "1":
                            return "<div class='frequency-scale'>Present</div>";
                        case "0":
                            return "<div class='frequency-scale'>Absent</div>";
                        case "127":
                            return "<div class='frequency-scale'>Not Available</div>";
                    }
                }
            });
        },
        benthic_macroinvertebrates: function(scaleStylingRules, paramsTable) {
            var scale = "benthic_macroinvertebrates";
            var vizbox = $(this).closest(".scale-container");

            vizbox.attr("title", scaleStylingRules.intro);

            vizbox.find(".scale").remove();
            vizbox.append(function() {
                if(!(typeof paramsTable[scale]==="string" || typeof paramsTable[scale]==="number")) {
                    //Object.keys(paramsTable[scale]).length;
                    return "<div class='frequency-scale'>Present in " + paramsTable[scale].present + " out of " + Number(paramsTable[scale].present + paramsTable[scale].absent) + " samples.</div>";
                }else {
                    switch (paramsTable[scale]) {
                        case "1":
                            return "<div class='frequency-scale'>Present</div>";
                        case "0":
                            return "<div class='frequency-scale'>Absent</div>";
                        case "127":
                            return "<div class='frequency-scale'>Not Available</div>";
                    }
                }
            });
        },
        color: function(scaleStylingRules, paramsTable) {
            $(this).closest(".scale-container").remove();
        }
    };

    this.getFunctionDefinitionsObject = function() {
        return fnDefnObj;
    };
}

function ParameterLabels() {
    var countrySummary = {
        count_cities: {label: "Participant cities: ", sort: 0},
        count_schools: {label: "Participant schools: ", sort: 1},
        count_testPoints: {label: "Water sources surveyed: ", sort: 2}
    };
    var citySummary = {
        count_schools: {label: "Participant schools: ", sort: 1},
        count_testPoints: {label: "Water sources surveyed: ", sort: 2}
    };
    var testPointDetails = {
        date: {label: "Test Date: ", sort: 2},
        /*school: {label: "Test carried out by students from: ", sort: 1},*/
        decription: {label: "Description", sort: 3},
        photo: {sort: 0}
    };

    this.getParameterLabels = function(params) {
        switch (params.function) {
            case "getSummary":
                if (params.type === "country")
                    return countrySummary;
                else if (params.type === "city")
                    return citySummary;
                break;
            case "getTestPointDetails":
                return testPointDetails;
                break;
        }
    };
}



function PopupContent(paramsTable, waterParams, paramsTableRows, onePage) {

    var constructorDeferred = $.Deferred();

//    this.constructed = function() {
//        return constructorDeferred.promise();
//    };
    /**move this code**/

    /*var paramsTableRows = {
     count_cities: {label: "Number of participant cities: ", sort: 0},
     count_schools: {label: "Number of participant schools: ", sort: 1},
     count_testPoints: {label: "Number of water sources surveyed: ", sort: 2}
     };*/

    var infoStylingRules = new InfoStylingRules().getInfoStylingRules();
    $.extend(true, infoStylingRules, waterParams);
    /****/
    var fnDefnObj = new VisualizationFunctions().getFunctionDefinitionsObject();







    var c = 0;
    var contentDiv = $("<div class='info-container'></div>");

    /*for (var key in metaWaterParams) {

     $("<div class='item description meta-info persistent'></div>")
     .appendTo(contentDiv)
     .append(function() {

     if (metaWaterParams[key] === "image") {
     elementHTML = "<a class='icon'><img alt='Photo loading..'></img></a>";
     } else {
     var elementHTML = "<h4>" + key.replace(/_/g, " ") + "</h4>";
     //var elementHTML = "<h4>"+metaWaterParams[key]+"</h4>";
     }

     return $(elementHTML);
     })
     .addClass(key);
     }*/
    for (var key in paramsTable) {
        if (inJSONKeys(key, waterParams)) {
            $("<div class='item description scale-container'></div>")
                    .appendTo($(contentDiv))
                    .append(function() {

                        var elementHTML = "<h4 class='scale-name'>" + key.replace(/_/g, " ") + ": </h4> <div class='scale'></div>";
                        //var elementHTML = "<h4 class='scale-name'>"+key+": </h4> <div class='scale'></div>";

                        return $(elementHTML);
                    })
                    .attr(function() {

                        var attrPairs = {type: key};
                        for (var innerKey in waterParams[key]) {
                            attrPairs[innerKey] = waterParams[key][innerKey];
                        }
                        if(typeof paramsTable[key]==="string" || typeof paramsTable[key]==="number")attrPairs["parameter-value"] = paramsTable[key];

                        return attrPairs;

                    }())
                    .addClass(function() {
                        if (onePage)
                            return;
                        var className = "nonpersistent";
                        className += (c++ < 3) ? " visible" : "";
                        return className;
                    });
        } else {
            try {
                $("<div class='item description meta-info persistent'></div>")
                        .appendTo(contentDiv)
                        .append(function() {
                            var elementHTML;
                            if (key === "photo") {
                                elementHTML = $("<a><div class='testpoint-thumbnail' style='background-image: url(https://ona.io/attachment/medium?media_file=ktmlabs/attachments/" + paramsTable[key] + ");'></div></a>")/*.prepend(
                                 new UI_TimedContent({
                                 content: [
                                 "Image not Available"
                                 //,"Image not Available"
                                 ],
                                 timer: 5000
                                 }))*/;
                            } else if (key === "country") {
                                elementHTML = "<a class='title'>" + paramsTable[key] + "</a>";
                            }
                            else {
                                //var elementHTML = "<h4>" + key.replace(/_/g, " ") + "</h4>";
                                //var elementHTML = "<h4>"+metaWaterParams[key]+"</h4>";
                                elementHTML = "<h4>" + paramsTableRows[key].label + paramsTable[key] + "</h4>";
                            }

                            return $(elementHTML);
                        })
                        .addClass(key)
                        .attr("sort", paramsTableRows[key].sort);
            } catch (e) {
                console.log(e);
            }

        }
    }


    //this.setPopupContent = function(paramsTable) {


    //$(contentDiv).find(".scale").functionByAttribute(fnDefnObj, paramsTable);

    /*$(contentDiv).find(".scale").load(function(){
     $(this).functionByAttribute(fnDefnObj, paramsTable);
     });*/

    setTimeout(function() {
        $(contentDiv).find(".persistent").sortByAttribute("sort").prependTo(contentDiv);
        $(contentDiv).find(".scale").functionByAttribute(fnDefnObj, infoStylingRules, paramsTable);
    }, 0);



    //};

    this.getPopupContent = function() {
        return contentDiv[0];
    };
    this.getConstructorState = function() {
        return constructorDeferred.promise();
    };



    constructorDeferred.resolve();

}



function UI_Button(initObj) {
    var button = $("<a></a>");
    //$(button).addClass(initObj.class? initObj.class:"");
    if (initObj) {
        $(button).attr(function() {
            var attrObj = {};
            for (var attr in initObj.attributes) {
                attrObj[attr] = initObj.attributes[attr];
            }
            _attr = attrObj;
            return attrObj;
        }());
        for (var event in initObj.eventHandlers) {
            $(button).on(event, initObj.eventHandlers[event]);
        }
        $(typeof initObj.content === "function" ? initObj.content.call() : initObj.content).appendTo(button);
    }

    return button;
}

var CloseButton = function() {
    return new UI_Button({
        attributes: {
            class: "close trigger"
        },
        eventHandlers: {
            click: function(e) {
                $(this).parent().addClass("hidden");
            }
        },
        content: "<div class='icon'>X</div>"
    });
};


function CompareButton() {
    return L.control.extend({
        options: {
            position: "topleft"
        },
        onAdd: function(map) {
            var compareButton = L.DomUtil.create("div", "map-control");
            /*$(compareButton).append(new UI_Button({
             attributes: {
             class: "trigger"
             },
             content: function() {
             return $("<h4>Compare</h4>");
             },
             eventHandlers: {
             click: function() {
             $("#splashScreen").removeClass("hidden");
             }
             }
             }));
             console.log("hello");*/
            return compareButton;
        }
    });
}

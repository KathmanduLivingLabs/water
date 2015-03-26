config = {
    api: "http://www.kathmandulivinglabs.org/wash-mock/api.php",
    osmAPI: {
        url: "http://overpass-api.de/api/interpreter",
        /*schoolQueryPrefix: function(tags){

            var vS = "";
            for(var v in tags.v){
                vS += tags.v[v];
                if(v<tags.v.lengh-1) vS+= "|";
            }

            return "data=[out:json];(way['"+tags.k+"'~'"+vS+"'](";
        },*/
        schoolQuerySuffix: "););out meta qt;",
        /*schoolQueryMiddle: function(tags){

            var vS = "";
            for(var v in tags.v){
                vS += tags.v[v];
                if(v<tags.v.lengh-1) vS+= "|";
            }

            return ");node(w);node['"+tags.k+"'~'"+vS+"'](";
        }*/
    }
};

/**
 //L.geoJson.prototype.convertLineStringToPolygon = function(){
 //    var geoJsonFeatures = this.getLayers();
 //    for(var i=0; i<geoJsonFeatures.length; i++){
 //        geoJsonFeatures[i].feature.geometry.coordinates
 //                =  new Array(geoJsonFeatures[i].feature.geometry.coordinates);
 //        //this.removeLayer(this.getLayerId(geoJsonFeatures[i]));
 //        this.addLayer(geoJsonFeatures[i]);
 //    }
 //    return this;
 //}
 **/

function convertLineStringToPolygon(geoJson) {
    var LineStrings = geoJson.features;
    for (var i = 0; i < LineStrings.length; i++) {
        if (!LineStrings[i].geometry.coordinates[0][0][0]) {
            LineStrings[i].geometry.type = "Polygon";
            LineStrings[i].geometry.coordinates = new Array(LineStrings[i].geometry.coordinates);
        }
    }
    geoJson.features = LineStrings;
    return geoJson;
}


$.fn.selectFirstNItems = function(n) {
    var sel = new Array();
    for (var c = 0; c < n; c++) {
        sel.push($(this)[c]);
    }
    return $(sel);
};

$.fn.selectLastNItems = function(n) {
    var sel = new Array();
    for (var c = n - 1; c >= 0; c--) {
        sel.push($(this)[c]);
    }
    return $(sel);
};

$.fn.cssByFunction = function(fn) {
    return $(this).each(function() {
        $(this).css(fn.call(this));
    });
};

$.fn.functionByAttribute = function(fnDefnObj, scaleStylingRules, paramsTable) {

    return $(this).each(function() {

        if ($(this).find(".pointer").length)
            return;
        try {
            fnDefnObj[$(this).closest(".scale-container").attr("type")].call(this, scaleStylingRules[$(this).closest(".scale-container").attr("type")], paramsTable);
        } catch (e) {
            console.log("function not defined for water parameter: " + $(this).closest("[type]").attr("type"));
            console.log(e);
        }
    });
};

$.fn.excecuteOnEach = function(fn) {
    var arr = new Array();
    this.each(function() {
        arr.push(fn.call(this));
    });
    return $(arr);
};

$.fn.sortByAttribute = function(attr, sortFn) {
    var sortedArray = [];
    var sortKeyArray = [];

    if (typeof sortFn === "function") {
        sortKeyArray = sortFn.call();
    } else if (sortFn) {
        sortKeyArray = sortFn;
    } else {
        $(this).each(function() {
            sortKeyArray.push($(this).attr(attr));
        });
        sortKeyArray.sort();
    }

    for (var key in sortKeyArray) {
        sortedArray.push($(this).filter("[" + attr + "=" + sortKeyArray[key] + "]")[0]);
    }

    return $(sortedArray);
};

function inJSONKeys(txt, jsonObj) {
    for (var key in jsonObj) {
        if (key === txt)
            return true;
    }
    return false;
}

function configInit() {
    $.ajax({
        url: "params.json",
        success: function(data) {
            waterParams = data;
        }
    });
}

function boundsToPolyString(bounds) {
    return "poly:'" +
            bounds._southWest.lat + " " +
            bounds._southWest.lng + " " +
            bounds._southWest.lat + " " +
            bounds._northEast.lng + " " +
            bounds._northEast.lat + " " +
            bounds._northEast.lng + " " +
            bounds._northEast.lat + " " +
            bounds._southWest.lng +
            "'";
}


cartomancerGlobals = {type: "global"};

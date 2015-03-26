function CSSGradient(colorStops) {

    if(!$("body").find("#svgGradientContainer").length)
        $("body").append("<div id='svgGradientContainer' style='display:none;'></div>");

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
            console.log("..");
            //gradArray.push(colorStops[cs]);
        else
            gradArray.push("<stop offset='"+colorStops[cs][1] + "%' stop-color='"+colorStops[cs][0]+"'/>");
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
        //alert("IE9");
        var gradID;
        //$("#svgGradientContainer").append(function(){
            gradID = "linear-gradient";//+$(this).find("svg").length;
            //var grad = ["<?xml version='1.0'?><svg id='"+gradID+"_svg' width='100%' height='100%'><defs><linearGradient id='"+gradID+"' x1='0%' y1='0%' x2='100%' y2='0%'>" + gradArray.join(" ") + "</linearGradient></defs><rect width='100%' height='100%' fill='url(#"+gradID+")'/></svg>"];
            //var grad = ["<?xml version='1.0'?><svg id='"+gradID+"_svg' width='100%' height='100%'><defs><linearGradient id='"+gradID+"' x1='0%' y1='0%' x2='100%' y2='0%'>" + "<stop offset='0%' stop-color='#f00' stop-opacity='1'/><stop offset='100%' stop-color='#00f' stop-opacity= '1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#"+gradID+")'/></svg>"]
        //});

        var grad = "<svg  width='100%' height='100%'><defs><linearGradient id='gradID' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stop-color='#f00' stop-opacity='1'/><stop offset='100%' stop-color='#00f' stop-opacity= '1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#gradID)'/></svg>";

          return "url(php/gradients.php?svg="+grad+")";
    };

}

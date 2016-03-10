/*
    Author	: Ashish Kumar
    App		: CSS Minifier | Beautifier
    Version	: 2.1 (Un-compressed)
    Date	: Feb 18, 2014

    Last Modified: 21/02/2014
    Note	: HEX Color Optimization
*/
(function (Doc) {
    "use strict";

    var doc = Doc,
        GE = function (id) {
            return doc.getElementById(id);
        },
        btn = GE("btn"),
        radioMinify = GE("minify"),
        radioBeautify = GE("beautify"),
        optionMinify = GE("minifyOptions"),
        optionBeautify = GE("beautifyOptions"),

        checkNewLineSelector = GE("newlineBlocks"),
        checkSpace = GE("space"),
        checkNewLineProp = GE("newlineRules"),
        checkIndention = GE("indention"),
        checkComments = GE("removeComments"),
        sign = "/*CSS Optimized by: CSS Beautifer, KumarAshish.com*/\n";
    
    var $el = {
        btn :GE("btn"),
        radioMinify :GE("minify"),
        radioBeautify :GE("beautify"),
        optionMinify :GE("minifyOptions"),
        optionBeautify :GE("beautifyOptions"),

        checkNewLineSelector :GE("newlineBlocks"),
        checkSpace :GE("space"),
        checkNewLineProp :GE("newlineRules"),
        checkIndention :GE("indention"),
        checkComments :GE("removeComments"),
        
        form: GE("dataform")
    };
    
    function setAction(isMinify){
        $el.optionMinify.style.height = isMinify ? "70px" : 0;
        $el.optionBeautify.style.height = isMinify ? 0 :"70px";

        $el.checkNewLineSelector.checked = !!isMinify;
        $el.checkSpace.checked = !isMinify;
        $el.checkNewLineProp.checked = !isMinify;
        $el.checkIndention.checked = !isMinify;

        $el.checkComments.checked = !!isMinify;
        $el.checkComments.disabled = !!isMinify;

        $el.btn.value = isMinify ? "Minify It!" : "Beautify It!";
    }

    // Choosing options
    radioMinify.onclick = function () {
        setAction(true);
    };

    radioBeautify.onclick = function () {
        setAction();
    };

    // Do Action
    $el.form.onsubmit = function (event) {

        var inputStr = GE("cssIn").value.trim(),
            regToClear = /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g,
            cssArray,
            uncompress = $el.checkNewLineProp.checked,
            indention = $el.checkIndention.checked,
            newlineBlocks = $el.checkNewLineSelector.checked,
            doSorting = GE("sort").checked,
            removeComments = $el.checkComments.checked,
            gtracker = $el.radioMinify.checked ? "Minify" : "Beautify",

            regHexColor = /#([A-Fa-f0-9]{6})/gi, ///^#([A-Fa-f0-9]{6})$/,
            regLongColor = /([a-fA-F,0-9])\1/gi;

        // Removing Comments, Newlines, Tabs
        if (removeComments) {
            inputStr = inputStr.replace(regToClear, "");
        }

        cssArray = inputStr.split("}");

        // Removing Empty Blocks
        cssArray = cssArray.filter(function (val) {
            return val.trim().length;
        });

        // Looping CSS
        cssArray = cssArray.map(function (css) {
            var selector,
                props,
                outputBlock;

            // Validation
            if (css.indexOf("{") === -1) {
                console.error("Invalid CSS found!");
                return;
            }

            css = css.split("{");
            selector = css[0].trim();
            props = css[1].trim();

            // Validation
            if (!selector.length) {
                console.error("CSS written withoud any Selector!");
                return;
            } else if (!props.length) {
                console.info(selector + " : Empty CSS block!");
                return;
            }

            // Looping Properties
            props = props.split(";").filter(function (val) {
                return val.trim().length;
            });

            props = props.map(function (cssLine) {
                var cssProp,
                    cssVal,
                    colonIndex = cssLine.indexOf(":"),
                    colors;

                // Validation
                if (colonIndex === -1) {
                    console.error("CSS Syntax Error, probably you missed to put COLON there!");
                    return;
                }

                cssProp = cssLine.substring(0, colonIndex).trim();
                cssVal = cssLine.substring(colonIndex + 1).trim();

                // Optimizing Hex Color
                colors = cssVal.match(regHexColor) || [];
                colors.forEach(function (val, i, arr) {
                    var clr = val.toUpperCase();

                    if (clr.match(regLongColor)) {
                        if (/#([A-Fa-f0-9]{6})/gi.test(clr) && (clr.match(regLongColor).length == 3)) {
                            clr = "#" + clr[1] + clr[3] + clr[5];
                            cssVal = cssVal.replace(val, clr);
                        }
                    }
                });

                if (indention) cssProp = "\t" + cssProp;

                return cssProp + ":" + (checkSpace.checked ? " " : "") + cssVal;
            });

            if (doSorting) props.sort();

            // Creating Output for each Block
            outputBlock = selector + "{";

            if (uncompress) {
                outputBlock += "\n" + props.join(";\n") + "\n" + "}\n";
            } else {
                outputBlock += props.join(checkSpace.checked ? "; " : ";") + "}";
            }

            //console.log(outputBlock);
            return outputBlock;
        });

        // Output
        GE("cssOut").value = sign + cssArray.join(newlineBlocks ? "\n" : "");

        // GA
        //_gaq.push(['_trackEvent', 'Buttons', "Submit", gtracker]);

        // Preventing Default Form Submission
        event.preventDefault();
    };

    return null;
})(document);
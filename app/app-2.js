/*
    Author	: Ashish Kumar
    App		: CSS Minifier | Beautifier
    Version	: 3.0 (Un-compressed)
    Date	: Mar 10, 2016

    Last Modified: Mar 10, 2016
    Note	: Revamping
*/
(function (document) {
    "use strict";

    var utils = {
            $ge: function (id) {
                return document.getElementById(id);
            },
            removeComments: function (cssString) {
                var regexp = /\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g;
                return cssString.replace(regexp, "");
            },
            removeEmptyBlocks: function (cssArray) {
                return cssArray.filter(function (val) {
                    return val.trim().length;
                });
            },
            splitProps: function (propStr) {
                // Looks if a property has a value too
                return propStr.split(";").filter(function (val) {
                    return val.trim().length;
                });
            },
            optimizeColors: function (cssVal) {
                var regHexColor = /#([A-Fa-f0-9]{6})/gi,
                    regLongColor = /([a-fA-F,0-9])\1/gi,
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
                
                return cssVal;
            },
            processProps: function (props) {
                return props.map(function (cssLine) {
                    var cssProp,
                        cssVal,
                        colonIndex = cssLine.indexOf(":");

                    // Validation
                    if (colonIndex === -1) {
                        console.error("CSS Syntax Error, probably you missed to put COLON there!");
                        return;
                    }

                    // prop vs val
                    cssProp = cssLine.substring(0, colonIndex).trim();
                    cssVal = cssLine.substring(colonIndex + 1).trim();

                    // Optimize Color values
                    cssVal = utils.optimizeColors(cssVal);

                    // Put Indentation
                    if ($el.check.keepIndent) {
                        cssProp = "\t" + cssProp;
                    }

                    return cssProp + ":" + ($el.check.putSpace.checked ? " " : "") + cssVal;
                });
            }
        },
        $el = {
            radio: {
                minify: utils.$ge("minify"),
                beautify: utils.$ge("beautify")
            },
            check: {
                putNewLineBlocks: utils.$ge("newlineBlocks"),
                putSpace: utils.$ge("space"),
                putNewLineProp: utils.$ge("newlineRules"),
                keepIndent: utils.$ge("indention"),
                removeComments: utils.$ge("removeComments")
            },
            field: {},
            button: utils.$ge("btn"),
            form: utils.$ge("app")
        },
        options = {};

    // Main Functions
    function processIt(e) {
        var input = utils.$ge("cssIn").value.trim(),
            cssArray,
            sign = "/*CSS Optimized by: CSS Beautifer, KumarAshish.com*/\n";

        // Remove Comments
        if ($el.check.removeComments.checked) {
            input = utils.removeComments(input);
        }

        // Break CSS into Array
        cssArray = input.split("}");

        // Remove Empty Blocks
        cssArray = utils.removeEmptyBlocks(cssArray);

        // Process Each CSS Block
        cssArray = cssArray.map(function (cssBlock) {
            var selector,
                props,
                outputBlock;

            // Validation
            if (cssBlock.indexOf("{") === -1) {
                console.error("Invalid CSS found!");
                return;
            }

            //
            cssBlock = cssBlock.split("{");
            selector = cssBlock[0].trim();
            props = cssBlock[1].trim();

            // Validation
            if (!selector.length) {
                console.error("CSS written withoud any Selector!");
                return;
            } else if (!props.length) {
                console.info(selector + " : Empty CSS block!");
                return;
            }

            // Break Properties into a list
            props = utils.splitProps(props);

            // Process CSS by Properties
            props = utils.processProps(props);

            // Sort Properties
            if (utils.$ge("sort").checked) {
                props.sort();
            }

            // Creating Output for each Block
            outputBlock = selector + "{";

            // Combine it all together
            if ($el.check.putNewLineProp.checked) {
                outputBlock += "\n" + props.join(";\n") + "\n" + "}\n";
            } else {
                outputBlock += props.join($el.check.putSpace.checked ? "; " : ";") + "}";
            }
            
            return outputBlock;
        });

        // Output
        utils.$ge("cssOut").value = sign + cssArray.join($el.check.putNewLineBlocks ? "\n" : "");

        e.preventDefault();
    }

    // Toggle Options - Minify vs Beautify
    function setAction(isMinify) {

        // Toggle Settings
        utils.$ge("minifyOptions").style.height = isMinify ? "70px" : 0;
        utils.$ge("beautifyOptions").style.height = isMinify ? 0 : "70px";

        // Set Defaults
        $el.check.putNewLineBlocks.checked = !!isMinify;
        $el.check.putSpace.checked = !isMinify;
        $el.check.putNewLineProp.checked = !isMinify;
        $el.check.keepIndent.checked = !isMinify;
        $el.check.removeComments.checked = !!isMinify;
        $el.check.removeComments.disabled = !!isMinify;

        // Update Button Text
        $el.button.value = isMinify ? "Minify It!" : "Beautify It!";
    }

    // Event Bindings
    $el.form.onsubmit = processIt;
    $el.radio.minify.onclick = function () {
        setAction(true);
    };
    $el.radio.beautify.onclick = function () {
        setAction(false);
    };


})(document);
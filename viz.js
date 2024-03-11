//Getting the value from the textbox

document.addEventListener("DOMContentLoaded", process);

function process() {
  var selectButton = document.querySelector(".btn");
  // console.log(selectButton);
  selectButton.addEventListener("click", makeTree);
}
function makeTree(event) {
  // Remove and Edit incase of a new event
  d3.selectAll("rect").remove();
  // d3.selectAll(".link-nodes").remove();
  d3.selectAll("g").remove();
  d3.selectAll(".label-sankey").remove();
  var updateText = document.querySelector("#flow_label");
  updateText.textContent = "Character flow for ...";

  // d3.selectAll("rect").remove();
  var text = document.getElementById("wordbox").value;
  var countObject = {};
  var beforeAfter = {};
  // Making sequence object for the text
  for (var i = 97; i < 123; i++) {
    var c = String.fromCharCode(i);
    beforeAfter[c] = [];
    countObject[c] = 0;
  }
  // adding the special characters - .,!?:;
  beforeAfter["."] = [];
  beforeAfter[","] = [];
  beforeAfter["!"] = [];
  beforeAfter["?"] = [];
  beforeAfter[";"] = [];
  beforeAfter[":"] = [];
  countObject["."] = 0;
  countObject[","] = 0;
  countObject["!"] = 0;
  countObject["?"] = 0;
  countObject[":"] = 0;
  countObject[";"] = 0;
  //Omit spaces
  // -----------------------------------
  // No Capital letter are allowed
  // Update: Caps can be used as an input but will be ocnverted to lowercase
  text = omitspaces(text);
  for (var i = 0; i < text.length; i++) {
    countObject[text[i].toLowerCase()] += 1;
    if (i == 0 && text.length > 1) {
      var c = "_" + text[i + 1].toLowerCase();
      beforeAfter[text[i].toLowerCase()].push(c);
    } else if (i == text.length - 1 && text.length > 1) {
      var c = text[i - 1].toLowerCase() + "_";
      beforeAfter[text[i].toLowerCase()].push(c);
    } else if (text.length == 1) {
      console.log("No before and after");
    } else {
      var c = text[i - 1].toLowerCase().concat(text[i + 1].toLowerCase());
      beforeAfter[text[i].toLowerCase()].push(c);
      // console.log(text[i]);
    }
  }
  //Making JSON
  var jsonData = {};
  jsonData["children"] = [];
  var vowels = {};
  vowels["name"] = "vowels";
  vowels["children"] = [];
  vowels["colname"] = "level2";
  var consonants = {};
  consonants["name"] = "consonants";
  consonants["children"] = [];
  consonants["colname"] = "level2";
  var special = {};
  special["name"] = "special";
  special["children"] = [];
  special["colname"] = "level2";
  for (var key in countObject) {
    if (["a", "e", "i", "o", "u", "y"].includes(key)) {
      var x = {};
      x["name"] = key;
      x["group"] = "vowel";
      x["value"] = countObject[key];
      x["colname"] = "level3";

      vowels["children"].push(x);
    } else if ([".", ",", "!", ":", ";"].includes(key)) {
      var x = {};
      x["name"] = key;
      x["group"] = "vowel";
      x["value"] = countObject[key];
      x["colname"] = "level3";

      special["children"].push(x);
    } else {
      var x = {};
      x["name"] = key;
      x["group"] = "vowel";
      x["value"] = countObject[key];
      x["colname"] = "level3";

      consonants["children"].push(x);
    }
  }
  // the JSON object ready! for TreeMap
  jsonData["children"].push(vowels);
  jsonData["children"].push(consonants);
  jsonData["children"].push(special);

  // Making tree map.
  var body = d3.select("body");
  var treeSvg = body.select("#treemap_svg");
  // var jsonTree = JSON.stringify(jsonData);
  // console.log(jsonData);

  // ------------------------------------------------------------------
  // Dont need d3.json because I have the object of the json in jsonData
  // d3.json(
  //   "json.path"
  // )
  //   .then((data) => {
  //     console.log(data);
  //   })
  //   .catch(function (error) {
  //     console.log("error loading json data");
  //   });
  // --------------------------------------------
  // Highlight Feature for the textbox
  var texthighlighter = (c) => {
    var textBox = document.getElementById("wordbox");
    var range = document.createRange();
    var textNode = textBox.firtChild;
    console.log(textNode);
    var charArray = textBox.textContent;
    // charArray.forEach((char) => {
    //   var start, end;

    //   start = 0;
    //   end = start + 1;
    //   if (char == c) {
    //     range.setStart(textBox, start);
    //     range.setEnd(textBox, end);
    //     var rects = range.getBoundingClientRect();
    //     console.log(rects);
    //   } else if (char == c.toUpperCase()) {
    //     range.setStart(textBox, start);
    //     range.setEnd(textBox, end);

    //     var rects = range.getBoundingClientRect();
    //     console.log(rects);
    //   }
    // });

    // for (let i = 0; i < charArray.length; i++) {
    //   if (charArray[i].toLowerCase() == c) {
    //     console.log(charArray[i]);
    //     start = 2;
    //     end = start + 1;
    //     range.setStart(textBox, start);
    //     range.setEnd(textBox, end);

    //     var rects = range.getBoundingClientRect();
    //     console.log(rects);
    //   }
    // }
    // console.log(charArray);
  };
  // -----------------------------------------
  // Highlight Feature from TreeMaps
  // -----------------------------------------
  var highOver = (event, data) => {
    var t = d3.transition().duration(1000);
    var dataName = data.data.name;
    texthighlighter(data.data.name);
    // console.log(data);
    var el = d3.selectAll(".node-sankey").filter((data, index) => {
      if (data.name[0] == dataName) {
        // console.log(data);
        return data;
      }
    });
    // console.log(el);
    el.transition(t).style("stroke-width", "3px");
    var elements = d3.selectAll(".tree-rect").filter((data, index) => {
      if (data.data.name == dataName) return data;
    });
    elements.transition(t).style("stroke-width", "3px");
  };
  var highLeave = (event, data) => {
    // console.log(data);
    var t = d3.transition().duration(1000);

    var dataName = data.data.name;
    // console.log(data);
    var elements = d3.selectAll(".node-sankey").filter((data, index) => {
      if (data.name[0] == dataName) return data;
    });
    elements.transition(t).style("stroke-width", "1px");
    // .style("stroke", "#111");
    elements = d3.selectAll(".tree-rect").filter((data, index) => {
      if (data.data.name == dataName) return data;
    });
    elements.transition(t).style("stroke-width", "1px");
  };
  // --------------------------------------------
  // Creating DIV for toolTipsTree
  var toolTipsTree = body
    .append("div")
    .attr("class", "tooltip-master")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border-width", "2px")
    .style("border", "solid")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute")
    .attr("text-align", "center")
    .style("width", "85px")
    .style("height", "50px");
  // .style("font-size", 5);
  var textBoxHigh = (c) => {
    var textBox = document.querySelector("#wordbox");
  };
  var treeOver = (event, data) => {
    // toolTipsTree.transition().duration(200).style("opacity", 0.9);
    // console.log(data);
    toolTipsTree
      .html(
        "Character: " + data.data.name + "<br/>" + "Count: " + data.data.value
      )
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("left", event.pageX + 9 + "px")
      .style("top", event.pageY - 50 + "px")
      .style("opacity", 1);

    highOver(event, data);
    // document
    //   .querySelector("#treemap_svg")
    //   .addEventListener("mouseover", (e) => {
    //   });
    // console.log(toolTipsTree);
    // console.log(event.clientX);
    // console.log(event.clientY);
    // alert("MouseOver");
  };
  var treeFollow = (event, data) => {
    toolTipsTree
      // .text("Hello!")
      // .style("font-size", "10px")
      .style("left", event.pageX + 9 + "px")
      .style("top", event.pageY - 50 + "px");
    highOver(event, data);
    // document
    //   .querySelector("#treemap_svg")
    //   .addEventListener("mousemove", (e) => {
    //     // console.log(e);
    //     // .style("opacity", 1);
    //   });
    // toolTipsTree
    //   .html("The exact value of ")
    //   .style("left", d3.pointer(this)[0] + 70 + "px")
    //   .style("top", d3.pointer(this)[1] + "px");
  };
  var treeOut = (event, data) => {
    // toolTipsTree.transition().duration(500).style("opacity", 0);
    toolTipsTree.style("opacity", 0).style("left", "0px").style("top", "0px");
    highLeave(event, data);
    // document.querySelector(".tree-rect").addEventListener("mouseleave", (e) => {
    //   // console.log(e);
    // });
    // alert("MouseOut");
  };
  // -------------------------------
  // -------------------------------

  var color = d3
    .scaleOrdinal()
    .domain(["vowels", "consonants", "special"])
    .range(["#d0f4de", "#a9def9", "#fcf6bd"]);

  var root = d3.hierarchy(jsonData).sum((d) => {
    return d.value;
  });

  var width = 580;
  var height = 400;
  d3
    .treemap()
    .size([width, height])
    .paddingTop(5)
    .paddingRight(5)
    .paddingLeft(5)
    .paddingBottom(5)
    .paddingInner(3)(
    // Padding between each rectangle
    //.paddingOuter(6)
    //.padding(20)
    root
  );

  treeSvg
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
    .attr("x", (d) => {
      return d.x0;
    })
    .attr("y", (d) => {
      return d.y0;
    })
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => {
      return d.y1 - d.y0;
    })
    .style("stroke", "black")
    .style("fill", (d) => {
      console.log(d.parent.data.name);
      return color(d.parent.data.name);
    })
    .attr("class", "tree-rect")
    .attr("id", (d, i) => {
      return d.data.name + "-" + i;
    });

  // Adding Tooltips for TreeMap
  d3.selectAll(".tree-rect")
    .on("mouseover", treeOver)
    .on("mousemove", treeFollow)
    .on("mouseleave", treeOut);

  var treeNodes = document.querySelectorAll("rect");

  treeNodes.forEach((rect) => {
    rect.addEventListener("click", (event) => {
      d3.selectAll("g").remove();
      d3.selectAll(".label-sankey").remove();
      var sankeyId = event.target.id[0];
      console.log(event.target.id);

      // --------------------------------------------
      // Change SPAN for new letter
      var updateText = document.querySelector("#flow_label");
      updateText.textContent = "Character flow for '" + sankeyId + "'";

      // --------------------------------------------

      var adjacent = beforeAfter[sankeyId];
      console.log(adjacent);

      // Prepping the json for sankey chart

      // List of the nodes
      var nodes = new Set();
      for (var x in adjacent) {
        var str = adjacent[x];
        if (str[0] != "_") {
          nodes.add(str[0]);
        }
        if (str[1] != "_") {
          nodes.add(str[1]);
        }
      }
      var nodeList = Array.from(nodes);
      var nodeParts = [];

      // for (var i = 0; i < nodeList.length; i++) {
      //   if (i == 0) {
      //     var np = {};
      //     // np["node"] = 0;
      //     np["name"] = sankeyId;
      //     nodeParts.push(np);
      //   }
      //   var np = {};
      //   // np["node"] = i + 1;
      //   np["name"] = nodeList[i];
      //   // console.log(np);
      //   nodeParts.push(np);
      // }
      // console.log(nodeList);
      // Before SankeyId
      nodeParts.push({ name: sankeyId });
      var before = {};
      var after = {};
      for (var x in adjacent) {
        var str = adjacent[x];
        if (str[0] != "_") {
          if (str[0] + "-b" in before) {
            before[str[0] + "-b"] += 1;
          } else {
            before[str[0] + "-b"] = 1;
            nodeParts.push({ name: str[0] + "-b" });
          }
        }
        if (str[1] != "_") {
          if (str[1] + "-a" in after) {
            after[str[1] + "-a"] += 1;
          } else {
            after[str[1] + "-a"] = 1;
            nodeParts.push({ name: str[1] + "-a" });
          }
        }
      }
      // console.log(before);
      // console.log(after);
      var combined = [];
      var linksPart = [];
      for (var key in before) {
        var x = {};
        x["source"] = key;
        x["target"] = sankeyId;
        x["value"] = 0 + before[key];
        combined.push(x["value"]);
        linksPart.push(x);
      }
      // console.log(linksPart);
      for (var key in after) {
        var x = {};
        x["source"] = sankeyId;
        x["target"] = key;
        x["value"] = after[key];
        combined.push(x["value"]);
        linksPart.push(x);
      }
      // Main object
      var jsonSankey = {};
      jsonSankey["links"] = linksPart;
      jsonSankey["nodes"] = nodeParts;

      console.log(jsonSankey);

      // Changing the jsonSankey form
      var change = {};
      jsonSankey.nodes.forEach((x, i) => {
        change[x.name] = i;
      });
      // console.log(change);
      jsonSankey.links = jsonSankey.links.map((x) => {
        var returnable = {};
        returnable["source"] = change[x.source];
        returnable["target"] = change[x.target];
        returnable["value"] = x.value;

        return returnable;
      });
      // console.log(jsonSankey);
      // Making Sankey Chart
      var sankeyChart = d3
        .sankey()
        .nodeWidth(25)
        .nodePadding(8)
        .size([width - 40, height - 30]);
      var path = sankeyChart.links();
      var graph = sankeyChart(jsonSankey);
      // var graph = sankeyChart
      //   .nodes(jsonSankey.nodes)
      //   .links(jsonSankey.links)
      //   .layout(1);
      var sankeySvg = body.select("#sankey_svg");
      sankeySvg
        .style("padding-left", "20px")
        .style("padding-right", "5px")
        .style("padding-top", "15px");
      // .style("padding-bottom", "20px");
      // console.log(combined);

      var strokeScale = d3
        .scaleLinear()
        .domain([0, d3.max(combined, (d) => d)])
        .range([25, 0]);
      var link = sankeySvg
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-opacity", 0.1)
        // .attr("margin", "40px")
        .selectAll("path")
        .data(jsonSankey.links)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        // .attr("d", (data) => {
        //   console.log(data);
        //   return data;
        // })
        .attr("stroke-width", (d) => d.width - 5)
        .attr("class", ".link-nodes");

      // // console.log(link);
      var groupName = (letter) => {
        if (["a", "e", "i", "o", "u", "y"].includes(letter)) {
          return "vowels";
        } else if ([".", ",", "!", ":", ";"].includes(letter)) {
          return "special";
        } else {
          return "consonants";
        }
      };
      var count = 0;
      var node = sankeySvg
        .append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node-sankey");

      node
        .append("rect")
        .attr("x", function (d) {
          return d.x0 + 2;
        })
        .attr("y", function (d) {
          return d.y0 + 2;
        })
        .attr("height", function (d) {
          count += 1;
          return d.y1 - d.y0;
        })
        // .attr("margin-top", "4px")
        // .attr("margin-bottom", "4px")
        .attr("width", sankeyChart.nodeWidth())
        .style("fill", function (d) {
          // return (d.color = color(d.name.replace(/ .*/, "")));
          return (d.color = color(groupName(d.name[0])));
        })
        .style("stroke", function (d) {
          // return d3.rgb(d.color).darker(2);
          // .darker(2);
          return "#111";
        });
      // console.log(count);
      var divLab = [];

      // d3.selectAll(".node-sankey").filter((data) => {
      //   if (data.value) {
      //     console.log(data.name);
      //     x["label"] = new String(data.name);
      //     x["x0"] = new Number(data.x0);
      //     x["y0"] = new Number(data.y0);
      //     x["y1"] = new Number(data.y1);
      //     divLab.push(x);
      //     return data.value;
      //   }
      // });
      // console.log(jsonSankey);

      // Labelling the Sankey Chart
      jsonSankey.nodes.forEach((node) => {
        var x = {};
        var sank = document.getElementById("sankey_svg");
        // console.log(sank);
        // Get the bounding rectangle of the element
        var rect = sank.getBoundingClientRect();

        // Get the x and y coordinates
        var x = rect.left + window.scrollX;
        var y = rect.top + window.scrollY;

        // console.log("X coordinate:", x);
        // console.log("Y coordinate:", y);
        // console.log(d3.select("#sankey_svg"));
        // console.log(node);
        // console.log("hello");
        if (node.y1 - node.y0 != 0) {
          body
            .append("div")
            .attr("class", "label-sankey")
            // .style("opacity", 1)
            // .style("background-color", "white")
            // .style("border-width", "2px")
            // .style("border", "solid")
            // .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute")
            .attr("text-align", "center")
            .style("width", "20px")
            .style("height", "20px")
            .html(node.name[0])
            .style("font-size", "16px")
            .attr("font-weight", "bold")
            .style("font-family", "sans-serif")
            .style("left", x + node.x0 + 2 + "px")
            .style("top", y + node.y0 + (node.y1 - node.y0) / 2 + "px")
            .style("opacity", 1);
        }
      });
      // .selectAll(".texty"
      // .style("position", "absolute");
      // .style("stroke-width", "1px");
      var toolTipsSankey = body
        .append("div")
        .attr("class", "tooltip-sankey")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border-width", "2px")
        .style("border", "solid")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .attr("text-align", "center")
        .style("width", "120px")
        .style("height", "70px");
      // .style("font-size", 5);

      // Highlight Property for Sankey Chart
      var highOverSankey = (event, data) => {
        var t = d3.transition().duration(1000);
        var dataName = data.name[0];
        // console.log(data);
        var el = d3.selectAll(".tree-rect").filter((data, index) => {
          if (data.data.name == dataName) {
            // console.log(data);
            return data;
          }
        });
        // console.log(el);
        el.transition(t).style("stroke-width", "3px");
        var elements = d3.selectAll(".node-sankey").filter((data, index) => {
          if (data.name[0] == dataName) return data;
        });
        elements.transition(t).style("stroke-width", "3px");
      };
      var highLeaveSankey = (event, data) => {
        // console.log(data);
        var t = d3.transition().duration(1000);

        var dataName = data.name[0];
        // console.log(data);
        var el = d3.selectAll(".tree-rect").filter((data, index) => {
          if (data.data.name == dataName) {
            // console.log(data);
            return data;
          }
        });
        // console.log(el);
        el.transition(t).style("stroke-width", "1px");
        var elements = d3.selectAll(".node-sankey").filter((data, index) => {
          if (data.name[0] == dataName) return data;
        });
        elements.transition(t).style("stroke-width", "1px");
      };

      var sankeyOver = (event, data) => {
        // toolTipsSankey.transition().duration(200).style("opacity", 0.9);
        // console.log(data);
        // console.log(event.pageX);
        highOverSankey(event, data);
        if (data.name.length == 3) {
          if (data.name[2] == "a") {
            toolTipsSankey
              .html(
                "Character '" +
                  data.targetLinks[0].source.name +
                  "' flows into character '" +
                  data.name[0] +
                  "' " +
                  data.value +
                  " times."
              )
              .style("font-size", "12px")
              .style("font-family", "sans-serif")
              .style("left", event.pageX + 9 + "px")
              .style("top", event.pageY - 68 + "px")
              .style("opacity", 1);
          } else {
            toolTipsSankey
              .html(
                "Character '" +
                  data.name[0] +
                  "' flows into character '" +
                  data.sourceLinks[0].target.name +
                  "' " +
                  data.value +
                  " times."
              )
              .style("font-size", "12px")
              .style("font-family", "sans-serif")
              .style("left", event.pageX + 9 + "px")
              .style("top", event.pageY - 68 + "px")
              .style("opacity", 1);
          }
        } else {
          toolTipsSankey
            .html(
              "Character '" + data.name + "' appears " + data.value + " times."
            )
            .style("font-size", "12px")
            .style("font-family", "sans-serif")
            .style("left", event.pageX + 9 + "px")
            .style("top", event.pageY - 68 + "px")
            .style("opacity", 1);
        }
        // document
        //   .querySelector("#treemap_svg")
        //   .addEventListener("mouseover", (e) => {
        //   });
        // console.log(toolTipsSankey);
        // console.log(event.clientX);
        // console.log(event.clientY);
        // alert("MouseOver");
      };
      var sankeyFollow = (event, data) => {
        toolTipsSankey
          // .text("Hello!")
          // .style("font-size", "10px")
          .style("left", event.pageX + 9 + "px")
          .style("top", event.pageY - 68 + "px");
        highOverSankey(event, data);
        // document
        //   .querySelector("#treemap_svg")
        //   .addEventListener("mousemove", (e) => {
        //     // console.log(e);
        //     // .style("opacity", 1);
        //   });
        // toolTipsSankey
        //   .html("The exact value of ")
        //   .style("left", d3.pointer(this)[0] + 70 + "px")
        //   .style("top", d3.pointer(this)[1] + "px");
      };
      var sankeyOut = (event, data) => {
        // toolTipsSankey.transition().duration(500).style("opacity", 0);
        toolTipsSankey
          .style("opacity", 0)
          .style("left", "0px")
          .style("top", "0px");
        highLeaveSankey(event, data);
        // document.querySelector(".tree-rect").addEventListener("mouseleave", (e) => {
        //   // console.log(e);
        // });
        // alert("MouseOut");
      };

      // console.log(d3.selectAll("node-sankey"));
      d3.selectAll(".node-sankey")
        .on("mouseover", sankeyOver)
        .on("mousemove", sankeyFollow)
        .on("mouseleave", sankeyOut);
    });
    // -------------------------------------------------------------------
    // --------------------------------------------
    // Creating DIV for toolTipsSankey
  });

  // -------------------------------
  // -------------------------------
  // console.log(root);
}
function omitspaces(str) {
  return str.split(" ").join("");
}

function mouseOver(data) {}

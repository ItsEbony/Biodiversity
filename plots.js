function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampled = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampled.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
   var OTU_IDs = result.otu_ids;
   var OTU_Labels = result.otu_labels;
   var Sample_Values = result.sample_values;

   // Metadata for gauge 
   var metadata = data.metadata; 
   var washArray = metadata.filter(washSamp => washSamp.id == sample);
   var metaResult = washArray[0];
   var washNum = metaResult.wfreq;
    var washFloat = parseFloat(washNum);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = OTU_IDs.slice(0, 10).map(otuID => `OTU ` + otuID).reverse();
    
    // 8. Bar chart. 
    var trace = {
      x: Sample_Values.slice(0,10).reverse(),
      y: yticks,
      text: OTU_Labels,
      type: "bar",
      orientation: "h"
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Sample Values" }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart.
    
    var bubbleTrace = {
      x: OTU_IDs,
      y: Sample_Values,
      text: OTU_Labels,
      mode: "markers",
      marker: {size: Sample_Values, 
        color: OTU_IDs,
      colorscale: 'Rainbow'}
    };
    var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "OTU ID"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Gauge chart.
    var gaugeTrace = {
      value: washFloat,
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [null, 10] },
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]
    }}
    var gaugeData = [
      gaugeTrace
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { title: "Belly Button Washing Frequency"
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

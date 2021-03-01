// fuction init
function init()
{
    var dropdownMenu = d3.select("selDataset");
    d3.json("samples.json").then((sample_data)=>
        {
          console.log(sample_data.names);

            var sample_id = sample_data.names;
            sample_id.forEach((sample)=>
            {
                //apppend sample_id into dropdown
                dropdownMenu.append("option").text(sample).property("value",sample);
            });
            var first_id = sample_id[0]
            build(first_id)
            buildplots(first_id)
        });
}
init();

//Build Demographic table

function build(sample)
{
    d3.json("samples.json").then((sample_data) =>
    {
      console.log(sample_data);

        var sampleMetadata = sample_data.metadata;


        var results = sampleMetadata.filter(s=>s.id == sample);
        console.log(results);

        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(results[0]).forEach(([key,value]) =>
        {
        panel.append("h6").text(`${key}:${value}`);
      });
    });
};

//Build Plots
function buildplots(sample)
{
  d3.json('samples.json').then((sample_data) =>
  {
    var samples = sample_data.samples;
    var results = samples.filter(s=>s.id == sample);
    console.log("results");
    console.log(results);
        
    var graphData = results[0];

    console.log(graphData)


//Grab top 10 OTUs for the plots
    var sample_value = graphData.sample_value;
    var otu_id = graphData.otu_id;
    var otu_labels = graphData.otu_labels;

// Build Bar chart
    var bar_trace =
    {
        x: sample_value.slice(0,10),
        y: otu_id.slice(0,10).map(value=>`OTU ID ${value}`).reverse(),
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: "h"
    };

    bar_data = [bar_trace];
    // Create Bar Layout

    var bar_layout = 
    {
      xaxis: { title: "Sample ID"},
    };

Ploty.newPlot("bar", bar_Data, bar_layout);

//Create Bubble Plot 

var bubble_trace = 
{
  x: otu_id,
  y:sample_value,
  mode: "markers",
  marker:
  {
   color: otu_id, 
   size: sample_value

  },
  text: otu_labels,
};

var bubble_data = [bubble_trace];
var bubble_layout = 
{
  xaxis: {title: "otu_id"},
  yaxis: {title: "sample_value"}
};
Plotly.newPlot("bubble", bubble_Data, bubble_layout);

  });
};
  
function optionChanged(sample)
{
    build(sample);
    buildplots(sample);
};
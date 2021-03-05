//Build Demographic table
function build(sample)
{
    d3.json("samples.json").then((demo_info) => 
    {
        console.log(demo_info);
        var sampleMetadata = demo_info.metadata;

        var results = sampleMetadata.filter(s=>s.id == sample);
        console.log(results);

        let panel = d3.select("#sample-metadata");
        panel.html("");
      
        Object.entries(results[0]).forEach(([key,value])=>
        {
            panel.append("p").text(`${key}:${value}`);
        });
    });
};


//Build Plots
function buildGraph(sample)
{
    d3.json("samples.json").then((otu_data) => 
    {
        console.log(otu_data);
        var samples = otu_data.samples;
        var results = samples.filter(s=>s.id == sample);
        console.log("results");
        console.log(results);
        var graphData = results[0];
        console.log(graphData);
        
      //Grab top 10 OTUs for the plots
        var sample_values = graphData.sample_values;
        var otu_ids = graphData.otu_ids;
        var otu_labels = graphData.otu_labels;
      
       // Build Bar chart
        var barTrace = 
        {
          x: sample_values.slice(0,10).reverse(),
          y: otu_ids.slice(0,10).map(value=>`OTU ID ${value}`).reverse(),
          type: "bar",
          text: otu_labels.slice(0,10).reverse(),
          orientation: "h"
        };
        var barData = [barTrace];
        var barLayout = 
        {
          title: "Bar",
          xaxis: { title: "Sample Values"},
        };
        
        Plotly.newPlot("bar", barData, barLayout);
        
        //Create Bubble Plot 
        var bubbleTrace =  
        {
          x: otu_ids,
          y: sample_values,
          mode: "markers",
          marker: 
          {
              color: otu_ids,
              size: sample_values
          },
          text: otu_labels
        };
        var bubbleData = [bubbleTrace];
        var bubbleLayout = 
        {
          title: "Bubble",
          xaxis: { title: "otu_id"},
          yaxis: { title: "sample_value"}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
};

//Populate dropdown and create option change to have tables update accoriding to ID 
function init()
{
    var dropdownMenu = d3.select("#selDataset");
    d3.json("samples.json").then((sample_data)=>
        {
            console.log(sample_data.names);
            var sampleNames = sample_data.names;
            sampleNames.forEach((sample)=>
            {
                dropdownMenu.append("option").text(sample).property("value",sample);
            });
          //build inital graphs with the first sample in list
            var first_sample = sampleNames[0]
            build(first_sample)
            buildGraph(first_sample)
        });
}
        
init();

function optionChanged(sample) 
        {
          build(sample);
          buildGraph(sample);
        }





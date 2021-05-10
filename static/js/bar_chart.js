// Use D3 fetch to read the JSON file
// The data from the JSON file is arbitrarily named importedData as the argument


d3.json("/static/data/current_listing.json").then((current_listed_data) => {
	
	d3.json("/static/data/sold_listing.json").then((sold_listed_data) => {
  
		console.log(current_listed_data);

		//*****************getting zipcodes & cities for dropdown*****************
		var zipcodes = [];
		var cities = [];
		var zip_cities = [];

		for (var i = 0; i < current_listed_data.length; i++){
		if (zip_cities.includes(current_listed_data[i].City + "-" + current_listed_data[i].ZipCode) === false){
		  zipcodes.push(current_listed_data[i].ZipCode)
		  cities.push(current_listed_data[i].City)
		  zip_cities.push(current_listed_data[i].City + "-" + current_listed_data[i].ZipCode)
		}
		}
		
		zipcodes = zipcodes.sort((a,b)=>a-b)
		zipcodes = zipcodes.slice(1,zipcodes.length)
		console.log("zipcodes current");
		console.log(zipcodes);
		zip_cities = zip_cities.sort((a,b)=>a-b);

		

		//building logic for dropdown values
		var html = "";
		for (var i = 0; i < zip_cities.length; i++) {
		html+="<option value=" + zip_cities[i] + ">" + zip_cities[i] + "</option>";
		}
		d3.select(".well>select").html(html);


		//*****************filter data based on selected dropdown value*****************
		function filterData(data, inputValue) {

		var dropdownMenu = d3.select("#selDataset");
		// Assign the value of the dropdown menu option to a variable
		var zip_code_city = dropdownMenu.property("value");

		if (zip_code_city === ""){zip_code = "Frisco-75035"}

		val = (data.City + "-" + data.ZipCode) 
		//console.log("val for check")
		//console.log(val)

		return val === zip_code_city;
		}

		//*****************processing current listing data*****************
		samples = current_listed_data
		var rows = samples.filter(filterData);
		console.log("Filtered rows based on zip code current")
		console.log(rows)

		//beds = []
		beds_text = []
		beds_num = []
		sq_ft = 0
		for (var i = 0; i < rows.length; i++){
		if (beds_num.includes(rows[i].NumberOfBeds) === false){
		  //beds.push(rows[i].NumberOfBeds.toString())
		  beds_num.push(rows[i].NumberOfBeds)
		  sq_ft = sq_ft + rows[i].SqFt
		}
		}
		beds_num = beds_num.sort((a,b)=>b-a)


		console.log("beds current")
		console.log(beds_num)

		avg_prices = []
		for (var i = 0; i < beds_num.length; i++){
		beds_text.push(beds_num[i].toString()+' beds ')
		temp = 0;
		cnt = 0;
		for (var j = 0; j < rows.length; j++){
		if (beds_num[i] === rows[j].NumberOfBeds){
		  temp = temp + rows[j].Price
		  cnt = cnt + 1
		}
		}
		avg_prices.push(Math.round(temp/cnt))
		}

		console.log("avg_prices current")
		console.log(avg_prices)
		
		//building logic for metadata html
		d3.select("#num").html("<p><strong> &nbsp &nbsp Currently available: "+rows.length+"</strong></p>");
		d3.select("#area").html("<p><strong> &nbsp &nbsp Avg. SqFt. of Properties: "+Math.round(sq_ft/rows.length)+"</strong></p>");
		
		//*****************processing sold listing data*****************
		samples2 = sold_listed_data
		var rows2 = samples2.filter(filterData);
		console.log("Filtered rows based on zip code sold")
		console.log(rows2)

		//beds2 = []
		beds_text2 = []
		beds_num2 = []
		sq_ft2 = 0
		for (var i = 0; i < rows2.length; i++){
		  if (beds_num2.includes(rows2[i].NumberOfBeds) === false){
			  //beds2.push(rows2[i].NumberOfBeds.toString())
			  beds_num2.push(rows2[i].NumberOfBeds)
			  sq_ft2 = sq_ft2 + rows2[i].SqFt
		  }
		}
		beds_num2 = beds_num2.sort((a,b)=>b-a)


		console.log("beds sold")
		console.log(beds_num2)

		avg_prices2 = []
		for (var i = 0; i < beds_num2.length; i++){
		  beds_text2.push(beds_num2[i].toString()+' beds ')
		  temp = 0;
		  cnt = 0;
		  for (var j = 0; j < rows2.length; j++){
			if (beds_num2[i] === rows2[j].NumberOfBeds){
			  temp = temp + rows2[j].Price
			  cnt = cnt + 1
			}
		  }
		  avg_prices2.push(Math.round(temp/cnt))
		}

		console.log("avg_prices sold")
		console.log(avg_prices2)
		
		//building logic for metadata html
		d3.select("#num2").html("<p><strong> &nbsp &nbsp Sold in last 6 months: "+rows2.length+"</strong></p>");
		d3.select("#area2").html("<p><strong> &nbsp &nbsp Avg. SqFt. of Properties: "+Math.round(sq_ft2/rows2.length)+"</strong></p>");
		
		updatePlotlyBar(beds_text, avg_prices, avg_prices);
		updatePlotlyBar2(beds_text2, avg_prices2, avg_prices2);

		//****************** Call getData() when a change takes place to the DOM ************************
		d3.selectAll("#selDataset").on("change", getData);

		// Function called by DOM changes
		function getData() {

			//*****************processing current listing data*****************
			samples = current_listed_data
			var rows = samples.filter(filterData);
			console.log("Filtered rows based on zip code current")
			console.log(rows)

			//beds = []
			beds_text = []
			beds_num = []
			sq_ft = 0
			for (var i = 0; i < rows.length; i++){
			if (beds_num.includes(rows[i].NumberOfBeds) === false){
			  //beds.push(rows[i].NumberOfBeds.toString())
			  beds_num.push(rows[i].NumberOfBeds)
			  sq_ft = sq_ft + rows[i].SqFt
			}
			}
			beds_num = beds_num.sort((a,b)=>b-a)


			console.log("beds current")
			console.log(beds_num)

			avg_prices = []
			for (var i = 0; i < beds_num.length; i++){
			beds_text.push(beds_num[i].toString()+' beds ')
			temp = 0;
			cnt = 0;
			for (var j = 0; j < rows.length; j++){
			if (beds_num[i] === rows[j].NumberOfBeds){
			  temp = temp + rows[j].Price
			  cnt = cnt + 1
			}
			}
			avg_prices.push(Math.round(temp/cnt))
			}

			console.log("avg_prices current")
			console.log(avg_prices)
			
			//building logic for metadata html
			d3.select("#num").html("<p><strong> &nbsp &nbsp # of Properties: "+rows.length+"</strong></p>");
			d3.select("#area").html("<p><strong> &nbsp &nbsp Avg. SqFt. of Properties: "+Math.round(sq_ft/rows.length)+"</strong></p>");
			
			//*****************processing sold listing data*****************
			samples2 = sold_listed_data
			var rows2 = samples2.filter(filterData);
			console.log("Filtered rows based on zip code sold")
			console.log(rows2)

			//beds2 = []
			beds_text2 = []
			beds_num2 = []
			sq_ft2 = 0
			for (var i = 0; i < rows2.length; i++){
			  if (beds_num2.includes(rows2[i].NumberOfBeds) === false){
				  //beds2.push(rows2[i].NumberOfBeds.toString())
				  beds_num2.push(rows2[i].NumberOfBeds)
				  sq_ft2 = sq_ft2 + rows2[i].SqFt
			  }
			}
			beds_num2 = beds_num2.sort((a,b)=>b-a)


			console.log("beds sold")
			console.log(beds_num2)

			avg_prices2 = []
			for (var i = 0; i < beds_num2.length; i++){
			  beds_text2.push(beds_num2[i].toString()+' beds ')
			  temp = 0;
			  cnt = 0;
			  for (var j = 0; j < rows2.length; j++){
				if (beds_num2[i] === rows2[j].NumberOfBeds){
				  temp = temp + rows2[j].Price
				  cnt = cnt + 1
				}
			  }
			  avg_prices2.push(Math.round(temp/cnt))
			}

			console.log("avg_prices sold")
			console.log(avg_prices2)
			
			//building logic for metadata html
			d3.select("#num2").html("<p><strong> &nbsp &nbsp # of Properties: "+rows2.length+"</strong></p>");
			d3.select("#area2").html("<p><strong> &nbsp &nbsp Avg. SqFt. of Properties: "+Math.round(sq_ft2/rows2.length)+"</strong></p>");
			

			updatePlotlyBar(beds_text, avg_prices, avg_prices);
			updatePlotlyBar2(beds_text2, avg_prices2, avg_prices2);
		}


		// Building bar chart
		function updatePlotlyBar(x, y, hover_text) {

			var trace = {
			  x: y,
			  y: x,
			  text: hover_text,
			  type: "bar",
			  orientation: 'h',
			  marker: {color: 'rgb(255,127,80)'}
			};

			var Data = [trace];

			var layout = {
				  xaxis: { title: "<b>Avg. Prices</b>"},
				  yaxis: { title: "<b># of Beds</b>"},
				  margin: {
						l: 100,
						r: 20,
						t: 0,
						b: 70
					  },
				  width: 800,
				  height: 400,
				  color: 'red'
				};

			Plotly.newPlot("bar", Data, layout);
		}
		
		// Building bar chart
		function updatePlotlyBar2(x, y, hover_text) {
		
			var trace = {
			  x: y,
			  y: x,
			  text: hover_text,
			  type: "bar",
			  orientation: 'h',
			  marker: {color: 'rgb(0, 128, 0)'}
			};
			
			var Data = [trace];
			
			var layout = {
				  xaxis: { title: "<b>Avg. Prices</b>"},
				  yaxis: { title: "<b># of Beds</b>"},
				  margin: {
						l: 100,
						r: 20,
						t: 0,
						b: 70
					  },
				  width: 800,
				  height: 400,
				  color: 'red'
				};
			
			Plotly.newPlot("bar2", Data, layout);
		}

	})		
});




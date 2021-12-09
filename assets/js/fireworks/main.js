
function appendFireworksSVG() {
	// set the dimensions and margins of the graph
	margin = {
		'top': 0,
		'bottom': 0,
		'left': 0,
		'right': 0
	};
	appendSVG('svgFW', 'fireworks', getBodyDimenstions()[0], getBodyDimenstions()[1], margin.left, margin.top, null);
}

// credit is due to this blocks page for the process defined below: http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5
// I took what was there, made adjustments on preference/version differences, and added to it.

function launchFireworkBurst() {

	////////////////////////////////////////////////////////////////////////////////////////////////

	// // palettes that have been removed:

	// Astrid Gen Wyatt Shyla Cynthia Color Palette: https://www.color-hex.com/color-palette/104729
	// ['#1ecf25', '#9419e6', '#fcd300', '#30cf89', '#19cde6']
	// Beach Color Palette: https://www.color-hex.com/color-palette/895
	// ['#96ceb4', '#ffeead', '#ff6f69', '#ffcc5c', '#88d8b0'],
	// BG colors Color Palette: https://www.color-hex.com/color-palette/105000
	// ['#08a184', '#42d4b9', '#fdec40', '#1bd43a', '#dc143c'],
	// BGSS colors Color Palette: https://www.color-hex.com/color-palette/104999
	// ['#fdf540', '#0cead9', '#00cb9c', '#8ddf64', '#dc143c'],
	// ESO Item Qualities Color Palette: https://www.color-hex.com/color-palette/104887
	// ['#2dc50e', '#3a92ff', '#a02ef7', '#eeca2a', '#ff8200'],
	// ESO MOTD Color Text Color Palette: https://www.color-hex.com/color-palette/20452
	// ['#ff0000', '#fff000', '#18fff9', '#d3ac4b', '#8f139f'],
	// Fire oranges Color Palette: https://www.color-hex.com/color-palette/104858
	// ['#ffbf00', '#ffa500', '#ff8000', '#ff4000', '#ff1500'],
	// fruit tree Color Palette: https://www.color-hex.com/color-palette/104883
	// ['#38ad94', '#62a43d', '#ffb42b', '#ff493a', '#ff8bb6'],
	// Gryffindors Color Palette: https://www.color-hex.com/color-palette/104972
	// ['#ae2825', '#fbcd14', '#b9282f', '#e5ba30', '#86162a'],
	// I Loved In Shades of Green Color Palette: https://www.color-hex.com/color-palette/1325
	// ['#adff00', '#74d600', '#028900', '#00d27f', '#00ff83'],
	// Ice Cream Pastels Color Palette: https://www.color-hex.com/color-palette/104985
	// ['#41d8ca', '#c7e3e5', '#f4f3d4', '#f9d7c5', '#f4a2a9'],
	// Metro Style Color Palette: https://www.color-hex.com/color-palette/471
	// ['#00aedb', '#a200ff', '#f47835', '#d41243', '#8ec127'],
	// Neon 0908 Color Palette: https://www.color-hex.com/color-palette/1131
	// ['#fe0000', '#fdfe02', '#0bff01', '#011efe', '#fe00f6'],
	// original bg theme Color Palette: https://www.color-hex.com/color-palette/105004
	// ['#fdca40', '#970b44', '#00cb9c', '#7ddf64', '#aaaaaa'],
	// Retro Color Palette: https://www.color-hex.com/color-palette/165
	// ['#666547', '#fb2e01', '#6fcb9f', '#ffe28a', '#fffeb3'],
	// P a s t e l R a i n b o w Color Palette: https://www.color-hex.com/color-palette/104769
	// ['#ffc5c5', '#bcffa7', '#feffb6', '#98e5e7', '#ffaef3'],
	// pastel colors of the rainbow Color Palette: https://www.color-hex.com/color-palette/5361
	// ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'],

	////////////////////////////////////////////////////////////////////////////////////////////////

	// creating an array of separate color palettes for each firework
	fireWorksColorPalettes = [
		// https://htmlcolorcodes.com/
		//		// ['#dfff00', '#ffbf00', '#ff7f50', '#de3163', '#9fe2bf', '#40e0d0', '#6495ed', '#ccccff'],
		//		// adjusted above to remove one or more colors
		['#dfff00', '#ffbf00', '#de3163', '#40e0d0'],
		// Bohemian sunset Color Palette: https://www.color-hex.com/color-palette/104833
		['#9c2ea1', '#ff5f58', '#ffdd23', '#fd9301', '#ff0055'],
		// KINDA BRIGHT Color Palette: https://www.color-hex.com/color-palette/104792
		['#d578ff', '#625df0', '#59e7f2', '#f259a6', '#67eebb'],
		// VaporWave Color Palette: https://www.color-hex.com/color-palette/10221
		['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'],
		// 80s Color Palette: https://www.color-hex.com/color-palette/25888
		//		// ['#ff48c4', '#2bd1fc', '#f3ea5f', '#c04df9', '#ff3f3f'],
		//		// adjusted above to remove one or more colors
		['#ff48c4', '#2bd1fc', '#f3ea5f', '#c04df9'],
		// Metro UI Colors Color Palette: https://www.color-hex.com/color-palette/700
		//		// ['#d11141', '#00b159', '#00aedb', '#f37735', '#ffc425'],
		//		// adjusted above to remove one or more colors
		['#d11141', '#00aedb', '#f37735', '#ffc425'],
		// neon colors Color Palette: https://www.color-hex.com/color-palette/8618
		//		// ['#4deeea', '#74ee15', '#ffe700', '#f000ff', '#001eff'],
		//		// adjusted above to remove one or more colors
		['#4deeea', '#74ee15', '#ffe700', '#f000ff'],
		// Instagram gradient Color Palette: https://www.color-hex.com/color-palette/44340
		//		// ['#feda75', '#fa7e1e', '#d62976', '#962fbf', '#4f5bd5'],
		//		// adjusted above to remove one or more colors
		['#feda75', '#fa7e1e', '#d62976', '#962fbf'],
		// Rainbow Dash Color Palette: https://www.color-hex.com/color-palette/807
		//		// ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'],
		//		// adjusted above to remove one or more colors
		['#ee4035', '#f37736', '#fdf498', '#0392cf'],
		// Cyberpunk Color Palette: https://www.color-hex.com/color-palette/14887
		//		// ['#00ff9f', '#00b8ff', '#001eff', '#bd00ff', '#d600ff'],
		//		// adjusted above to remove one or more colors
		['#00ff9f', '#00b8ff', '#bd00ff', '#d600ff'],
		// cool blue Color Palette: https://www.color-hex.com/color-palette/30415
		//		// ['#005073', '#107dac', '#189ad3', '#1ebbd7', '#71c7ec'],
		//		// adjusted above to remove one or more colors
		['#107dac', '#189ad3', '#1ebbd7', '#71c7ec'],
		// Shades of Turquoise Color Palette: https://www.color-hex.com/color-palette/1836
		['#b3ecec', '#89ecda', '#43e8d8', '#40e0d0', '#3bd6c6'],
		// Red-Orange Color Palette: https://www.color-hex.com/color-palette/4699
		['#ffc100', '#ff9a00', '#ff7400', '#ff4d00', '#ff0000'],
		// Facebook Messenger 1 Color Palette: https://www.color-hex.com/color-palette/15945
		//		// ['#0084ff', '#44bec7', '#ffc300', '#fa3c4c', '#d696bb'],
		//		// adjusted above to remove one or more colors
		['#0084ff', '#44bec7', '#ffc300', '#fa3c4c'],
		// Pop Quiz Color Palette: https://www.color-hex.com/color-palette/104873
		//		// ['#fe0879', '#ff82e2', '#fed715', '#0037b3', '#70baff'],
		//		// adjusted above to remove one or more colors
		['#fe0879', '#ff82e2', '#fed715', '#70baff'],
		// indy Color Palette: https://www.color-hex.com/color-palette/104870
		//		// ['#ff5454', '#ff7698', '#56dfd4', '#2497a7', '#2e0ff6'],
		//		// adjusted above to remove one or more colors
		['#ff5454', '#ff7698', '#56dfd4', '#2497a7'],
		// Crystal Glacier Color Palette: https://www.color-hex.com/color-palette/104790
		//		// ['#ebb6f9', '#7f8bf5', '#445bab', '#0fba7c', '#4b9cfc'],
		//		// adjusted above to remove one or more colors
		['#ebb6f9', '#7f8bf5', '#445bab', '#4b9cfc'],
		// Midnight Mountain Color Palette: https://www.color-hex.com/color-palette/104789
		//		// ['#d948c3', '#3227a5', '#0ed9c1', '#600571', '#1c024b'],
		//		// adjusted above to remove one or more colors
		['#d948c3', '#3227a5', '#0ed9c1'],
		// XuxaDiversidade Color Palette: https://www.color-hex.com/color-palette/104756
		//		// ['#ff0000', '#ff5e00', '#f8d900', '#4b8b05', '#1771de'],
		//		// adjusted above to remove one or more colors
		['#ff0000', '#ff5e00', '#f8d900', '#1771de'],
		// Date Nite Color Palette: https://www.color-hex.com/color-palette/104742
		//		// ['#f53473', '#93135d', '#28357b', '#5595c1', '#77def1']
		//		// adjusted above to remove one or more colors
		['#f53473', '#93135d', '#5595c1', '#77def1']
	];

	// defining y parameter for the getBodyDimenstions()[1] of the launch
	// the is the distance from the top of the pange
	LaunchYLoc = chance.floating({ min: getBodyDimenstions()[1]*0.10, max: getBodyDimenstions()[1]*0.20 }),
	// defining adjusted y parameter for delay preceding explosion
	// new getBodyDimenstions()[1] adjusting for the distance by which the rocket will descend after reaching its peak (prior to exploding)
	explosionDrop = chance.floating({ min: 20, max: 130 }),
	// getBodyDimenstions()[1] all the circles will be at after the drop (and just before exploding)
	explosionYLoc = LaunchYLoc + explosionDrop,
	// defining values for the launch of the firework
	// function below will be used to determine the x location for launching the rocket
	randomXStart = d3.randomNormal(getBodyDimenstions()[0]/2, getBodyDimenstions()[0]/8),
	// x coordinate for the ascending (and descending) rocket
	launchXLoc = randomXStart(),
	// determining the magnitude of the explosion (value to be squared) at random
	// the actual distance from the explosion will be a combination of this value and another random value determined for each piece
	// this will also be used to decide the total circles for the explosion
	explosionMagnitude = chance.floating({ min: 140, max: 180 }),
	// total circles for the explosion
	totalCircles = Math.round(explosionMagnitude*1.5),
	// function to determine the x coordinates for all explosion pieces
	explosionData = d3.range(totalCircles).map(function() {
		// distance fron the center of the explosion determined at random
		// explosionSize (magnitude of the explosion) stays the same for each circle
		explosionDistance = Math.sqrt(~~(chance.floating({ min: 0, max: 1 }) * explosionMagnitude * explosionMagnitude)),
		// randomly determining the angle by which each circle will be relative to the center of the explosion
		randomAngle = Math.random() * 2 * Math.PI;

		return {
			x: launchXLoc + (explosionDistance * Math.cos(randomAngle)),
			y: explosionYLoc + (explosionDistance * Math.sin(randomAngle)) };
	}),
	randomPallete = fireWorksColorPalettes[getRandomInt(0, fireWorksColorPalettes.length)],
	launchColor = randomPallete[getRandomInt(0, randomPallete.length)],
	fireWorkPaletteFunc = d3.scaleOrdinal().domain([Math.min(explosionData['x']), Math.max(explosionData['x'])]).range(randomPallete);

	// console.log(randomPallete);

	launchRadius = 3,
	launchDuration = 1000,
	launchSpeed = launchDuration/((getBodyDimenstions()[1] + launchRadius) - LaunchYLoc),
	dropDuration = launchSpeed*explosionDrop;

	// these two variables will help create the tail effect with delay
	fireWorkTailSize = 90,
	tailDelaySize = 2.5;

	svgFW.selectAll()
			.data(explosionData).enter()
			.append('circle')
				.attr('r', launchRadius)
				.attr('cx', launchXLoc)
				.attr('cy', getBodyDimenstions()[1]+launchRadius)
				.style('fill', launchColor)
				.style('opacity', function(d, i) {
					if ( i>0 && i<=fireWorkTailSize )
					{ return 0.15; }
					else
					{ return 1; }
				})
			.transition()
				// delay here is to create the ascending tail
				.delay(function(d, i) {
					if ( i>0 && i<=fireWorkTailSize )
					{ return i*tailDelaySize; }
					else
					{ return 0; }
				})
				.ease(d3.easeCircle)
				.duration(launchDuration)
				.attr('cy', LaunchYLoc)
			.transition()
				.duration(dropDuration)
				.ease(d3.easeQuad)
				.attr('r', 5)
				.attr('cy', explosionYLoc)
			.transition()
				// delay here is to allow all objects to catch up
				.delay(function(d, i) {
					if ( i>0 && i<=fireWorkTailSize )
					{ return (fireWorkTailSize*tailDelaySize)-(i*tailDelaySize); }
					else
					{ return fireWorkTailSize*tailDelaySize; }
				})
				.duration(0)
				.style('opacity', 1)
			.transition()
				.duration(500)
				.ease(d3.easeCircle)
				.attr('cx', function(d) { return d.x; })
				.attr('cy', function(d) { return d.y; })
				.attr('r', 10)
				// .attr('r', function(d) { return chance.floating({ min: 0.5, max: 15 }); })
				.style('fill', function(d) { return fireWorkPaletteFunc(d.x); })
			.transition()
				.duration(1750 + chance.floating({ min: -750, max: 750 }))
				.ease(d3.easeCircle)
				.style('opacity', 0)
				.attr('cx', function(d) {
					if ( d.x > launchXLoc )
					{ return d.x + (d.x - launchXLoc); }
					else
					{ return d.x - (-d.x + launchXLoc); }
				})
				.attr('cy', function(d) {
					if ( d.y > explosionYLoc )
					{ return d.y + (d.y - explosionYLoc); }
					else
					{ return d.y - (-d.y + explosionYLoc); }
				})
				.on('end', function() {
					d3.select(this).remove();
				});
}


function launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput) {
	// totalFireworksMain: total fireworks in the regular show
	// totalFireworksFinale: total fireworks in the grand finale
	// duration per firework of the regular show
	fireworkIntervalMain = 1500,
	// totalFireworksFinale: total fireworks in the grand finale
	// duration per firework of the grand finale show
	fireWorkIntervalFinale = 500;

	for ( var i=0; i<=totalFireworksMain+totalFireworksFinale-1; i++ ) {

		// setting random variable manually for first iteration only.
		if ( i==0 )
		{ randomInterval = 0.5; }
		else
		{ randomInterval = chance.floating({ min: -randomIntervalMsInput, max: randomIntervalMsInput }); }
		// subtracting one from totalFireworksMain so that the first firework comes without any delay.
		regularShowMinDuration = (fireworkIntervalMain*(totalFireworksMain-1));
		// all fireworks for the regular show
		if ( i<=totalFireworksMain )
		{	d3.timeout(launchFireworkBurst, Math.max(0, (fireworkIntervalMain*i) + randomInterval)); }
		else
		// time for the grand finale!!!
		{	d3.timeout(launchFireworkBurst, Math.max(regularShowMinDuration-randomIntervalMsInput, regularShowMinDuration + (fireWorkIntervalFinale*(i-(totalFireworksMain-1))) + randomInterval)); }
	}
}

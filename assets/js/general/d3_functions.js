
function addStdSVG(svgName, divInput, widthInput, heightInput, marginLeftInput, marginTopInput, cursorInput) {

		window[svgName] = d3.select('#' + divInput)
												.append('svg')
													.attr('width', widthInput)
													.attr('height', heightInput)
													.attr('transform', 'translate(' + marginLeftInput + ',' + marginTopInput + ')')
													.style('cursor', cursorInput);
};

function addStdGroupSVG(svgName, divInput, widthInput, heightInput, marginLeftInput, marginTopInput, cursorInput) {

		window[svgName] = d3.select('#' + divInput)
												.append('svg')
													.attr('width', widthInput)
													.attr('height', heightInput)
												.append('g')
													.attr('transform', 'translate(' + marginLeftInput + ',' + marginTopInput + ')')
													.style('cursor', cursorInput);
};


function addStdText(svgInput, classInput, idInput, textX, textY, fontSize, fontStyle, opacity, strokeWidth, textInput) {

		svgInput.append('text')
			.attr('class', classInput)
			.attr('id', idInput)
			.attr('x', textX)
			.attr('y', textY)
			.text(textInput)
				.style('fill', 'black')
				.style('font-size', fontSize)
				.style('font-style', fontStyle)
				.style('opacity', opacity)
				.style('stroke-width', strokeWidth)
				.style('stroke', function(d) {
					if ( strokeWidth==0 )
					{ return 'transparent'; }
					else
					 { return 'black'; }
				 });
};


function addStdRect(svgInput, classInput, idInput, rectX, rectY, rectWidth, rectHeight, rectStroke, rectStrokeWidth, rectStrokeOpacity, rectFill, rectFillOpacity, rMO, rML, rClick) {

		svgInput.append('rect')
					.attr('class', classInput)
					.attr('id', idInput)
					.attr('x', rectX)
					.attr('y', rectY)
					.attr('width', rectWidth)
					.attr('height', rectHeight)
					.style('stroke', rectStroke)
					.style('stroke-width', rectStrokeWidth)
					.attr('stroke-opacity', rectStrokeOpacity)
					.style('fill', rectFill)
					.attr('fill-opacity', rectFillOpacity)
					.on('mouseover', rMO)
					.on('mouseleave', rML)
					.on('click', rClick)
					.style('pointer-events', function() { if ( rMO==null && rML==null && rClick==null )
																								{ return 'none'; }
																								else
																								{ return 'auto'; }
																							});
};


function addStdLine(svgInput, idInput, lineX1, lineX2, lineY1, lineY2, strokeColor, strokeWidth, strokeDashArray) {

	svgInput.append('line')
			.attr('pointer-events', 'none')
			.attr('id', idInput)
			.attr('x1', lineX1)
			.attr('x2', lineX2)
			.attr('y1', lineY1)
			.attr('y2', lineY2)
			.style('fill', 'none')
			.style('stroke', strokeColor)
			.style('stroke-width', strokeWidth)
			.style('stroke-dasharray', strokeDashArray);
};


function addStdCircle(svgInput, idInput, circX, circY, fillColor) {

	svgInput.append('circle')
				.attr('pointer-events', 'none')
				.attr('id', idInput)
				.attr('cx', circX)
				.attr('cy', circY)
		    .attr('fill', fillColor)
				.attr('stroke', 'black')
				.attr('stroke-width', 0.5)
		    .attr('r', 4);
};


function addStdPath(svgInput, dataInput, pathID, pathName, strokeColor, strokeOpacity) {

	svgInput.append('path')
			.data(dataInput)
			.attr('pointer-events', 'none')
			.attr('class', 'path')
			.attr('id', pathID)
			.attr('d', pathName)
			.style('stroke', strokeColor)
			.style('stroke-opacity', strokeOpacity);
};


function defineTooltip(divInput, idInput, leftLoc, rightLoc, divWidth, divHeight, opacity, textInput) {

	d3.select('#' + divInput)
		.append('div')
			.attr('pointer-events', 'none')
			.attr('class', 'tooltip')
			.attr('id', idInput)
			.style('width', divWidth)
			.style('height', divHeight)
			.style('left', leftLoc)
			.style('top', rightLoc)
			.style('opacity', opacity)
			.style('bottom', '0px')
		.html(textInput);
};


function addTooltipSymbol(svgInput, idInput, circX, circY, textX, textY, textRotate) {

	svgInput.append('circle')
				.attr('pointer-events', 'none')
				.attr('id', idInput + '_circle')
				.attr('cx', circX)
				.attr('cy', circY)
			    .attr('r', 7.5)
			    .style('fill', 'rgb(0,122,255)')
				.style('opacity', 0.9)
				.style('stroke-width', 2)
				.style('stroke', 'transparent');

	svgInput.append('text')
				.attr('pointer-events', 'none')
				.attr('id', idInput + '_i')
				.attr('transform', textRotate)
				.attr('x', textX)
				.attr('y', textY)
				.text('i')
					.style('fill', 'white')
					.style('stroke', 'white')
					.style('font-size', '11.5px')
					.style('font-weight', 500);
};


function selectAllHide(svgInput, idInput) {

	svgInput.selectAll('#' + String(idInput))
					.style('fill', 'transparent')
					.style('stroke', 'transparent');
};


function selectHide(svgInput, idInput) {

	svgInput.select('#' + String(idInput))
					.style('stroke', 'transparent');
};


function defineSlider(dataInput, widthInput, stepInput, defaultValue, changeFunction) {

	d3.sliderBottom()
				.min(d3.min(dataInput))
				.max(d3.max(dataInput))
				.width(widthInput)
				.step(stepInput)
				.tickValues(dataInput)
				.default(defaultValue)
				.on('onchange', function(d) {
					changeFunction
				});
};

var generalRectMO = function(d) {
		// this will be used as a decorator to other mouseover functions
		d3.select(this)
			.style('stroke-width', 2)
			.style('cursor', 'pointer');
},
		generalRectML = function(d) {
		// this will be used as a decorator to other mouseleave
		d3.select(this)
			.style('stroke-width', 1);
};

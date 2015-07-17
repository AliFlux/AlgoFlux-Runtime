/**
* 
* A data-structure for Graph creation and manipulation
*
* @example
* Graph is an instantiable class. It can be defined like:
*
* // Graph creation
*
* var graph = new Graph();
*
* @example
* // Graph creation from a Matrix.
*
* var graph = new Graph([
*     [0, 1, 0, 0],
*     [1, 0, 0, 0],
*     [0, 0, 0, 1],
* ]);
*
* @class Graph
* @constructor
* @param [value] {Any} A binary matrix depicting 1s for edges. Or an object having two elements `nodes`:`Graph.Node` and `edges`:`Graph.Edge` as Arrays. Or another Graph object to clone from.
*/
var Graph = (function() {

	var Graph;

	function Graph (data) {

		if(data !== undefined && typeof data == "object" && data.constructor.name == 'Graph') {
			data = data.clone();
			this.edges = data.edges;
			this.nodes = data.nodes;
			return;
		}

		if (MatrixH.isMatrix(data)) {
			data = {
				"edges": data.slice(0)
			};
		}
		
		data = $.extend(true, {}, data);

		if(MatrixH.isMatrix(data.edges)) {
			var matrix = data.edges;
			var edges = [];

			var binaryMatrix = true;
			outLoop:
			for(var i in matrix) {
				for(var j in matrix[i]) {
					var value = matrix[i][j];
					if(value !== 0 && value !== 1 && value !== true & value !== false) {
						binaryMatrix = false;
						break outLoop;
					}
				}
			}


			for(var i in matrix) {
				for(var j in matrix[i]) {
					var value = matrix[i][j];

					if(value === false || value === 0) {
						// nothing;
					} else {
						if(binaryMatrix) {
							value = "";
						}

						edges.push({
							"source": parseInt(i),
							"target": parseInt(j),
							"label": value,
						})
					}

				}
			}

			data.edges = edges;

			if(!data.hasOwnProperty("nodes") || data.nodes.length == 0) {
				data.nodes = [];

				for(var i in matrix) {
					data.nodes.push({
						"label": i,
						"index": parseInt(i),
					});
				}
			}

		}

		for(var i in data.edges) {
			data.edges[i] = new Graph.Edge(data.edges[i]);
		}

		for(var i in data.nodes) {
			data.nodes[i] = new Graph.Node(data.nodes[i]);
		}

		this.edges = [];
		this.nodes = [];

		if(data.hasOwnProperty("edges")) {
			this.edges = data.edges;
		}

		if(data.hasOwnProperty("nodes")) {
			this.nodes = data.nodes;
		}
	};

	/**
	 * Creates a copy of a Graph.
	 * 
	 * @method clone
	 * @memberof Graph
	 * @return {Graph} Cloned graph
	 */
	Graph.prototype.clone = function() {
		//var clone = $.extend(true, Object.create(Object.getPrototypeOf(this)), this);

		var clone = new Graph();

		for(var i in this.nodes) {
			clone.nodes[i] = this.nodes[i].clone();
		}

		for(var i in this.edges) {
			clone.edges[i] = this.edges[i].clone();
		}

		return clone;
	}

	/**
	 * Converts a graph into a Matrix.
	 * 
	 * @method getMatrix
	 * @memberof Graph
	 * @return {Matrix} Resultant matrix.
	 */
	Graph.prototype.getMatrix = function() {

		var matrix = MatrixH.make(this.nodes.length, this.nodes.length);

		for(var i in this.edges) {
			matrix[this.edges[i].source][this.edges[i].target] = 1;
		}
		
		return matrix;
	}

	/**
	 * Find a node in a Graph object via its label.
	 * 
	 * @method findNode
	 * @memberof Graph
	 * @param label {String} The label to search for.
	 * @return {Graph.Node} Resultant node, or `null` if not found.
	 */
	Graph.prototype.findNode = function(label) {
		label = $.trim(label);

		for(var i in this.nodes) {
			if(this.nodes[i].label == label) {
				return this.nodes[i];
			}
		}

		return null;
	}

	/**
	 * Get a node in a Graph object via its index.
	 * 
	 * @method getNode
	 * @memberof Graph
	 * @param index {Number} The index to search for.
	 * @return {Graph.Node} Resultant node, or `null` if not found.
	 */
	Graph.prototype.getNode = function(index) {

		for(var i in this.nodes) {
			if(this.nodes[i].index == index) {
				return this.nodes[i];
			}
		}

		return null;
	}

	/**
	* A data-structure for Graph Edges
	*
	* Edge is an instantiable class. It can be defined like:
	*
	* @example
	* // Edge creation
	*
	* var edge = new Graph.Edge();
	*
	* @class Graph.Edge
	* @memberof Graph
	* @constructor
	* @param [value] {Any} Another Edge object to clone from.
	*/
	var Edge = (function () {
		function Edge(data) {
			data = $.extend(true, {}, data);
			for(var i in data) {
				this[i] = data[i];
			}
		}

		/**
		 * Creates a copy of a Edge.
		 * 
		 * @method clone
		 * @memberof Graph.Edge
		 * @return {Edge} Cloned edge
		 */
		Edge.prototype.clone = function () {
			var clone = new Edge();
			for(var i in this) {
				clone[i] = this[i];
			}
			return clone;
		};
		
		/**
		 * Returns the source/starting node for the edge.
		 * 
		 * @method getSourceNode
		 * @memberof Graph.Edge
		 * @return {Node} Source node.
		 */
		Edge.prototype.getSourceNode = function () {
			return this.graph.getNode(this.source);
		};
		
		/**
		 * Returns the target/ending node for the edge.
		 * 
		 * @method getTargetNode
		 * @memberof Graph.Edge
		 * @return {Node} Target node.
		 */
		Edge.prototype.getTargetNode = function () {
			return this.graph.getNode(this.target);
		};
		return Edge;
	})();
	Graph.Edge = Edge;

	/**
	* A data-structure for Graph Nodes
	*
	* Node is an instantiable class. It can be defined like:
	*
	* @example
	* // Node creation
	*
	* var edge = new Graph.Node();
	*
	* @class Graph.Node
	* @memberof Graph
	* @constructor
	* @param [value] {Any} Another Node object to clone from.
	*/
	var Node = (function () {
		function Node(data) {
			data = $.extend(true, {}, data);
			for(var i in data) {
				this[i] = data[i];
			}
		}

		/**
		 * Creates a copy of a Node.
		 * 
		 * @method clone
		 * @memberof Graph.Node
		 * @return {Node} Cloned node
		 */
		Node.prototype.clone = function () {
			var clone = new Node();
			for(var i in this) {
				clone[i] = this[i];
			}
			return clone;
		};
		
		/**
		 * Returns an Array of adjacent nodes of this node.
		 * 
		 * @method getAdjacentNodes
		 * @memberof Graph.Node
		 * @return {Array} An array of neighbor nodes.
		 */
		Node.prototype.getAdjacentNodes = function () {
			var nodes = [];
			for(var i in this.graph.edges) {
				if(this.graph.edges[i].source == this.index) {
					var node = this.graph.getNode(this.graph.edges[i].target);
					nodes.push(node);
				}
			}
			return nodes;
		};
		
		/**
		 * Returns an Array of adjacent edges of this node.
		 * 
		 * @method getAdjacentEdges
		 * @memberof Graph.Node
		 * @return {Array} An array of neighbor edges.
		 */
		Node.prototype.getAdjacentEdges = function () {
			var edges = [];
			for(var i in this.graph.edges) {
				if(this.graph.edges[i].source == this.index) {
					var edge = this.graph.edges[i];
					edges.push(edge);
				}
			}
			return edges;
		};
		return Node;
	})();
	Graph.Node = Node;

	return Graph;

})();

/**
* A data-structure for Maze creation and manipulation
*
* @example
* Maze is an instantiable class. It can be defined like:
*
* // Maze creation
*
* var maze = new Maze();
*
* @example
* // Maze creation from a Matrix.
*
* var maze = new Maze([
*     [0, 1, 0, 0],
*     [1, 0, 0, 0],
*     [0, 0, 0, 1],
* ]);
*
* @class Maze
* @constructor
* @param [value] {Any} A binary matrix depicting maze walls. Or an object having three elements `matrix`:`Matrix`, `markers[...]`:`Maze.Marker`, `links[...]`:`Maze.Link` and `overlays[...]`:`Object`. Or another Maze object to clone from.
*/
var Maze = (function() {

	var Maze;


	var algos = (function() {
		var algos = {};
		var c = 0;
		var seed = 0;
		var path = [];


		function dfsDiscover(start, maze, visited) {
			c++;

			visited[start.x][start.y] = true;
			maze.matrix[start.x][start.y] = true;
			path.push(start);

			if(c % 8 == 0) {
				// after 3 moves, change the seed
				seed+=8;
			}

			var neighbors = maze.getPointNeighbors(start);
			neighbors = ArrayH.shuffle(neighbors, seed);
			
			for(var i in neighbors) {
				var neighbor = neighbors[i];
				
				var occupiedNeighbors = maze.getPointNeighborsByValue(neighbor, true);
				var occupiedNeighborsDiagonal = maze.getPointDiagonalNeighborsByValue(neighbor, true);
				
				// if not visited
				if(!visited[neighbor.x][neighbor.y] && occupiedNeighbors.length <= 1 && occupiedNeighborsDiagonal.length <= 1) {
					dfsDiscover(neighbor, maze, visited);
				}
			}

		}

		algos.DFS = function(maze, data) {
			path = [];

			maze.matrix = MatrixH.make(data.width, data.height, false);
			var visited = MatrixH.make(data.width, data.height, false);

			var point = maze.getRandomPoint();

			c = 0;
			seed = Math.floor(Math.random()*10);
			dfsDiscover(point, maze, visited);

			var rangeStart = (data.width*data.height) / 90;
			var rangeEnd   = (data.width*data.height) / 90;

			var i = 0;
			while(i < path.length) {

				var point = path[i];
				maze.matrix[point.x][point.y] = false;

				i += Math.round(rangeStart + (Math.random() * rangeEnd));
			}
		}

		algos.BFS = function(maze, data) {
			path = [];

			maze.matrix = MatrixH.make(data.width, data.height, false);
			var visited = MatrixH.make(data.width, data.height, false);

			var point = maze.getRandomPoint();

			seed = Math.floor(Math.random()*10);

			var list = new Queue();
			list.add(point);

			visited[point.x][point.y] = true;
			maze.matrix[point.x][point.y] = true;

			c = 0;
			while(!list.isEmpty()) {
				c++;

				var point;

				if(c % 2 == 0) {
					point = list.removeFront();
				} else {
					point = list.remove();
				}
				path.push(point);

				if(c % 3 == 0) {
					// after 3 moves, change the seed
					seed+=3;
				}

				var neighbors = maze.getPointNeighbors(point);
				neighbors = ArrayH.shuffle(neighbors, seed);
				
				for(var i in neighbors) {
					var neighbor = neighbors[i];
					
					var occupiedNeighbors = maze.getPointNeighborsByValue(neighbor, true);
					var occupiedNeighborsDiagonal = maze.getPointDiagonalNeighborsByValue(neighbor, true);
					
					// if not visited
					if(!visited[neighbor.x][neighbor.y] && occupiedNeighbors.length <= 1 && occupiedNeighborsDiagonal.length <= 1) {

						visited[neighbor.x][neighbor.y] = true;
						maze.matrix[neighbor.x][neighbor.y] = true;

						list.add(neighbor);

					}
				}

				if(neighbors.length == 0) {
					maze.matrix[point.x][point.y] = false;
				}
			}

			//maze.invert();
			var rangeStart = (data.width*data.height) / 50;
			var rangeEnd   = (data.width*data.height) / 50;

			var i = 0;
			while(i < path.length) {

				var point = path[i];
				maze.matrix[point.x][point.y] = false;

				i += Math.round(rangeStart + (Math.random() * rangeEnd));
			}
		}

		return algos;
	})();

	function Maze (data) {

		if(data !== undefined && typeof data == "object" && data.constructor.name == 'Maze') {
			data = data.clone();
			this.matrix = data.matrix;
			this.markers = data.markers;
			this.links = data.links;
			this.overlays = data.overlays;
			return;
		}

		if (MatrixH.isMatrix(data)) {
			data = {
				"matrix": data,
				"markers": [],
				"links": [],
				"overlays": {},
			};
		}
		
		data = $.extend(true, {}, data);

		this.matrix = [[]];
		this.markers = [];
		this.links = [];
		this.overlays = {};
		if(data.hasOwnProperty("width") && data.hasOwnProperty("height")) {

			if(data.hasOwnProperty("algo")) {
				if(algos.hasOwnProperty(data.algo)) {
					algos[data.algo](this, data);
					this.algo = data.algo;
				}
			} else {
				var matrix = MatrixH.make(data.width, data.height, data.hasOwnProperty("value") ? data.value : false);
				this.matrix = matrix;
			}
		}

		if(data.hasOwnProperty("matrix")) {
			this.matrix = data.matrix;
		}

		if(data.hasOwnProperty("links")) {
			this.links = data.links;
		}

		if(data.hasOwnProperty("overlays")) {
			this.overlays = data.overlays;
		}

		if(data.hasOwnProperty("markers")) {

			var markers;
			if($.isNumeric(data.markers) || typeof data.markers == 'string') {

				var ids = [];
				if(typeof data.markers == 'string') {
					ids = data.markers.split(",");
				} else {
					for(var i = 0; i < data.markers; i++) {
						ids.push(i);
					}
				}

				markers = [];
				var centerX = data.width/2;
				var centerY = data.height/2;

				for(var i in ids) {
					var id = ids[i];
					var marker = new Maze.Marker();
					var angle = ((i/ids.length)*360) * (Math.PI/180);
					marker.y = Math.round(centerY + Math.sin(angle) * centerY * 0.8);
					marker.x = Math.round(centerX - Math.cos(angle) * centerX * 0.8);
					marker.color = ColorH.getColorName(i);
					marker.id = id;
					markers.push(marker)
				}

				this.markers = markers;
				this.fixMarkersPosition();

			} else {
				this.markers = data.markers;
			}

		}
	};

	/**
	 * Find a marker in a Maze object via its ID.
	 * 
	 * @method findMarker
	 * @memberof Maze
	 * @param id {String} The id to search for.
	 * @return {Maze.Marker} Resultant marker, or `null` if not found.
	 */
	Maze.prototype.findMarker = function(id) {
		id = $.trim(id);

		for(var i in this.markers) {
			if(this.markers[i].id == id) {
				return this.markers[i];
			}
		}

		return null;
	}

	/**
	 * Create a matrix with the same dimentions as this Maze.
	 * 
	 * @method makePointsMatrix
	 * @memberof Maze
	 * @param value {Any} The value to fill-in.
	 * @return {Matrix} Resultant matrix.
	 */
	Maze.prototype.makePointsMatrix = function(value) {

		var width = MatrixH.getTotalRows(this.matrix);
		var height = MatrixH.getTotalColumns(this.matrix);

		var blank = MatrixH.make(width, height, value);
		return blank;
	}

	/**
	 * Add an overlay on the maze (a matrix of colors).
	 * 
	 * @method addOverlay
	 * @memberof Maze
	 * @param id {String} ID of the overlay.
	 * @param color {Any} The value to fill-in.
	 * @return {Matrix} Resultant matrix.
	 */
	Maze.prototype.addOverlay = function(id, color) {

		var width = MatrixH.getTotalRows(this.matrix);
		var height = MatrixH.getTotalColumns(this.matrix);

		var matrix = MatrixH.make(width, height, color);

		this.overlays[id] = matrix;

		return matrix;
	}

	/**
	 * Randomly generate a maze.
	 * 
	 * @method randomize
	 * @memberof Maze
	 */
	Maze.prototype.randomize = function() {

		var algo = "DFS";

		if(this.hasOwnProperty("algo")) {
			algo = this.algo;
		}

		if(algos.hasOwnProperty(algo)) {
			var data = {
				width: MatrixH.getTotalRows(this.matrix),
				height: MatrixH.getTotalColumns(this.matrix),
			};
			algos[algo](this, data);
		}

		this.fixMarkersPosition();
	};

	/**
	 * If any marker is on a wall. It is adjusted.
	 * 
	 * @method fixMarkersPosition
	 * @memberof Maze
	 */
	Maze.prototype.fixMarkersPosition = function() {


		for(var i in this.markers) {
			var marker = this.markers[i];
			var value = this.matrix[marker.x][marker.y];

			// on a wall
			if (value == true) {

				// get the maze point
				var point = marker.getPoint();

				// get neighbor points (not walls)
				var neighbors = this.getPointNeighborsByValue(point, false);

				if(neighbors.length > 0) {
					marker.x = neighbors[0].x;
					marker.y = neighbors[0].y;
				} else {

					// now try dialgonal neighbor points (not walls)
					var neighbors = this.getPointDiagonalNeighborsByValue(point, false);

					if(neighbors.length > 0) {
						marker.x = neighbors[0].x;
						marker.y = neighbors[0].y;
					} else {
						// probability ~ 0 for a good maze
						// DFS/BFS could be used here
					}

				}
			}
		}
		
	};

	/**
	 * Clear the maze. Remove all walls.
	 * 
	 * @method clear
	 * @memberof Maze
	 */
	Maze.prototype.clear = function() {
		MatrixH.fill(this.matrix, false);
	};

	/**
	 * Invert the maze. Walls become spaces and vice-versa.
	 * 
	 * @method invert
	 * @memberof Maze
	 */
	Maze.prototype.invert = function() {
		MatrixH.invert(this.matrix, false);
	};

	/**
	 * Extract a random Point(`x`,`y`) from the Maze.
	 * 
	 * @method getRandomPoint
	 * @memberof Maze
	 * @return {Point} Point having `x` and `y` values.
	 */
	Maze.prototype.getRandomPoint = function() {
		try {
			return {
				x: Math.floor(this.matrix.length * Math.random()),
				y: Math.floor(this.matrix[0].length * Math.random()),
			};
		} catch(e) {		
			return {
				x: 0,
				y: 0,
			};
		}
	};

	/**
	 * Get neighbors/adjacent points of a given Point.
	 * 
	 * @method getPointNeighbors
	 * @memberof Maze
	 * @param point {Point} Input point.
	 * @return {Array} An array of neighbor Points.
	 */
	Maze.prototype.getPointNeighbors = function(point) {
		var width = this.matrix.length;
		var height = this.matrix[0].length;
		var x = point.x;
		var y = point.y;
		var edges = [];

		if(x+1 < width) {
			edges.push({
				x: x+1,
				y: y,
			});
		}

		if(x-1 >= 0) {
			edges.push({
				x: x-1,
				y: y,
			});
		}

		if(y+1 < height) {
			edges.push({
				x: x,
				y: y+1,
			});
		}

		if(y-1 >= 0) {
			edges.push({
				x: x,
				y: y-1,
			});
		}

		return edges;
	};

	/**
	 * Get diagonal neighbors/adjacent points of a given Point.
	 * 
	 * @method getPointDiagonalNeighbors
	 * @memberof Maze
	 * @param point {Point} Input point.
	 * @return {Array} An array of neighbor Points.
	 */
	Maze.prototype.getPointDiagonalNeighbors = function(point) {
		var width = this.matrix.length;
		var height = this.matrix[0].length;
		var x = point.x;
		var y = point.y;
		var edges = [];

		// extended
			
		
		if(y+1 < height && x+1 < width) {
			edges.push({
				x: x+1,
				y: y+1,
			});
		}
		
		if(y-1 >= 0 && x-1 >= 0) {
			edges.push({
				x: x-1,
				y: y-1,
			});
		}
		
		if(y+1 < height && x-1 >= 0) {
			edges.push({
				x: x-1,
				y: y+1,
			});
		}
		
		if(y-1 >= 0 && x+1 < width) {
			edges.push({
				x: x+1,
				y: y-1,
			});
		}
		

		return edges;
	};

	/**
	 * Get neighbors/adjacent points of a given Point having a given `value`.
	 * 
	 * @method getPointNeighborsByValue
	 * @memberof Maze
	 * @param point {Point} Input point.
	 * @param value {Any} Value to compare with (1 or 0).
	 * @return {Array} An array of neighbor Points.
	 */
	Maze.prototype.getPointNeighborsByValue = function(point, value) {
		var edges = this.getPointNeighbors(point);
		var newEdges = [];
		for(var i in edges) {
			var edge = edges[i];
			if(this.matrix[edge.x][edge.y] == value) {
				newEdges.push(edge);
			}
		}
		return newEdges;
	};

	/**
	 * Get diagonal neighbors/adjacent points of a given Point having a given `value`.
	 * 
	 * @method getPointDiagonalNeighborsByValue
	 * @memberof Maze
	 * @param point {Point} Input point.
	 * @param value {Any} Value to compare with (1 or 0).
	 * @return {Array} An array of neighbor Points.
	 */
	Maze.prototype.getPointDiagonalNeighborsByValue = function(point, value) {
		var edges = this.getPointDiagonalNeighbors(point);
		var newEdges = [];
		for(var i in edges) {
			var edge = edges[i];
			if(this.matrix[edge.x][edge.y] == value) {
				newEdges.push(edge);
			}
		}
		return newEdges;
	};

	/**
	 * Get a random edge from a Maze.
	 * 
	 * @method getRandomEdge
	 * @memberof Maze
	 * @return {Edge} An object having `start`:`Point` and `end`:`Point` values.
	 */
	Maze.prototype.getRandomEdge = function() {
		var i = 0;
		
		var point = this.getRandomPoint();
		var neighbors = this.getPointNeighbors(point);
		var neighbor = neighbors[Math.floor(neighbors.length * Math.random())];

		var edge = {
			start:point,
			end: neighbor,
		}

		return edge;
	};

	/**
	 * Get a farther point from an edge (`start`,`end`).
	 * 
	 * @method getFarPoint
	 * @memberof Maze
	 * @param start {Point} Starting point.
	 * @param end {Point} Ending point.
	 * @param [length=2] {Number} Length of the resulting point.
	 * @return {Point} An object having `x`:`Number` and `y`:`Number` values.
	 */
	Maze.prototype.getFarPoint = function(start, end, length) {
		var width = this.matrix.length;
		var height = this.matrix[0].length;

		if(length === undefined) {
			length = 2;
		}
		
		var newPoint = {
			x: Math.min(width-1,  Math.max(0, start.x + ((end.x - start.x) * length))),
			y: Math.min(height-1, Math.max(0, start.y + ((end.y - start.y) * length))),
		};

		return newPoint;
	};


	/**
	 * Creates a copy of a Maze.
	 * 
	 * @method clone
	 * @memberof Maze
	 * @return {Maze} Cloned maze
	 */
	Maze.prototype.clone = function() {
		var clone = new Maze();
		//clone.matrix = this.matrix.shift().shift();
		clone.matrix = [];

		for(var i = 0; i < this.matrix.length; i++) {
			var row = [];
			for(var j = 0; j < this.matrix[i].length; j++) {
				row.push(this.matrix[i][j]);
			}
			clone.matrix.push(row);
		}


		for(var i in this.markers) {
			clone.markers[i] = this.markers[i].clone();
		}

		for(var i in this.links) {
			clone.links[i] = this.links[i].clone();
		}

		for(var i in this.overlays) {
			clone.overlays[i] = MatrixH.clone(this.overlays[i]);
		}

		return clone;
	}

	/**
	 * Adds a path to the maze.
	 * 
	 * @method addPath
	 * @memberof Maze
	 * @param path {Array} An array of objects having `x` and `y` attributes.
	 * @param [color='gray'] {String} Path color.
	 * @return {Maze} Cloned maze
	 */
	Maze.prototype.addPath = function(path, color) {

		if(color == undefined) {
			color = "gray";
		}

		for(var i = 1; i < path.length; i++) {
			var link = new Maze.Link({
				"start": {
					x: path[i-1].x,
					y: path[i-1].y,
				},
				"end": {
					x: path[i].x,
					y: path[i].y,
				},
				"color": color,
			});
			this.links.push(link);
		}
	}

	/**
	 * Find a path between two points.
	 * 
	 * @method findPath
	 * @memberof Maze
	 * @param x1 {Number} `x` value of the starting point.
	 * @param y1 {Number} `y` value of the starting point.
	 * @param x2 {Number} `x` value of the ending point.
	 * @param y2 {Number} `y` value of the ending point.
	 * @param [diagonal=false] {boolean} Whether the path can be diagonal or not.
	 * @return {Maze} Cloned maze
	 */
	Maze.prototype.findPath = function(x1, y1, x2, y2, diagonal) {

		var endCondition;
		if(typeof x2 == 'function') {
			endCondition = x2;
			diagonal = y2;
		}

		if(diagonal === undefined) {
			diagonal = false;
		}

	    var visited = this.makePointsMatrix(false);
	    var counts = this.makePointsMatrix(999999);

    	var currentPoint = {
    		x: x1,
    		y: y1,
    	};

    	var endPoint = {
    		x: x2,
    		y: y2,
    	};

	    var queue = new Queue();

		counts[currentPoint.x][currentPoint.y] = 0;
		visited[currentPoint.x][currentPoint.y] = true;

		var j = 0;
	    while(true) {
	        j++;
	        
	        if(endCondition) {

	        	var toBreak = endCondition(this.matrix[currentPoint.x][currentPoint.y], currentPoint.x, currentPoint.y);

	        	if(toBreak) {
	        		endPoint = currentPoint;
	        		break;
	        	}

	        } else if(currentPoint.x == endPoint.x && currentPoint.y == endPoint.y) {
	            break;
	        }
	        
	        // get all adjacent points
	        var adjacentPoints = this.getPointNeighbors(currentPoint);

	        if(diagonal) {
	        	adjacentPoints = adjacentPoints.concat(this.getPointDiagonalNeighbors(currentPoint));
	        }
	        
	        for(var i in adjacentPoints) {
	            var point = adjacentPoints[i];
	            
	            // point is not a wall
	            if(this.matrix[point.x][point.y] == false) {
	                
	                // point is not visited
	                if(visited[point.x][point.y] == false) {

	                    queue.add(point);
	                    counts[point.x][point.y] = j;
	                }
	                
	            }
	            
	            visited[point.x][point.y] = true;
	        }
	        
	        if(queue.length == 0) {
	            return false;
	        }
	        currentPoint = queue.remove();
	    }

        var point = endPoint;
	    var result = [point];

        var minWeight = 9999999;
        var j = 0;
        while(true) {
            var adjacentPoints = this.getPointNeighbors(point);
            
	        if(diagonal) {
	        	adjacentPoints = adjacentPoints.concat(this.getPointDiagonalNeighbors(point));
	        }

            var minPoint = null;
            for(var i in adjacentPoints) {
                var adjacentPoint = adjacentPoints[i];
                var weight = counts[adjacentPoint.x][adjacentPoint.y];
                
                if(weight < minWeight) {
                    minWeight = weight;
                    minPoint = adjacentPoint;
                }
            }
            
            
            if(minPoint == null) {
                break;
            } else {
                point = minPoint;
                result.push(point);
            }
        
            j++;
        }

        result.reverse();

	    return result;
	}


	/**
	* A data-structure for Maze markers
	*
	* Marker is an instantiable class. It can be defined like:
	*
	* @example
	* // Marker creation
	*
	* var marker = new Maze.Marker();
	*
	* @class Maze.Marker
	* @memberof Maze
	* @constructor
	* @param [value] {Any} Another Marker object to clone from.
	*/
	var Marker = (function () {
		function Marker(data) {
			data = $.extend(true, {}, data);
			for(var i in data) {
				this[i] = data[i];
			}
		}

		/**
		 * Get the location of the marker.
		 * 
		 * @method getPoint
		 * @memberof Maze.Marker
		 * @return {Point} An object having `x`:`Number` and `y`:`Number` values.
		 */
		Marker.prototype.getPoint = function() {
			return {
				x: this.x,
				y: this.y,
			}
		}

		/**
		 * Creates a copy of a Marker.
		 * 
		 * @method clone
		 * @memberof Maze.Marker
		 * @return {Marker} Cloned link
		 */
		Marker.prototype.clone = function () {
			var clone = new Marker();
			for(var i in this) {
				clone[i] = this[i];
			}
			return clone;
		};
		return Marker;
	})();
	Maze.Marker = Marker;

	/**
	* A data-structure for Maze links
	*
	* Link is an instantiable class. It can be defined like:
	*
	* @example
	* // Link creation
	*
	* var link = new Maze.Link();
	*
	* @class Maze.Link
	* @memberof Maze
	* @constructor
	* @param [value] {Any} Another Link object to clone from.
	*/
	var Link = (function () {
		function Link(data) {
			data = $.extend(true, {}, data);
			for(var i in data) {
				this[i] = data[i];
			}
		}

		/**
		 * Creates a copy of a Link.
		 * 
		 * @method clone
		 * @memberof Maze.Link
		 * @return {Link} Cloned link
		 */
		Link.prototype.clone = function () {
			var clone = new Link();
			clone.start = {
				x: this.start.x,
				y: this.start.y,
			}
			clone.end = {
				x: this.end.x,
				y: this.end.y,
			}
			clone.color = this.color;
			return clone;
		};
		return Link;
	})();
	Maze.Link = Link;

	return Maze;

})();


/**
* A data-structure for linked-lists
*
* @example
* LinkedList is an instantiable class. It can be defined like:
*
*     // LinkedList creation
*
*     var list = new LinkedList();
*
* @example
*     // LinkedList usage
*     list.add("value");
*     list.remove("value");
*     var array = list.getArray();
*
* @class LinkedList
* @constructor
* @param [value] {Array} Another Array to clone from.
*/
var LinkedList = (function() {

	function Node(data) {
		this.next = null;
		this.data = data;
	};

	function LinkedList(params) {

		this.start = null;
		this.end = null;
		this.length = 0;

		if(Array.isArray(params)) {
			for(var i in params) {
				this.add(params[i]);
			}
		}
	};

	/**
	 * Add an item into a LinkedList.
	 * 
	 * @method add
	 * @memberof LinkedList
	 * @param item {Any} A value.
	 */
	LinkedList.prototype.add = function(data) {
		if (data === undefined) throw new Error("Data must be defined.");
		var newNode = new Node(data);
		if (this.start === null) {
			this.start = newNode;
		} else {
			this.end.next = newNode;
		}
		this.length++;
		this.end = newNode;
	};
	
	/**
	 * Remove an item from a LinkedList.
	 * 
	 * @method remove
	 * @memberof LinkedList
	 * @param item {Any} A value.
	 */
	LinkedList.prototype.remove = function(data) {
		if (data === undefined) throw new Error("Data must be defined.");
		if (this.start === null) return;
		var previous = null;
		var current = this.start;
		while ((current !== null) && (current.data !== data)) {
			previous = current;
			current = current.next;
		}
		if (current !== null) {
			if (previous === null) {
				this.start = this.start.next;
			}
			if (current.next === null) {
				this.end = previous;
				if (this.end !== null) {
					this.end.next = null;
				}
			}
			if ((previous !== null) && (current.next !== null)) {
				previous.next = current.next;
			}
			this.length--;
		}
	};

	/**
	 * Create an array out of a linked-list.
	 * 
	 * @method getArray
	 * @memberof LinkedList
	 * @return {Array} An array having the LinkedList items.
	 */
	LinkedList.prototype.getArray = function() {
		var array = [];
		var node = this.start;

		while(node !== null) {
			array.push(node.data);
			node = node.next;
		}

		return array;
	}

	return LinkedList;

})();

var StackQueue = (function() {

	function StackQueue(params) {
		this.list = new LinkedList();
		this.length = 0;

		if(Array.isArray(params)) {
			for(var i in params) {
				this.push(params[i]);
			}
		}
	};

	StackQueue.prototype.push = function(data) {
		this.list.add(data);
		this.length++;
	};

	StackQueue.prototype.pop = function() {
		if (this.isEmpty()) throw new Error("The stack is empty");
		var results = this.peek();
		this.list.remove(results);
		this.length--;
		return results;
	};

	StackQueue.prototype.isEmpty = function() {
		return this.length === 0;
	};

	StackQueue.prototype.clear = function() {
		this.list = new LinkedList();
		this.length = 0;
	};

	StackQueue.prototype.peek = function() {
		return this.isEmpty() ? null : this.getNext();
	};

	return StackQueue;

})();

/**
* A data-structure for queues
*
* Queue is an instantiable class. It can be defined like:
*
* @example
*     // Queue creation
* 
*     var queue = new Queue();
* 
* @example
*     // Queue usage
*     queue.add("value");
*     var value = queue.remove();
*     var array = list.list;
*
* @class Queue
* @constructor
* @param [value] {Array} Another Array to clone from.
*/
var Queue = (function() {

	function Queue(params) {
		StackQueue.apply(this, arguments);
	};

	Queue.prototype = new StackQueue();

	/**
	 * Get the first element of a queue.
	 * 
	 * @method getFirst
	 * @memberof Queue
	 * @return {Any} Element value.
	 */
	Queue.prototype.getFirst = function() {
		return this.list.end.data;
	};

	/**
	 * Get the next element from a queue.
	 * 
	 * @method getNext
	 * @memberof Queue
	 * @return {Any} Element value.
	 */
	Queue.prototype.getNext = function() {
		return this.list.start.data;
	};

	/**
	 * Add an item into a queue.
	 * 
	 * @method add
	 * @memberof Queue
	 * @param item {Any} A value.
	 */
	Queue.prototype.add = Queue.prototype.push;
	
	/**
	 * Remove an item from a queue.
	 * 
	 * @method remove
	 * @memberof Queue
	 * @return {Any} Element value.
	 */
	Queue.prototype.remove = Queue.prototype.pop;

	/**
	 * Remove an item from the front of a queue.
	 * 
	 * @method removeFront
	 * @memberof Queue
	 * @return {Any} Element value.
	 */
	Queue.prototype.removeFront = function() {
		if (this.isEmpty()) throw new Error("The queue is empty");
		var results = this.getFirst();
		this.list.remove(results);
		this.length--;
		return results;
	};

	return Queue;

})();

/**
* A data-structure for stacks
*
* @example
* Stack is an instantiable class. It can be defined like:
*
*     // Stack creation
*
*     var stack = new Stack();
* 
* @example
*     // Stack usage
*     stack.push("value");
*     var value = stack.pop();
*     var array = list.list;
*
* @class Stack
* @constructor
* @param [value] {Array} Another Array to clone from.
*/
var Stack = (function() {

	function Stack(params) {
		StackQueue.apply(this, arguments);
	};

	/**
	 * Push an item into a stack.
	 * 
	 * @method push
	 * @memberof Stack
	 * @param item {Any} A value.
	 */

	/**
	 * Remove an item from a stack.
	 * 
	 * @method pop
	 * @memberof Stack
	 * @return {Any} Element value.
	 */

	Stack.prototype = new StackQueue();

	Stack.prototype.getFirst = function() {
		return this.list.start.data;
	};

	Stack.prototype.getNext = function() {
		return this.list.end.data;
	};

	return Stack;

})();

// MODULES FROM ONWARDS

/**
* Provides common functions for basic JavaScript manipulation.
*
* @exports Helpers
*/
var Helpers;
(function (Helpers) {

	/**
	 * Converts an object into its JSON equivilant in HTML tags.
	 * 
	 * @method Helpers:jsonIze
	 * @static
	 * @param object {Object} The object being converted
	 * @return {String} JSON representation of object in HTML
	 */
	Helpers.jsonIze = function(json) {
		if (typeof json != 'string') {
			seen = [];
			json = JSON.stringify(json, function(key, val) {
			   if (val != null && typeof val == "object") {
					if (seen.indexOf(val) >= 0)
						return
					seen.push(val)
				}
				return val
			}, 5);
		}
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return "<div class='json-dump'>" + json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		}) + "</div>";
	}

	/**
	 * Gets the type of any given variable
	 * 
	 * @method Helpers:getType
	 * @static
	 * @param object {Object} The object being converted
	 * @return {String} Type of the object
	 */
	Helpers.getType = function(obj) {
		if(typeof obj == 'object') {
			if('constructor' in obj) {
				if(obj.constructor.name != '') {
					return obj.constructor.name;
				}
			}
		}
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}

	Helpers.resolveComparisonMethod = function(method) {

		if(method == '=' || method == '==') {
			return function(cellValue, comparisonValue) {
				return cellValue == comparisonValue;
			}
		} else if(method == '===') {
			return function(cellValue, comparisonValue) {
				return cellValue === comparisonValue;
			}
		} else if(method == '<') {
			return function(cellValue, comparisonValue) {
				return cellValue < comparisonValue;
			}
		} else if(method == '>') {
			return function(cellValue, comparisonValue) {
				return cellValue > comparisonValue;
			}
		} else if(method == '<=') {
			return function(cellValue, comparisonValue) {
				return cellValue <= comparisonValue;
			}
		} else if(method == '>=') {
			return function(cellValue, comparisonValue) {
				return cellValue >= comparisonValue;
			}
		} else if($.isFunction(method)) {
			//..
		}

		return method;
	}

	/**
	 * Universal loop.
	 * Iterates through Matrix, Arrays, or Objects.
	 * 
	 * @method Helpers:each
	 * @static
	 * @param obj {Any} Matrix, Array, or Object
	 * @param callback {Function} Callback function with parameters:
	 * @param callback.value {Any} Callback value
	 * @param callback.index {Number} Callback index
	 */
	Helpers.each = function(obj, callback) {
		var iterator;
		if(MatrixH.isMatrix(obj)) {
			iterator = MatrixH.each;
		} else if (Array.isArray(obj)) {
			iterator = ArrayH.each;
		} else if (ObjectH.isObject(obj)) {
			iterator = ObjectH.each;
		}
		iterator(obj, callback);
	}

	/**
	 * Universal Helpers:clone.
	 * Clones Matrix, Arrays, or Objects.
	 * 
	 * @method clone
	 * @static
	 * @param obj {Any} Matrix, Array, or Object
	 * @return {Any} Cloned value
	 */
	Helpers.clone = function(obj) {
		var func;
		if(MatrixH.isMatrix(obj)) {
			func = MatrixH.clone;
		} else if (Array.isArray(obj)) {
			func = ArrayH.clone;
		} else if (ObjectH.isObject(obj)) {
			func = ObjectH.clone;
		}
		return func(obj);
	}

	Helpers.resolveDistanceMethod = function(method) {
		if(method === undefined || method == 'euclidean') {
			method = function(x1, y1, x2, y2) {
				return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
			}
		} else if($.isFunction(method)) {
			//..
		}
		return method;
	}

	var timers = {};

	/**
	 * Start a timer. Similar to vanilla setInterval.
	 * 
	 * @method startTimer
	 * @static
	 * @param id {String} Timer ID.
	 * @param callback {Function} Code to execute.
	 * @param interval {Number} Interval in millisec.
	 */
	Helpers.startTimer = function(id, callback, interval) {
		
		var handler = setInterval(callback, interval);
		timers[id] = handler;
	}

	/**
	 * Stop a timer.
	 * 
	 * @method stopTimer
	 * @static
	 * @param id {String} Timer ID.
	 */
	Helpers.stopTimer = function(id) {
		
		var handler = timers[id];
		clearInterval(handler);
		delete timers[id];
	}

	/**
	 * Stop all timers.
	 * 
	 * @method stopAllTimers
	 * @static
	 */
	Helpers.stopAllTimers = function(id) {

		for(var i in timers) {
			Helpers.stopTimer(i);
		}
	}

})(Helpers || (Helpers = {}));


/**
* Provides common functions for color manipulation.
*
* @exports ColorH
*/
var ColorH;
(function (ColorH) {

	// active colors
	var activeColors = {
		green: "#2ECC40",
		red: "#FF4136",
		aqua: "#7FDBFF",
		blue: "#0074D9",
		lime: "#01FF70",
		navy: "#001F3F",
		teal: "#39CCCC",
		olive: "#3D9970",
		maroon: "#85144B",
		orange: "#FF851B",
		purple: "#B10DC9",
		yellow: "#FFDC00",
		fuchsia: "#F012BE",
		gray: "#aaa",
		white: "#fff",
		black: "#111",
		silver: "#ddd"
	};

	// passive colors (faded out)
	var passiveColors = [
		"#64B5F6",
		"#90A4AE",
		"#81C784",
		"#e57373",
		"#BA68C8",
		"#FFB74D",
		"#F06292",
		"#4DB6AC",
		"#FFD54F",
		"#A1887F",
		"#9575CD",
		"#E0E0E0",
		"#26C6DA",
		"#7986CB",
		"#FFF176",
		"#AED581",
		"#4DD0E1",
		"#DCE775",
		"#4FC3F7",
		"#FF8A65",
	]

	/**
	 * Converts a color name into its modern color value
	 * 
	 * @method ColorH:getColor
	 * @static
	 * @param color {String} Color name
	 * @return {String} HEX color value
	 */
	ColorH.getColor = function(color) {
		if(color == null) {
			color = 'green';
		}
		if(activeColors.hasOwnProperty(color)) {
			return activeColors[color];
		}
		return color;
	}

	/**
	 * Creates a color name from an index
	 * 
	 * @method ColorH:getColorName
	 * @static
	 * @param index {Number} A numerical index
	 * @return {String} Color name
	 */
	ColorH.getColorName = function(index) {
		var color;
		var j = 0;
		for(var i in activeColors) {
			if(j == index) {
				return i;
			}
			j++;
		}
		return 'gray';
	}

	/**
	 * Creates a light color HEX from an index
	 * 
	 * @method ColorH:getPassiveColor
	 * @static
	 * @param index {Number} A numerical index
	 * @return {String} HEX color value
	 */
	ColorH.getPassiveColor = function(index) {
		var index = index % passiveColors.length;
		var color = passiveColors[index];
		return color;
	}

	/**
	 * Get RGB channels from HEX
	 * 
	 * @method ColorH:getRGB
	 * @static
	 * @param hex {String} HEX color input
	 * @return {Object} R, G and B channels
	 */
	ColorH.getRGB = function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	/**
	 * Desaturate RGB
	 * 
	 * @method ColorH:desaturateComponents
	 * @static
	 * @param components {Object} RGB object
	 * @param level {Number} Level of desaturation (0-1)
	 * @return {Object} R, G and B channels
	 */
	ColorH.desaturateComponents = function(components, level) {
		var intensity = 0.3 * components.r + 0.59 * components.g + 0.11 * components.b;
		return {
			r: Math.floor(intensity * level + components.r * (1 - level)),
			g: Math.floor(intensity * level + components.g * (1 - level)),
			b: Math.floor(intensity * level + components.b * (1 - level)),
		}
	}

	/**
	 * Get css style rgba() notation from HEX and alpha
	 * 
	 * @method ColorH:rgbaFromHex
	 * @static
	 * @param hex {String} Hex color notation
	 * @param alpha {Number} Transparency (0-1)
	 * @return {String} rgba() notation
	 */
	ColorH.rgbaFromHex = function(hex, alpha) {
		var components = ColorH.getRGB(hex);
		return "rgba(" + components.r + "," + components.g + "," + components.b + "," + alpha + ")";
	}

	/**
	 * Get css style rgba() notation from RBG components and alpha
	 * 
	 * @method ColorH:rgbaFromHex
	 * @static
	 * @param components {Object} RGB object
	 * @param alpha {Number} Transparency (0-1)
	 * @return {String} rgba() notation
	 */
	ColorH.makeRBGA = function(components, alpha) {
		return "rgba(" + components.r + "," + components.g + "," + components.b + "," + alpha + ")";
	}

})(ColorH || (ColorH = {}));


/**
* Provides common functions for digital image processing.
*
* @exports ImageProcessingH
*/
var ImageProcessingH;
(function (ImageProcessingH) {


	/**
	 * Make a canvas from the dimentions
	 * 
	 * @method ImageProcessingH:makeCanvas
	 * @static
	 * @param width {Number} Width of the canvas
	 * @param height {Number} Height of the canvas
	 * @return {Canvas} HTML canvas element
	 */
	ImageProcessingH.makeCanvas = function(width, height) {
		var c = document.createElement('canvas');
		c.width = width;
		c.height = height;
		return c;
	}

	/**
	 * Get pixels data from an image
	 * 
	 * @method ImageProcessingH:getPixels
	 * @static
	 * @param image {HTMLImageElement} HTML image element
	 * @return {Object} data containing array of image pixels
	 */
	ImageProcessingH.getPixels = function(img) {
		var c = ImageProcessingH.makeCanvas(img.width, img.height);
		var ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0);
		return ctx.getImageData(0,0,c.width,c.height);
	}

	/**
	 * Makes an image element out of pixels data
	 * 
	 * @method ImageProcessingH:makeImage
	 * @static
	 * @param pixels {Array} Array of image pixels
	 * @return {HTMLImageElement} HTML image element
	 */
	ImageProcessingH.makeImage = function(pixels) {
		var c = ImageProcessingH.makeCanvas(pixels.width, pixels.height);
		var ctx = c.getContext('2d');
		ctx.putImageData(pixels, 0, 0);

		var image = $("<img src='' />").get(0);
		var pngUrl = c.toDataURL();
		image.setAttribute("src", pngUrl);

		return image;
	}

	/**
	 * Creates blank image data out of dimentions
	 * 
	 * @method ImageProcessingH:createImageData
	 * @static
	 * @param width {Number} Width of the canvas
	 * @param height {Number} Height of the canvas
	 * @return {Object} data containing array of image pixels
	 */
	ImageProcessingH.createImageData = function(width, height) {
		var tmpCanvas = document.createElement('canvas');
		var tmpCtx = tmpCanvas.getContext('2d');
		return tmpCtx.createImageData(width, height);
	}

	/**
	 * Gets Base64 out of an image
	 * 
	 * @method ImageProcessingH:getBase64
	 * @static
	 * @param image {HTMLImageElement} HTML image element
	 * @return {String} Base64 data
	 */
	ImageProcessingH.getBase64 = function(img, mime) {
		var c = ImageProcessingH.makeCanvas(img.width, img.height);
		var ctx = c.getContext('2d');
		ctx.drawImage(img, 0, 0);
		return c.toDataURL(mime);
	}

	/**
	 * Convert image into greyscale
	 * 
	 * @method ImageProcessingH:grayscale
	 * @static
	 * @param pixels {Object} data containing array of image pixels
	 * @return {Object} modified data
	 */
	ImageProcessingH.grayscale = function(pixels) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i + 1];
			var b = d[i + 2];
			// CIE luminance for the RGB
			// The human eye is bad at seeing red and blue, so we de-emphasize them.
			var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
			d[i] = d[i + 1] = d[i + 2] = v
		}
		return pixels;
	};

	/**
	 * Brighten the image
	 * 
	 * @method ImageProcessingH:brighten
	 * @static
	 * @param pixels {Object} data containing array of image pixels
	 * @param adjustment {Number} Numerical adjustment [0-255]
	 * @return {Object} modified data
	 */
	ImageProcessingH.brighten = function(pixels, adjustment) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			d[i] += adjustment;
			d[i + 1] += adjustment;
			d[i + 2] += adjustment;
		}
		return pixels;
	};

	/**
	 * Apply threshold filter on the image
	 * 
	 * @method ImageProcessingH:threshold
	 * @static
	 * @param pixels {Object} data containing array of image pixels
	 * @param adjustment {Number} Numerical threshold [0-255]
	 * @return {Object} modified data
	 */
	ImageProcessingH.threshold = function(pixels, threshold) {
		var d = pixels.data;
		for (var i = 0; i < d.length; i += 4) {
			var r = d[i];
			var g = d[i + 1];
			var b = d[i + 2];
			var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
			d[i] = d[i + 1] = d[i + 2] = v
		}
		return pixels;
	};

	/**
	 * Apply the convolution filter on the image. Can be used for sharpness, blur and many other effects.
	 * 
	 * @method ImageProcessingH:convolute
	 * @static
	 * @param pixels {Object} data containing array of image pixels
	 * @param weights {Matrix} Convolution matrix
	 * @param opaque {Boolean} Image opacity preservation?
	 * @return {Object} modified data
	 */
	ImageProcessingH.convolute = function(pixels, weights, opaque) {
		var side = weights.length;
		var halfSide = Math.floor(side / 2);
		var src = pixels.data;
		var sw = pixels.width;
		var sh = pixels.height;
		// pad output by the convolution matrix
		var w = sw;
		var h = sh;
		var output = ImageProcessingH.createImageData(w, h);
		var dst = output.data;
		// go through the destination image pixels
		var alphaFac = opaque ? 1 : 0;
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var sy = y;
				var sx = x;
				var dstOff = (y * w + x) * 4;
				// calculate the weighed sum of the source image pixels that
				// fall under the convolution matrix
				var r = 0,
					g = 0,
					b = 0,
					a = 0;
				for (var cy = 0; cy < side; cy++) {
					for (var cx = 0; cx < side; cx++) {
						var scy = sy + cy - halfSide;
						var scx = sx + cx - halfSide;
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
							var srcOff = (scy * sw + scx) * 4;
							var wt = weights[cx][cy];
							r += src[srcOff] * wt;
							g += src[srcOff + 1] * wt;
							b += src[srcOff + 2] * wt;
							a += src[srcOff + 3] * wt;
						}
					}
				}
				dst[dstOff] = r;
				dst[dstOff + 1] = g;
				dst[dstOff + 2] = b;
				dst[dstOff + 3] = a + alphaFac * (255 - a);
			}
		}
		return output;
	};

})(ImageProcessingH || (ImageProcessingH = {}));

/**
* Provides common functions for mathematical operations on Matrices, Arrays, Objects and Numbers.
*
* @exports MathH
*/
var MathH;
(function(MathH) {

	// redundancy, to increase performance

	/**
	 * Gets an absolute value from a number.
	 * 
	 * @method MathH:abs
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object
	 * @return {Any} Absolute value
	 */
	MathH.abs = function(obj) {
		if(!isNaN(obj)) {
			return Math.abs(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.abs(val);
		});
		return obj2;
	}

	/**
	 * Gets the arc cosine from a number.
	 * 
	 * @method MathH:acos
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Arc cosine value
	 */
	MathH.acos = function(obj) {
		if(!isNaN(obj)) {
			return Math.acos(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.acos(val);
		});
		return obj2;
	}

	/**
	 * Gets the arc sine from a number.
	 * 
	 * @method MathH:asin
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Arc sin value
	 */
	MathH.asin = function(obj) {
		if(!isNaN(obj)) {
			return Math.asin(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.asin(val);
		});
		return obj2;
	}

	/**
	 * Gets the arc tangent from a number.
	 * 
	 * @method MathH:atan
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Arc tan value
	 */
	MathH.atan = function(obj) {
		if(!isNaN(obj)) {
			return Math.atan(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.atan(val);
		});
		return obj2;
	}

	/**
	 * Gets the arc tangent (all quadrants) from a number.
	 * 
	 * @method MathH:atan2
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Arc tan value
	 */
	MathH.atan2 = function(obj) {
		if(!isNaN(obj)) {
			return Math.atan2(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.atan2(val);
		});
		return obj2;
	}

	/**
	 * Gets the sine from a number.
	 * 
	 * @method MathH:sin
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Sine value
	 */
	MathH.sin = function(obj) {
		if(!isNaN(obj)) {
			return Math.sin(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.sin(val);
		});
		return obj2;
	}

	/**
	 * Gets the cosine from a number.
	 * 
	 * @method MathH:cos
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Cosine value
	 */
	MathH.cos = function(obj) {
		if(!isNaN(obj)) {
			return Math.cos(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.cos(val);
		});
		return obj2;
	}

	/**
	 * Gets the tangent from a number.
	 * 
	 * @method MathH:tan
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object. (In radians)
	 * @return {Any} Tangent value
	 */
	MathH.tan = function(obj) {
		if(!isNaN(obj)) {
			return Math.tan(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.tan(val);
		});
		return obj2;
	}

	/**
	 * Converts a number from degrees to radians.
	 * 
	 * @method MathH:toRadians
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Radians value
	 */
	MathH.toRadians = function(obj) {
		if(!isNaN(obj)) {
			return obj * (Math.PI / 180);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return val * (Math.PI / 180);
		});
		return obj2;
	}

	/**
	 * Converts a number from radians to degrees.
	 * 
	 * @method MathH:toDegrees
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Degrees value
	 */
	MathH.toDegrees = function(obj) {
		if(!isNaN(obj)) {
			return obj * (180 / Math.PI);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return val * (180 / Math.PI);
		});
		return obj2;
	}

	/**
	 * Rounds up a number.
	 * 
	 * @method MathH:ceil
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Ceiled value
	 */
	MathH.ceil = function(obj) {
		if(!isNaN(obj)) {
			return Math.ceil(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.ceil(val);
		});
		return obj2;
	}

	/**
	 * Rounds down a number.
	 * 
	 * @method MathH:floor
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Floored value
	 */
	MathH.floor = function(obj) {
		if(!isNaN(obj)) {
			return Math.floor(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.floor(val);
		});
		return obj2;
	}

	/**
	 * Rounds a number
	 * 
	 * @method MathH:round
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @param [places=0] {Number} Number of decimal places.
	 * @return {Any} Rounded value
	 */
	MathH.round = function(obj, places) {
		if(places === undefined) {
			places = 0;
		}
		if(!isNaN(obj)) {
			return +(Math.round(obj + "e+" + places)  + "e-"+places);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return +(Math.round(val + "e+" + places)  + "e-"+places);
		});
		return obj2;
	}

	/**
	 * Rounds a number
	 * 
	 * @method MathH:round
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @param [places=0] {Number} Number of decimal places.
	 * @return {Any} Rounded value
	 */
	MathH.round = function(obj, places) {
		if(places === undefined) {
			places = 0;
		}
		if(!isNaN(obj)) {
			return +(Math.round(obj + "e+" + places)  + "e-"+places);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return +(Math.round(val + "e+" + places)  + "e-"+places);
		});
		return obj2;
	}

	/**
	 * Gets the log from a number.
	 * 
	 * @method MathH:log
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Log value
	 */
	MathH.log = function(obj) {
		if(!isNaN(obj)) {
			return Math.log(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.log(val);
		});
		return obj2;
	}

	/**
	 * Gets the exponent from a number.
	 * 
	 * @method MathH:exp
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Exponent value
	 */
	MathH.exp = function(obj) {
		if(!isNaN(obj)) {
			return Math.exp(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.exp(val);
		});
		return obj2;
	}

	/**
	 * Gets the square root of a number
	 * 
	 * @method MathH:sqrt
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Any} Square rooted value
	 */
	MathH.sqrt = function(obj) {

		if(!isNaN(obj)) {
			return Math.sqrt(obj);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.sqrt(val);
		});
		return obj2;
	}

	/**
	 * Gets the power of a number
	 * 
	 * @method MathH:pow
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @param power {Number} Power of a number
	 * @return {Any} Powered value
	 */
	MathH.pow = function(obj, y) {
		if(!isNaN(obj)) {
			return Math.pow(obj, y);
		}

		var obj2 = Helpers.clone(obj);
		Helpers.each(obj2, function(val) {
			val = Number(val);
			return Math.pow(val, y);
		});
		return obj2;
	}

	/**
	 * Extracts the minimum value and position.
	 * 
	 * @method MathH:min
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Object} Having `value` and `position`
	 */
	MathH.min = function(obj) {
		var min = null;
		var minPos = null;

		Helpers.each(obj, function(val, pos) {
			val = Number(val);
			if(minPos === null || val < min) {
				min = val;
				minPos = pos;
			}
		});

		return {
			value: min,
			position: minPos,
		};
	}

	/**
	 * Extracts the maximum value and position.
	 * 
	 * @method MathH:max
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Object} Having `value` and `position`
	 */
	MathH.max = function(obj) {
		var max = null;
		var maxPos = null;

		Helpers.each(obj, function(val, pos) {
			val = Number(val);
			if(maxPos === null || val > max) {
				max = val;
				maxPos = pos;
			}
		});

		return {
			value: max,
			position: maxPos,
		};
	}

	/**
	 * Calculates the sum from all elements.
	 * 
	 * @method MathH:sum
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Number} Sum value
	 */
	MathH.sum = function(obj) {
		var sum = 0;

		Helpers.each(obj, function(val, pos) {
			sum += Number(val);
		});

		return sum;
	}

	/**
	 * Calculates the mean/average from all elements.
	 * 
	 * @method MathH:mean
	 * @static
	 * @param value {Any} Number, Matrix, Array, or Object.
	 * @return {Number} mean value
	 */
	MathH.mean = function(obj) {
		var sum = 0;
		var total = 0;

		Helpers.each(obj, function(val, pos) {
			sum += Number(val);
			total++;
		});

		return sum/total;
	}

	/**
	 * Creates a random number from the given seed value.
	 * 
	 * @method MathH:getRandomViaSeed
	 * @static
	 * @param seed {Number} The seed value
	 * @return {Number} A random number
	 */
	MathH.getRandomViaSeed = function(seed) {
		var max = 1;
		var min = 0;
	 
		seed = (seed * 9301 + 49297) % 233280;
		var rnd = seed / 233280;
	 
		return min + rnd * (max - min);
	};

	/**
	 * Creates a random number within a range.
	 * 
	 * @method MathH:getRandomInRange
	 * @static
	 * @param min {Number} Minimum value
	 * @param max {Number} Maximum value
	 * @return {Number} A random number
	 */
	MathH.getRandomInRange = function(min, max) {
		return (min + Math.random() * (max-min));
	};

	MathH.getDistance = function(x1, y1, x2, y2) {
		return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	}

})(MathH || (MathH = {}));

/**
* Provides common functions for operations related to Objects. An Object is similar to a HashTable or a Dictionary.
*
* @example
* // Object definition. An Object has keys and values. Values can be of any type.
*
* var obj = {
*      'name': 'McLovin',
*      'age': 22,
*      'allowed': true,
* };
*
* @exports ObjectH
*/
var ObjectH;
(function(ObjectH) {

	/**
	 * Counts the number of elements in an object.
	 * 
	 * @method ObjectH:getLength
	 * @static
	 * @param object {Object} The input object
	 * @return {Number} Total length
	 */
	ObjectH.getLength = function(obj) {
		var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	}

	ObjectH.each = function(obj, callback) {

		for(var i in obj) {
			var r = callback.apply(obj, [obj[i], i]);

			if(r !== undefined) {
				obj[i] = r;
			}
		}
	}

	/**
	 * Creates a copy of an object.
	 * 
	 * @method ObjectH:clone
	 * @static
	 * @param object {Object} The input object
	 * @return {Object} Cloned object
	 */
	ObjectH.clone = function(obj) {
	    if(obj == null || typeof(obj) != 'object')
	        return obj;

	    var temp = obj.constructor(); // changed

	    for(var key in obj) {
	        if(obj.hasOwnProperty(key)) {
	            temp[key] = clone(obj[key]);
	        }
	    }
	    return temp;
	}

	/**
	 * Checks if the input is an Object.
	 * 
	 * @method ObjectH:isObject
	 * @static
	 * @param item {Any} The input item
	 * @return {boolean} Output flag
	 */
	ObjectH.isObject = function(item) {
		return (typeof item === "object" && !Array.isArray(item) && item !== null);
	}

})(ObjectH || (ObjectH = {}));

/**
* Provides common functions for operations related to Arrays.
*
* @example
* // Array definition. Arrays can contain items of any type.
*
* var array = [1, 'hello', 'world', 4, false];
*
* @exports ArrayH
*/
var ArrayH;
(function(ArrayH) {

	function resolveFillMethod(method) {
		if(method === undefined) {
			method = function(i) {
				return 0;
			}
		} else if($.isFunction(method)) {
			//..
		} else if(method == 'random') {
			method = function(i) {
				return Math.random();
			}
		} else if(method == 'binary') {
			method = function(i) {
				return Math.round(Math.random());
			}
		} else {
			var value = method;
			method = function(i) {
				return value;
			}
		}
		return method;
	}

	/**
	 * Creates an array from the length and callback method
	 * 
	 * @method ArrayH:make
	 * @static
	 * @param length {Number} The length of the array to be created.
	 * @param method {Function} Callback method that returns a value for each item.
	 * @param method.value {Any} Callback value
	 * @return {Array} Output array
	 */
	/**
	 * Creates an array from the length and value
	 * 
	 * @method ArrayH:make
	 * @static
	 * @param length {Number} The length of the array to be created.
	 * @param value {Number} Value of each item.
	 * @return {Array} Output array
	 */
	/**
	 * Creates an array from the length and type of operation
	 * 
	 * @method ArrayH:make
	 * @static
	 * @param length {Number} The length of the array to be created.
	 * @param type {String} Type of operation `random` | `binary`
	 * @return {Array} Output array
	 */
	ArrayH.make = function(length, method) {

		method = resolveFillMethod(method);
		var arr = [];
		for(var i = 0; i < length; i++) {
			arr.push(method(i));
		}
		
		return arr;
	}

	/**
	 * Extracts a random array element
	 * 
	 * @method ArrayH:getRandomValue
	 * @static
	 * @param array {Array} The array that contains the elements.
	 * @return {Any} A random value from that array.
	 */
	ArrayH.getRandomValue = function(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	/**
	 * Extracts random elements from an array
	 * 
	 * @method ArrayH:getRandomValues
	 * @static
	 * @param array {Array} The array that contains the elements.
	 * @param total {Number} Total number of values to be extracted.
	 * @return {Array} An array of extracted values.
	 */
	ArrayH.getRandomValues = function(array, total) {

		var newArray = array.slice(0);
		var set = [];

		for(var i = 0; i < total; i++) {
			var j = Math.floor(Math.random() * newArray.length);

			var newValue = newArray.splice(j, 1);
			set.push(newValue[0]);
		}

		return set;
	}

	/**
	 * Extracts random indexes from an array
	 * 
	 * @method ArrayH:getRandomIndexes
	 * @static
	 * @param array {Array} The array that contains the elements.
	 * @param total {Number} Total number of indexes to be extracted.
	 * @return {Array} An array of extracted indexes.
	 */
	ArrayH.getRandomIndexes = function(length, total) {

		var newArray = new Array(length);
		for(var i = 0; i < length; i++) {
			newArray[i] = i;
		}
		
		return ArrayH.getRandomValues(newArray, total);
	}

	/**
	 * Creates an array from `start` to `end`. With optional `step` parameter.
	 * 
	 * @method ArrayH:range
	 * @static
	 * @param start {Number} Starting of the range.
	 * @param end {Number} Ending of the range.
	 * @param [step=1] {Number} Number of steps to take.
	 * @return {Array} An array of values.
	 */
	ArrayH.range = function(start, end, step) {

		if(step === undefined || step === null) {
			step = 1;
		}

		var array = [];

		if(step < 0) {

			for(var i = start; i >= end; i+= step) {
				array.push(i);
			}

		} else if (step > 0) {
			for(var i = start; i <= end; i+= step) {
				array.push(i);
			}
		}

		
		return array;
	}

	/**
	 * Checks if the two input arrays are equal or not. Compares each elements, not just the reference.
	 * 
	 * @method ArrayH:equals
	 * @static
	 * @param array1 {Array} First array.
	 * @param array2 {Array} Second array.
	 * @return {boolean} True if both arrays are same.
	 */
	ArrayH.equals = function(array1, array2) {
		return JSON.stringify(array1) == JSON.stringify(array2);
	}

	/**
	 * Converts an object into an array.
	 * 
	 * @method ArrayH:convertFromObject
	 * @static
	 * @param object {Object} Input object.
	 * @return {Array} Converted array.
	 */
	ArrayH.convertFromObject = function(object) {
		var arr = [];

		for(var i in object) {
			arr.push(object[i]);
		}

		return arr;
	}

	/**
	 * Converts the keys of an object into an array.
	 * 
	 * @method ArrayH:convertKeysFromObject
	 * @static
	 * @param object {Object} Input object.
	 * @return {Array} Array containing keys.
	 */
	ArrayH.convertKeysFromObject = function(object) {
		var arr = [];

		for(var i in object) {
			arr.push(i);
		}

		return arr;
	}

	/**
	 * Assigns a numerical ID to each value in an array.
	 * 
	 * @method ArrayH:convertLabelsToIDs
	 * @static
	 * @param array {Array} Input array.
	 * @return {Object} Having `result` Array and `pairs` Object.
	 */
	ArrayH.convertLabelsToIDs = function(array) {

		var pairs = {};
		var result = [];

		var k = 0;
		for(var i in array) {
			var item = array[i];
			if(!(item in pairs)) {
				pairs[item] = k;
				k++;
			}

			result.push(pairs[item]);
		}

		return {
			result: result,
			pairs: pairs,
		};
	}

	/**
	 * Matches two arrays after converting them into labels. Typically used in comparing results of clustering algorithms.
	 * 
	 * @method ArrayH:matchLabels
	 * @static
	 * @param originalLabels {Array} Array1.
	 * @param computedLabels {Array} Array2.
	 * @return {Object} Having `accuracy` Number and `confusionMatrix` Object.
	 */
	ArrayH.matchLabels = function(originalLabels, computedLabels) {

		var info1 = ArrayH.convertLabelsToIDs(originalLabels);
		var info2 = ArrayH.convertLabelsToIDs(computedLabels);

		var pair1 = ArrayH.convertKeysFromObject(info1.pairs);
		var pair2 = ArrayH.convertKeysFromObject(info2.pairs);

		var confusionMatrix = MatrixH.make(pair1.length, pair2.length, 0);

		var goods = 0;

		for(var i in info1.result) {
			var val1 = info1.result[i];
			var val2 = info2.result[i];
			if(val1 == val2) {
				goods++;
			}

			confusionMatrix[val1][val2]++;
		}

		var rowHeaders = pair1;
		var columnHeaders = pair2;

		return {
			accuracy: goods/info1.result.length,
			confusionMatrix: {
				"values": confusionMatrix,
				"rowHeaders": rowHeaders,
				"columnHeaders": columnHeaders,
			},
		};
		
	}

	/**
	 * Extracts the unique elements from an array
	 * 
	 * @method ArrayH:unique
	 * @static
	 * @param array {Array} The input array.
	 * @return {Array} Unique array.
	 */
	ArrayH.unique = function(array) {
		var n = {}, r=[];
		for(var i = 0; i < array.length; i++) 
		{
			if (!n[array[i]]) 
			{
				n[array[i]] = true; 
				r.push(array[i]); 
			}
		}
		return r;
	}

	/**
	 * Checks if an Array contains an element
	 * 
	 * @method ArrayH:contains
	 * @static
	 * @param array {Array} The input array.
	 * @param element {Any} Value to search for.
	 * @return {boolean} Output flag.
	 */
	ArrayH.contains = function(array, needle) {
		if(typeof Array.prototype.indexOf === 'function') {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function(needle) {
	            var i = -1, index = -1;

	            for(i = 0; i < this.length; i++) {
	                if(this[i] === needle) {
	                    index = i;
	                    break;
	                }
	            }

	            return index;
	        };
	    }

	    return (indexOf.call(this, needle) > -1);
	}

	ArrayH.each = function(array, callback) {

		for(var i = 0; i < array.length; i++) {
			var r = callback.apply(array, [array[i], i]);

			if(r !== undefined) {
				array[i] = r;
			}
		}
	}

	/**
	 * Creates a copy of an Array.
	 * 
	 * @method ArrayH:clone
	 * @static
	 * @param array {Array} The input array.
	 * @return {Array} Cloned array
	 */
	ArrayH.clone = function(array) {
	    return array.slice(0);
	}

	/**
	 * Shuffles all the elements of an array
	 * 
	 * @method ArrayH:shuffle
	 * @static
	 * @param array {Array} The input array.
	 * @param [seed=undefined] {Number} Seed value for randomization.
	 * @return {Array} Output array.
	 */
	ArrayH.shuffle = function(array, seed) {
		var counter = array.length, temp, index;

		// While there are elements in the array
		while (counter > 0) {
			// Pick a random index

			if(seed !== undefined) {
				var randomNum = MathH.getRandomViaSeed(seed+counter);
			} else {
				var randomNum = Math.random();
			}

			index = Math.floor(randomNum * counter);

			// Decrease counter by 1
			counter--;

			// And swap the last element with it
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}

})(ArrayH || (ArrayH = {}));


/**
* Provides common functions for operations related to Matrices.
*
* In JavaScript, matrix is defined as an array of arrays.
*
* @example
*     // Matrix definition
*
*     var matrix = [
*         [1, 1, 2, 9],
*         [2, 6, 6, 2],
*         [3, 0, 6, 4],
*     ];
*
* @exports MatrixH
*/
var MatrixH;
(function(MatrixH) {

	/**
	 * Checks if the input is a Matrix.
	 *
	 * Note: `[]` is not a Matrix, however `[[]]` is.
	 * 
	 * @method MatrixH:isMatrix
	 * @static
	 * @param item {Any} The input item
	 * @return {boolean} Output flag
	 */
	MatrixH.isMatrix = function(obj) {

		if(Array.isArray(obj)) {
			var length = obj.length;

			if(length > 0) {

				if(Array.isArray(obj[0])) {
					return true;
				}
			}
		}

		return false;
	}

	MatrixH.each = function(matrix, callback) {

		for(var i = 0; i < matrix.length; i++) {
			for(var j = 0; j < matrix[i].length; j++) {
				var r = callback.apply(matrix, [matrix[i][j], [i, j]]);

				if(r !== undefined) {
					matrix[i][j] = r;
				}
			}
		}
	}

	/**
	 * Creates a copy of a Matrix.
	 * 
	 * @method MatrixH:clone
	 * @static
	 * @param matrix {Matrix} The input matrix.
	 * @return {Matrix} Cloned matrix
	 */
	MatrixH.clone = function(matrix) {
	    var newMatrix = [];

		for (var i = 0; i < matrix.length; i++) {
		    newMatrix[i] = matrix[i].slice(0);
		}

		return newMatrix;
	}

	function resolveFillMethod(method) {
		if(method === undefined) {
			method = function(x,y) {
				return 0;
			}
		} else if($.isFunction(method)) {
			//..
		} else if(method == 'random') {
			method = function(x,y) {
				return Math.random();
			}
		} else if(method == 'binary') {
			method = function(x,y) {
				return Math.round(Math.random());
			}
		} else if(MatrixH.isMatrix(method)) {
			var temp = method;
			method = function(x,y) {
				return temp[x][y];
			}
		} else if(Array.isArray(method)) {
			var temp = method;
			method = function(x,y) {
				return temp[x];
			}
		} else {
			var value = method;
			method = function(x,y) {
				return value;
			}
		}
		return method;
	}

	/**
	 * Creates a new Matrix from the given dimentions.
	 * 
	 * @method MatrixH:make
	 * @static
	 * @param rows {Number} Total number of rows.
	 * @param columns {Number} Total number of columns.
	 * @param method {Function} Callback method that returns a value for each item.
	 * @param method.value {Any} Callback value
	 * @return {Matrix} Output matrix
	 */

	/**
	 * Creates a new Matrix from the given dimentions.
	 * 
	 * @method MatrixH:make
	 * @static
	 * @param rows {Number} Total number of rows.
	 * @param columns {Number} Total number of columns.
	 * @param value {Number} Value of each item.
	 * @return {Matrix} Output matrix
	 */

	/**
	 * Creates a new Matrix from the given dimentions.
	 * 
	 * @method MatrixH:make
	 * @static
	 * @param rows {Number} Total number of rows.
	 * @param columns {Number} Total number of columns.
	 * @param type {String} Type of operation `random` | `binary`
	 * @return {Matrix} Output matrix
	 */

	MatrixH.make = function(rows, columns, method) {

		method = resolveFillMethod(method);

		var matrix = [];

		for(var i = 0; i < rows; i++) {
			var row = [];
			for(var j = 0; j < columns; j++) {
				row.push(method(i,j));
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Creates a Matrix by repeating a given row.
	 * 
	 * @method MatrixH:fromRow
	 * @static
	 * @param row {Array} The input row.
	 * @param count {Number} Total number of times to repeat.
	 * @return {Matrix} Output matrix
	 */
	MatrixH.fromRow = function (row, count) {

		var matrix = [];
		for(var i = 0; i < count; i++) {
			matrix.push(row);
		}

		return matrix;
	}

	/**
	 * Creates a new Matrix from the given dimentions.
	 * 
	 * @method MatrixH:random
	 * @static
	 * @param rows {Number} Total number of rows.
	 * @param columns {Number} Total number of columns.
	 * @param [min=0] {Number} Minimum random value.
	 * @param [max=1] {Number} Maximum random value.
	 * @return {Matrix} Output matrix
	 */
	MatrixH.random = function(rows, columns, min, max) {

		if(min === undefined || min === null) {
			min = 0;
		}

		if(max === undefined || max === null) {
			max = 1;
		}

		var matrix = [];

		for(var i = 0; i < rows; i++) {
			var row = [];
			for(var j = 0; j < columns; j++) {
				row.push(min + Math.random() * (max-min));
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Creates an identity Matrix.
	 * 
	 * An identity matrix is full of zeros, except 1s in its diagonals.
	 * 
	 * @method MatrixH:identity
	 * @static
	 * @param rows {Number} Total number of rows.
	 * @param columns {Number} Total number of columns.
	 * @return {Matrix} Output matrix
	 */
	MatrixH.identity = function(rows, columns) {

		var matrix = [];

		for(var i = 0; i < rows; i++) {
			var row = [];
			for(var j = 0; j < columns; j++) {
				row.push(i == j);
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Creates a Matrix from diagonal input values.
	 * 
	 * @method MatrixH:blockDiagonal
	 * @static
	 * @param ...values {Number} Diagonal values
	 * @return {Matrix} Output matrix
	 */
	MatrixH.blockDiagonal = function() {

		var size = arguments.length;

		var matrix = [];

		for(var i = 0; i < size; i++) {
			var row = [];
			for(var j = 0; j < size; j++) {
				if(i == j) {
					row.push(arguments[i]);
				} else {
					row.push(0);
				}
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Creates a Matrix from diagonal input array and the offset.
	 * 
	 * @method MatrixH:diagonal
	 * @static
	 * @param elements {Array} Array of diagonal values.
	 * @param diagonalNumber {Number} The diagonal offset.
	 * @return {Matrix} Output matrix
	 */
	MatrixH.diagonal = function(elements, diagonalNumber) {

		if(diagonalNumber === undefined || diagonalNumber === null) {
			diagonalNumber = 0;
		}

		var size = elements.length + Math.abs(diagonalNumber);

		var matrix = [];

		for(var i = 0; i < size; i++) {
			var row = [];
			for(var j = 0; j < size; j++) {
				if(i == j - diagonalNumber) {
					row.push(elements[i - Math.max(0, - diagonalNumber)]);
				} else {
					row.push(0);
				}
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Creates a Matrix with rows and columns from `start` to `end`. With optional `step` parameter.
	 * 
	 * @method MatrixH:range
	 * @static
	 * @param rowStart {Number} Starting of the range for rows.
	 * @param rowEnd {Number} Ending of the range for rows.
	 * @param [rowStep=1] {Number} Number of steps to take for rows.
	 * @param columnStart {Number} Starting of the range for columns.
	 * @param columnEnd {Number} Ending of the range for columns.
	 * @param [columnStep=1] {Number} Number of steps to take for columns.
	 * @return {Matrix} Output matrix having values `(i+j)`.
	 */
	MatrixH.range = function(rowStart, rowEnd, rowStep, columnStart, columnEnd, columnStep) {

		if(rowStep === undefined) {
			rowStep = 1;
		}

		if(columnStep === undefined) {
			columnStep = 1;
		}

		var matrix = [];

		for(var i = rowStart; i <= rowEnd; i+= rowStep) {
			var row = [];
			for(var j = columnStart; j <= columnEnd; j+= columnStep) {
				row.push(i + j);
			}
			matrix.push(row);
		}
		
		return matrix;
	}

	/**
	 * Vertically joins matrices
	 * 
	 * @method MatrixH:verticalConcatenate
	 * @static
	 * @param ...matrices {Matrix} Matrices to join.
	 * @return {Matrix} Concatenated output matrix
	 */
	MatrixH.verticalConcatenate = function() {

		var resultant = [];

		for(var i in arguments) {
			resultant = resultant.concat(arguments[i]);
		}

		return resultant;
	}

	/**
	 * Horizontally joins matrices
	 * 
	 * @method MatrixH:horizontalConcatenate
	 * @static
	 * @param ...matrices {Matrix} Matrices to join.
	 * @return {Matrix} Concatenated output matrix
	 */
	MatrixH.horizontalConcatenate = function() {

		var matricesList = arguments;

		for(var i in matricesList) {
			matricesList[i] = MatrixH.transpose(matricesList[i]);
		}

		var resultant = MatrixH.verticalConcatenate.apply(this, matricesList);

		resultant = MatrixH.transpose(resultant);

		return resultant;
	}

	/**
	 * Fill a Matrix with values or method.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:fill
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Filled output matrix
	 */
	MatrixH.fill = function(matrix, method) {

		method = resolveFillMethod(method);

		for(var i = 0; i < matrix.length; i++) {
			for(var j = 0; j < matrix[i].length; j++) {
				matrix[i][j] = method(i,j);
			}
		}
	}

	/**
	 * Fill a part of a Matrix with values or method.
	 * 
	 * @method MatrixH:fillPart
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param row {Number} Row offset.
	 * @param column {Number} Column offset.
	 * @param value {Any} A `Number`, `Array` or a `Matrix`.
	 * @param callback {Function} Any filling callback.
	 * @return {Matrix} Filled output matrix
	 */
	MatrixH.fillPart = function(matrix, row, column, value, callback) {

		var newMatrix = MatrixH.clone(matrix);
		value = MatrixH.convertFrom(value, 1, 1);

		for(var i = 0; i < value.length; i++) {
			for(var j = 0; j < value[i].length; j++) {
				try {
					if(callback) {

						newMatrix[i+row][j+column] = callback(newMatrix[i+row][j+column], value[i][j]);
						
					} else {
						newMatrix[i+row][j+column] = value[i][j];
					}
				} catch(e) {

				}
			}
		}

		return newMatrix;
	}

	/**
	 * Get a part/section of Matrix.
	 * 
	 * @method MatrixH:getPart
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param fromRow {Number} Starting row.
	 * @param [toRow=end] {Number} Ending row.
	 * @param fromColumn {Number} Starting column.
	 * @param [toColumn=end] {Number} Ending column.
	 * @return {Matrix} Part of a matrix.
	 */
	MatrixH.getPart = function(matrix, fromRow, toRow, fromColumn, toColumn) {

		var totalRows = MatrixH.getTotalRows(matrix);
		var totalCols = MatrixH.getTotalColumns(matrix);

		if(toRow === undefined || toRow === null) {
			toRow = totalRows - 1;
		}

		if(toColumn === undefined || toColumn === null) {
			toColumn = totalCols - 1;
		}

		var sizeRows = toRow - fromRow + 1;
		var sizeCols = toColumn - fromColumn + 1;

		var newMatrix = MatrixH.make(sizeRows, sizeCols);

		for(var i = 0; i < sizeRows; i++) {
			for(var j = 0; j < sizeCols; j++) {
				newMatrix[i][j] = matrix[i+fromRow][j+fromColumn];
			}
		}

		return newMatrix;
	}

	/**
	 * Fill a column of Matrix with values or method.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:fillColumn
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param columnNum {Number} The column number.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with filled column.
	 */
	MatrixH.fillColumn = function(matrix, columnNum, method) {

		method = resolveFillMethod(method);

		for(var i in matrix) {
			matrix[i][columnNum] = method(i, columnNum);
		}
	}

	/**
	 * Insert a column into a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:insertColumn
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param columnNum {Number} The column number.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with inserted column.
	 */
	MatrixH.insertColumn = function(matrix, columnNum, method) {

		for(var i = 0; i < matrix.length; i++) {
			matrix[i].splice(columnNum, 0, undefined);
		}

		MatrixH.fillColumn(matrix, columnNum, method);
	}

	/**
	 * Add a column to the end of a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:appendColumn
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Number} index of the new column.
	 */
	MatrixH.appendColumn = function(matrix, method) {

		for(var i = 0; i < matrix.length; i++) {
			matrix[i].push(undefined);
		}

		var totalCols = MatrixH.getTotalColumns(matrix);

		MatrixH.fillColumn(matrix, totalCols - 1, method);

		return totalCols - 1;
	}

	/**
	 * Add a column to the start of a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:prependColumn
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with inserted column.
	 */
	MatrixH.prependColumn = function(matrix, method) {
		MatrixH.insertColumn(matrix, 0, method);
	}

	/**
	 * Fill a row of matrix with values or method.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:fillRow
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param rowNum {Number} The row number.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with filled row.
	 */
	MatrixH.fillRow = function(matrix, rowNum, method) {

		if(Array.isArray(method) && !MatrixH.isMatrix(method)) {
			var value = method;
			method = function(x,y) {
				return value[y];
			}
		}

		method = resolveFillMethod(method);

		var totalCols = MatrixH.getTotalColumns(matrix);

		for(var i = 0; i < totalCols; i++) {
			matrix[rowNum][i] = method(rowNum, i);
		}
	}

	/**
	 * Insert a row into a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:insertRow
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param rowNum {Number} The row number.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with inserted row.
	 */
	MatrixH.insertRow = function(matrix, rowNum, method) {

		var totalCols = MatrixH.getTotalColumns(matrix);

		matrix.splice(rowNum, 0, new Array(totalCols));

		MatrixH.fillRow(matrix, rowNum, method);
	}

	/**
	 * Add a row to the end of a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:appendRow
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Number} Index of the newly appended row.
	 */
	MatrixH.appendRow = function(matrix, method) {

		var totalCols = MatrixH.getTotalColumns(matrix);
		matrix.push(new Array(totalCols))

		MatrixH.fillRow(matrix, matrix.length - 1, method);

		return matrix.length - 1;
	}

	/**
	 * Add a row to the start of a Matrix.
	 * 
	 * value parameter works just like the {{#crossLink "MatrixH/make:method"}}make{{/crossLink}} method.
	 * 
	 * @method MatrixH:prependRow
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param value {Any} `Number`, `Function`, `Array` or `String`: `random` | `binary`.
	 * @return {Matrix} Matrix with inserted row.
	 */
	MatrixH.prependRow = function(matrix, method) {
		MatrixH.insertRow(matrix, 0, method);
	}

	/**
	 * Invert a Matrix. Elements with 0 values become 1 and vice-versa.
	 * 
	 * @method MatrixH:invert
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @return {Matrix} Inverted matrix.
	 */
	MatrixH.invert = function(matrix) {

		var newMatrix = MatrixH.clone(matrix);
		for(var i = 0; i < newMatrix.length; i++) {
			for(var j = 0; j < newMatrix[i].length; j++) {
				newMatrix[i][j] = !newMatrix[i][j];
			}
		}

		return newMatrix;
	}

	/**
	 * Get the total number of rows from a Matrix.
	 * 
	 * @method MatrixH:getTotalRows
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @return {Number} Total rows.
	 */
	MatrixH.getTotalRows = function(matrix) {
		return matrix.length;
	}

	/**
	 * Get the total number of columns from a Matrix.
	 * 
	 * @method MatrixH:getTotalColumns
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @return {Number} Total columns.
	 */
	MatrixH.getTotalColumns = function(matrix) {

		var max = 0;
		for(var i = 0; i < matrix.length; i++) {
			max = Math.max(matrix[i].length, max);
		}

		return max;
		//return matrix[0].length;
	}

	/**
	 * Get the transpose of a Matrix.
	 * 
	 * @method MatrixH:transpose
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @return {Matrix} Matrix transpose.
	 */
	MatrixH.transpose = function(matrix) {

		var newMatrix = matrix[0].map(function(col, i) { 
			return matrix.map(function(row) { 
				return row[i] 
			})
		});

		return newMatrix;
	}

	/**
	 * Get the total number of elements from a Matrix.
	 * 
	 * @method MatrixH:getTotalElements
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @return {Number} Total elements.
	 */
	MatrixH.getTotalElements = function(matrix) {
		return MatrixH.getTotalRows(matrix) * MatrixH.getTotalColumns(matrix);
	}

	/**
	 * Extract a column from a Matrix.
	 * 
	 * @method MatrixH:getColumn
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param columnNum {Number} Column number.
	 * @return {Array} Array having that column values.
	 */
	MatrixH.getColumn = function(matrix, columnNum) {
		var arr = [];
		for(var i in matrix) {
			arr.push(matrix[i][columnNum]);
		}
		return arr;
	}

	/**
	 * Extract a row from a Matrix.
	 * 
	 * @method MatrixH:getRow
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param rowNum {Number} Row number.
	 * @return {Array} Array having that row values.
	 */
	MatrixH.getRow = function(matrix, rowNum) {
		return matrix[rowNum];
	}

	/**
	 * Get `n` random rows from a Matrix.
	 * 
	 * @method MatrixH:getRandomRows
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param total {Number} Total number of rows to extract.
	 * @return {Matrix} A Matrix containing the rows.
	 */
	MatrixH.getRandomRows = function(matrix, total) {

		var newMatrix = matrix.slice(0);
		var set = {};

		for(var i = 0; i < total; i++) {
			var j = Math.floor(Math.random() * newMatrix.length);

			var newValue = newMatrix.splice(j, 1);

			//set.push(newValue[0]);
			set[j] = newValue[0];
		}

		return set;
	}

	/**
	 * Classify a Matrix according to the given points. Typically used in clustering/classification algorithms.
	 * 
	 * @method MatrixH:classifyToNearest
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param points {Matrix} An array of points. A point is an array of `X` first element and `Y` second element.
	 * @param [method='euclidean'] {Function} Distance function to use.
	 * @return {Array} An Array (having length of matrix's rows) containing nearest point indexes.
	 */
	MatrixH.classifyToNearest = function(matrix, points, method) {

		method = Helpers.resolveDistanceMethod(method);
		var result = new Array(matrix.length, 0);

		for(var i in matrix) {

			var nearest = null;
			var minDistance = 99999999999;
			var k = 0;
			for(var j in points) {

				var distance = method(Number(points[j][0]), Number(points[j][1]), Number(matrix[i][0]), Number(matrix[i][1]));
				if(distance < minDistance) {
					minDistance = distance;
					nearest = k;
				}
				k++;
			}

			result[i] = nearest;
		}

		return result;
	}

	/**
	 * Append multiple rows into a Matrix. Similar to {{#crossLink "MatrixH/horizontalConcatenate:method"}}horizontalConcatenate{{/crossLink}}.
	 * 
	 * @method MatrixH:appendRows
	 * @static
	 * @param matrix {Matrix} Input matrix.
	 * @param points {Matrix} An array of rows.
	 * @return {Matrix} Output matrix.
	 */
	MatrixH.appendRows = function(matrix, rows) {

		if (typeof rows === "object") {
			var arr = [];

			for(var i in rows) {
				arr.push(rows[i]);
			}
			rows = arr;
		}

		return matrix.concat(rows);
	}

	/**
	 * Checks if the two input matrices are equal or not. Compares each elements, not just the reference.
	 * 
	 * @method MatrixH:equals
	 * @static
	 * @param matrix1 {Array} First matrix.
	 * @param matrix2 {Array} Second matrix.
	 * @return {boolean} True if both matrices are same.
	 */
	MatrixH.equals = function(matrix1, matrix2) {
		return JSON.stringify(matrix1) == JSON.stringify(matrix2);
	}

	/**
	 * Checks if a Matrix contains an element
	 * 
	 * @method MatrixH:contains
	 * @static
	 * @param matrix {Matrix} The input matrix.
	 * @param element {Any} Value to search for.
	 * @return {boolean} Output flag.
	 */
	MatrixH.contains = function(matrix, item) {

		for(var i = 0; i < matrix.length; i++) {
			for(var j = 0; j < matrix[i].length; j++) {

				if(matrix[i][j] == item) {
					return true;
				}

			}
		}

		return false;
	}

	/**
	 * Sum of all rows in a matrix.
	 * 
	 * @method MatrixH:rowSum
	 * @static
	 * @param matrix {Matrix} The input matrix.
	 * @return {Array} Resultant array.
	 */
	MatrixH.rowSum = function(matrix) {
		var result = [];

		for(var i = 0; i < matrix[0].length; i++) {

			result[i] = 0;
			for(var j = 0; j < matrix.length; j++) {
				result[i] += Number(matrix[j][i]);
			}
		}

		return result;
	}

	/**
	 * Mean of all rows in a matrix.
	 * 
	 * @method MatrixH:rowMean
	 * @static
	 * @param matrix {Matrix} The input matrix.
	 * @return {Array} Resultant array.
	 */
	MatrixH.rowMean = function(matrix) {
		var result = [];

		for(var i = 0; i < matrix[0].length; i++) {

			result[i] = 0;
			for(var j = 0; j < matrix.length; j++) {
				result[i] += Number(matrix[j][i]);
			}

			result[i] = result[i]/matrix.length;
		}


		return result;
	}

	/**
	 * Search through the matrix rows (condition based).
	 * 
	 * @method MatrixH:queryRows
	 * @static
	 * @param matrix {Matrix} The input matrix.
	 * @param column {Number} The column number.
	 * @param method {Any} `String` value: `<`, `>`, `<=`, `>=`, `=`, `==`, `===` or a callback `Function`.
	 * @param equals {Any} The value to compare the column with.
	 * @return {Matrix} An array of rows that match the criteria.
	 */
	MatrixH.queryRows = function(matrix, column, method, equals) {

		method = Helpers.resolveComparisonMethod(method);

		var result = [];
		for(var i in matrix) {

			var selected = method(matrix[i][column], equals);

			if(selected) {
				result.push(matrix[i]);
			}
		}

		return result;
	}

	MatrixH.convertFrom = function(value, rows, columns) {

		if(MatrixH.isMatrix(value)) {
			return value;
		} else if(typeof value == 'number') {
			value = MatrixH.make(rows, columns, value);
		} else if(Array.isArray(value)) {
			value = MatrixH.fromRow(value, rows);
		}

		return value;
	}

	function operateByElement(matrix1, matrix2, callback) {

		matrix2 = MatrixH.convertFrom(matrix2, MatrixH.getTotalRows(matrix1), MatrixH.getTotalColumns(matrix1));

		var rows = Math.max(MatrixH.getTotalRows(matrix1), MatrixH.getTotalRows(matrix2));
		var cols = Math.max(MatrixH.getTotalColumns(matrix1), MatrixH.getTotalColumns(matrix2));

		var resultant = MatrixH.make(rows, cols, 0);

		for(var i = 0; i < rows; i++) {
			for(var j = 0; j < cols; j++) {
				
				var val1 = 0;
				try {
					val1 = matrix1[i][j];
				} catch(e) {};
				val1 = val1 === undefined ? 0 : val1;
				
				var val2 = 0;
				try {
					val2 = matrix2[i][j];
				} catch(e) {};
				val2 = val2 === undefined ? 0 : val2;

				resultant[i][j] = callback(val1, val2);

			}
		}

		return resultant;
	}

	/**
	 * Matrix dot-product `(matrix1 .* matrix2)`.
	 * 
	 * @method MatrixH:dotProduct
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Any} Either a `Matrix`, `Array` or a `Number`.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.dotProduct = function(matrix1, matrix2) {

		return operateByElement(matrix1, matrix2, function(val1, val2) {
			try {
				return val1 * val2;
			} catch(e) {
				return 0;
			}
		});
	}

	/**
	 * Matrix dot-division `(matrix1 ./ matrix2)`.
	 * 
	 * @method MatrixH:dotDivision
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Any} Either a `Matrix`, `Array` or a `Number`.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.dotDivision = function(matrix1, matrix2) {

		return operateByElement(matrix1, matrix2, function(val1, val2) {
			try {
				return val1 / val2;
			} catch(e) {
				return 0;
			}
		});
	}

	/**
	 * Matrix addition `(matrix1 + matrix2)`.
	 * 
	 * @method MatrixH:add
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Any} Either a `Matrix`, `Array` or a `Number`.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.add = function(matrix1, matrix2) {

		return operateByElement(matrix1, matrix2, function(val1, val2) {
			try {
				return val1 + val2;
			} catch(e) {
				return 0;
			}
		});

	}

	/**
	 * Matrix subtraction `(matrix1 - matrix2)`.
	 * 
	 * @method MatrixH:subtract
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Any} Either a `Matrix`, `Array` or a `Number`.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.subtract = function(matrix1, matrix2) {

		if(matrix1 == null || matrix1 == 0) {
			return MatrixH.negate(matrix2);
		}

		return operateByElement(matrix1, matrix2, function(val1, val2) {
			try {
				return val1 - val2;
			} catch(e) {
				return 0;
			}
		});

	}

	/**
	 * Matrix power `(m ^ n)`.
	 * 
	 * @method MatrixH:power
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Any} Either a `Matrix`, `Array` or a `Number`.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.power = function(matrix1, matrix2) {

		return operateByElement(matrix1, matrix2, function(val1, val2) {
			try {
				return Math.pow(val1, val2);
			} catch(e) {
				return 0;
			}
		});

	}

	/**
	 * Matrix negate `(-m)`.
	 * 
	 * @method MatrixH:subtract
	 * @static
	 * @param matrix {Matrix} A matrix.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.negate = function(matrix) {

		var result = [];
		for(var i = 0; i < matrix.length; i++) {
			var row = [];
			for(var j = 0; j < matrix[i].length; j++) {
				row.push(- matrix[i][j]);
			}
			result.push(row);
		}
		return result;
	}

	/**
	 * Matrix cross-product `(m * n)`.
	 * 
	 * @method MatrixH:crossProduct
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Matrix} The second matrix.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.crossProduct = function(matrix1, matrix2) {

		if(matrix1[0].length != matrix2.length) {
			throw "MatrixH.crossProduct() expects the total rows of matrix2 equal total columns of matrix1";
			return 0;
		}

	    var result = [];
	    for (var i = 0; i < matrix1.length; i++) {
	        result[i] = [];
	        for (var j = 0; j < matrix2[0].length; j++) {
	            var sum = 0;
	            for (var k = 0; k < matrix1[0].length; k++) {
	                sum += matrix1[i][k] * matrix2[k][j];
	            }
	            result[i][j] = sum;
	        }
	    }
	    return result;

	}

	/**
	 * Matrix division `(m / n)`.
	 * 
	 * @method MatrixH:divide
	 * @static
	 * @param matrix1 {Matrix} The first matrix.
	 * @param matrix2 {Matrix} The second matrix.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.divide = function(matrix1, matrix2) {

		matrix2 = MatrixH.inverse(matrix2);
		return MatrixH.crossProduct(matrix1, matrix2);
	}

	/**
	 * Matrix determinant.
	 * 
	 * @method MatrixH:determinant
	 * @static
	 * @param matrix {Matrix} A matrix.
	 * @return {Number} Caluclated determinant.
	 */
	MatrixH.determinant = function(matrix) {

		if(matrix.length != matrix[0].length) {
			throw "MatrixH.determinant() expects a square matrix";
			return 0;
		}

	    var sum = 0;
	    var s;
	    if (matrix.length == 1) {
	        return (matrix[0][0]);
	    }
	    if (matrix.length == 2) {
	        return ((matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]));
	    }
	    if (matrix.length == 3) {
	        return ((matrix[0][0] * matrix[1][1] * matrix[2][2]) + (matrix[0][1] * matrix[1][2] * matrix[2][0]) + (matrix[0][2] * matrix[1][0] * matrix[2][1]) - (matrix[0][0] * matrix[1][2] * matrix[2][1]) - (matrix[0][1] * matrix[1][0] * matrix[2][2]) - (matrix[0][2] * matrix[1][1] * matrix[2][0]));
	    }
	    for (var i = 0; i < matrix.length; i++) {
	        var smaller = new Array(matrix.length - 1);
	        for (h = 0; h < smaller.length; h++) {
	            smaller[h] = new Array(smaller.length);
	        }
	        for (a = 1; a < matrix.length; a++) {
	            for (b = 0; b < matrix.length; b++) {
	                if (b < i) {
	                    smaller[a - 1][b] = matrix[a][b];
	                } else if (b > i) {
	                    smaller[a - 1][b - 1] = matrix[a][b];
	                }
	            }
	        }
	        if (i % 2 == 0) {
	            s = 1;
	        } else {
	            s = -1;
	        }
	        sum += s * matrix[0][i] * (MatrixH.determinant(smaller));
	    }
	    return (sum);
	}

	/**
	 * Matrix inverse.
	 * 
	 * @method MatrixH:inverse
	 * @static
	 * @param matrix {Matrix} A matrix.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.inverse = function(matrix) {

		if(matrix.length != matrix[0].length) {
			throw "MatrixH.inverse() expects a square matrix";
			return 0;
		}

	    // I use Guassian Elimination to calculate the inverse:
	    // (1) 'augment' the matrix (left) by the identity (on the right)
	    // (2) Turn the matrix on the left into the identity by elemetry row ops
	    // (3) The matrix on the right is the inverse (was the identity matrix)
	    // There are 3 elemtary row ops: (I combine b and c in my code)
	    // (a) Swap 2 rows
	    // (b) Multiply a row by a scalar
	    // (c) Add 2 rows
	    //if the matrix isn't square: exit (error)
	    if (matrix.length !== matrix[0].length) {
	        return;
	    }
	    //create the identity matrix (I), and a copy (C) of the original
	    var i = 0,
	        ii = 0,
	        j = 0,
	        dim = matrix.length,
	        e = 0,
	        t = 0;
	    var I = [],
	        C = [];
	    for (i = 0; i < dim; i += 1) {
	        // Create the row
	        I[I.length] = [];
	        C[C.length] = [];
	        for (j = 0; j < dim; j += 1) {
	            //if we're on the diagonal, put a 1 (for identity)
	            if (i == j) {
	                I[i][j] = 1;
	            } else {
	                I[i][j] = 0;
	            }
	            // Also, make the copy of the original
	            C[i][j] = matrix[i][j];
	        }
	    }
	    // Perform elementary row operations
	    for (i = 0; i < dim; i += 1) {
	        // get the element e on the diagonal
	        e = C[i][i];
	        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
	        if (e == 0) {
	            //look through every row below the i'th row
	            for (ii = i + 1; ii < dim; ii += 1) {
	                //if the ii'th row has a non-0 in the i'th col
	                if (C[ii][i] != 0) {
	                    //it would make the diagonal have a non-0 so swap it
	                    for (j = 0; j < dim; j++) {
	                        e = C[i][j]; //temp store i'th row
	                        C[i][j] = C[ii][j]; //replace i'th row by ii'th
	                        C[ii][j] = e; //repace ii'th by temp
	                        e = I[i][j]; //temp store i'th row
	                        I[i][j] = I[ii][j]; //replace i'th row by ii'th
	                        I[ii][j] = e; //repace ii'th by temp
	                    }
	                    //don't bother checking other rows since we've swapped
	                    break;
	                }
	            }
	            //get the new diagonal
	            e = C[i][i];
	            //if it's still 0, not invertable (error)
	            if (e == 0) {
	                return
	            }
	        }
	        // Scale this row down by e (so we have a 1 on the diagonal)
	        for (j = 0; j < dim; j++) {
	            C[i][j] = C[i][j] / e; //apply to original matrix
	            I[i][j] = I[i][j] / e; //apply to identity
	        }
	        // Subtract this row (scaled appropriately for each row) from ALL of
	        // the other rows so that there will be 0's in this column in the
	        // rows above and below this one
	        for (ii = 0; ii < dim; ii++) {
	            // Only apply to other rows (we want a 1 on the diagonal)
	            if (ii == i) {
	                continue;
	            }
	            // We want to change this element to 0
	            e = C[ii][i];
	            // Subtract (the row above(or below) scaled by e) from (the
	            // current row) but start at the i'th column and assume all the
	            // stuff left of diagonal is 0 (which it should be if we made this
	            // algorithm correctly)
	            for (j = 0; j < dim; j++) {
	                C[ii][j] -= e * C[i][j]; //apply to original matrix
	                I[ii][j] -= e * I[i][j]; //apply to identity
	            }
	        }
	    }
	    //we've done all operations, C should be the identity
	    //matrix I should be the inverse:
	    return I;
	}

	function resolveOperationMethod(method) {

		if(method == '.*') {
			return MatrixH.dotProduct;

		} else if(method == './') {
			return MatrixH.dotDivision;

		} else if(method == '*' || method == 'x') {
			return MatrixH.crossProduct;

		} else if(method == '-') {
			return MatrixH.subtract;

		} else if(method == '+') {
			return MatrixH.add;

		} else if(method == '^') {
			return MatrixH.power;

		} else if(method == '/') {
			return MatrixH.divide;

		} else if(method == "'") {
			return MatrixH.transpose;


		} else if($.isFunction(method)) {
			//..
		}

		return method;
	}

	/**
	 * Perform a mathematical operation on an array.
	 * 
	 * @method MatrixH:operate
	 * @static
	 * @param matrix1 {Matrix} First matrix.
	 * @param operator {Any} `String` value: `+`, `-`, `^`, `./`, `.*`, `/`, `*`, `x`, `'` or a callback `Function`.
	 * @param matrix2 {Matrix} First matrix.
	 * @return {Matrix} Resultant matrix.
	 */
	MatrixH.operate = function(matrix1, operator, matrix2) {

		operator = resolveOperationMethod(operator);

		return operator(matrix1, matrix2);
	}

})(MatrixH || (MatrixH = {}));

/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
		let list = [];

		for (let i = 0; i < json.length; i++) {
			let newNode = new Node(json[i].name, json[i].parent);
			list.push(newNode);
		}
		this.list = list;

		for (let i = 0; i < json.length; i++) {
			for (let k = 0; k < json.length; k++) {
				if (this.list[i].parentName === this.list[k].name) {
					this.list[i].parentNode = this.list[k];
				}
			}
		}
		this.list = list;
	}
    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
		// note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
		for (let i = 0; i < this.list.length; i++) {
			for (let k = 0; k < this.list.length; k++) {
				if (this.list[i].parentName === this.list[k].name){
					this.list[k].addChild(this.list[i]);
				}
			}
		}

		for (let i = 0; i < this.list.length; i++) {
			for (let k = 0; k < this.list.length; k++) {
				if (this.list[i].parentName === this.list[k].name ||this.list[i].parentName === "root" ) {
					this.list[i].level = this.assignLevel(this.list[i],0);
					this.list[i].position = this.assignPosition(this.list[i],0);
				}	
			}
		}
	}
    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
		if (node.parentName === "root") {
			return level;
		}
		return this.assignLevel(node.parentNode, level+1);
	}

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
		if (node.parentName === "root") {
			return position;
		}

		let child_arr = node.parentNode.children;

		if (child_arr[0] === node) {
			return this.assignPosition(node.parentNode, position);
		}
		else{
			let numNodes = 0;
			for (let i = 0; i < child_arr.length; i++) {
				if (child_arr[i] !== node) {
					let grandchild = child_arr[i].children.length;
					if (grandchild > 1){
						numNodes = numNodes + (grandchild-1);
					}
				}
			}
			let sisters = child_arr.length
			if (sisters > 1 && sisters < 3){
				numNodes = numNodes + (sisters-1);
			}
			if (node.level > 1) {
				numNodes = numNodes + node.parentNode.position;
			}
			if (sisters > 2) {
				for (let i = 0; i < child_arr.length; i++) {
					if (child_arr[i] === node) {
						position = node.parentNode.position + i;
						return position;
					}
				}
			}
			position = numNodes;
			return position;
		}

	}

	/**
	 * Function that creates connection
	 * @param {list[]} list - array of node objects with name, parent, children,
	 * level and position fields
	 */
	lineTree(array) {
		let line_arr = [];
		for (let i = 0; i < array.length; i++){
			if (array[i].children.length === 0){
				continue;
			}
			else {
				for (let k = 0; k < array[i].children.length; k++){
					line_arr.push(array[i]);
					line_arr.push(array[i].children[k]);
				}
			}
		}
		return line_arr;
	}

	/**
	 * Function that creates splits an array in two
	 * even indicies in first array
	 * odd indicies in second array
	 * @param {list[]} list - array of node objects with name, parent, children,
	 * level and position fields
	 * returns first array or second array
	 */	
	arrsplit(array, number){
		let newarray = [];
		if (number === 1) {
			for (let i = 0; i < array.length; i+=2){
				newarray.push(array[i]);
			}
		}
		else {
			for (let i = 1; i < array.length; i+=2){
				newarray.push(array[i]);
			}
		}
		return newarray;
	}

	/**
	 * Function that gets the x coordinates for the translation
	 * @param {list[]} list - array of node objects with name, parent, children,
	 * level and position fields
	*/
	xcord(list) {
		let array = [];
		for (let i = 0; i < list.length; i++) {
			array.push(list[i].level);
		}
		return array;
	}

	/**
	 * Function that gets the y coordinates for the translation
	 * @param {list[]} list - array of node objects with name, parent, children,
	 * level and position fields
	*/
	ycord(list) {
		let array = [];
		for (let i = 0; i < list.length; i++) {
			array.push(list[i].position);
		}
		return array;
	}

    /**
     * Function that renders the tree
     */
    renderTree() {
		let svgContainer = d3.select("body").append("svg")
									.attr("width", 1200)
									.attr("height", 1200);

		let array = this.lineTree(this.list);
		let farray = this.arrsplit(array,1);
		let sarray = this.arrsplit(array,2);

		let line = svgContainer.selectAll("line")
			.data(farray)
			.enter().append("line")
			.attr("x1", (d,i) => farray[i].level * 125 + 70)
			.attr("y1", (d,i) => farray[i].position * 125 + 70)
			.data(sarray)
			.attr("x2", (d,i) => sarray[i].level * 125 + 70)
			.attr("y2", (d,i) => sarray[i].position * 125 + 70);
		
		//let x_cord = this.list;
		//let y_cord = this.list;

		let x_cord = this.xcord(this.list);
		let y_cord = this.ycord(this.list);
		
		function translate() {
			return "translate(" + ((d,i) => x_cord[i]* 125 + 70) + "," + ((d,i) => y_cord[i] * 125 + 70)+")";
		}

		let g = svgContainer.selectAll("g")
			.data(this.list)
			.enter().append("g")
			.attr('class', 'nodeGroup')
			.attr('transform', translate);
		
			//.attr("data", this.list)
			

			//.enter().append("circle")
			//.attr("r", 50)
			//.enter().append("text")
			//.attr('class', 'label');

		//let selection = g.selectAll("circle")
		//	.data(this.list)
		//	.enter().append("circle")
			
		//let text = g.select("text")
		//	.data(this.list)
		//	.enter().append("text")	

		//let group = selection
		let group = g.append("circle")
			//.attr("cx", (d,i) => this.list[i].level * 125 + 70)
			//.attr("cy", (d,i) => this.list[i].position * 125 + 70)
			.attr("r", 50)
		let group2 = g.append("text")
			.attr('class', 'label')
			//.attr("x", (d,i) => this.list[i].level* 125 + 70)
			//.attr("y", (d,i) => this.list[i].position* 125 + 70)
			.text((d,i) => this.list[i].name)
			//.append("text");

    }

}

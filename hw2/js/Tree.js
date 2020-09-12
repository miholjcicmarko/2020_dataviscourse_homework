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
     * Function that renders the tree
     */
    renderTree() {
		let svgContainer = d3.select("body").append("svg")
									.attr("width", 1200)
									.attr("height", 1200);

		let line_sec = svgContainer.append("line");

		let line = line_sec.selectAll("line")
			.data(this.list)
			.enter().append("path")
			.attr("x1", (d,i) => this.list[i].level * 110 +50)
			.attr("y1", (d,i) => this.list[i].position * 110 +50)
			.attr("x2", (d,i) => this.list[i].level * 0 + 50)
			.attr("y2", (d,i) => this.list[i].level * 0 + 50);

		let g = svgContainer.append("g");

		let selection = g.selectAll("circle")
			.data(this.list)
			.enter().append("circle")
			.attr("cx", (d,i) => this.list[i].level * 110 + 70)
			.attr("cy", (d,i) => this.list[i].position * 110 + 70)
			.attr("r", 50);

		let text = selection.select("svg")
			.data(this.list)
			.enter().append("text")
			.attr("x", (d,i) => this.list[i].level* 110 + 35)
			.attr("y", (d,i) => this.list[i].position* 110 + 70)
			.text((d,i) => this.list[i].name);
    }

}

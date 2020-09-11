/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
	let list = []

	for (let i = 0; i < json.length; i++){
		let newNode = new Node(json[i].name,json[i].parent);
		list.push(newNode);
	}
	this.list = list;

	for (let i = 0; i < json.length; i++){
		for (let k = 0; k < json.length; k++) {
			if (list[i].parentName === list[k].name) {
				list[i].parentNode = list[k];
				list[k].addChild(list[i]);
			}
		}
		
	}
	}
    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
		
	for (let i =0; i < this.list.length; i++) {
		let parent = this.list[i].parentName
		
		for (let k = 0; k < this.list.length; k++) {
			if (parent === this.list[k].name) {
				this.list[i].level = this.assignLevel(this.list[i],0);
				this.list[i].position = this.assignPosition(this.list[i],0);
			}
			else if (parent === "root") {
				this.list[i].level = this.assignLevel(this.list[i],0);
				this.list[i].position = this.assignPosition(this.list[i],0);
			}
		}
	}
	console.log(this.list)
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
	let parent = node.parentNode;

	let child_arr = [];

	child_arr = parent.children;

	if (child_arr[0] === node) {
		return this.assignPosition(node.parentNode, position);
	}
	else {
		// change this
		let numNodes = 0
		for (let i = 0; i < child_arr.length; i++) {
			if (child_arr[i] !== node){
				let grandchild = child_arr[i].children.length;
				if (grandchild > 1) {
					numNodes = numNodes + (grandchild-1);
				}
			}
		}
		let sisters = child_arr.length;
		if (sisters > 1 && sisters < 3) {
			numNodes = numNodes + (sisters-1);
		}
		if (node.level > 1){
			numNodes = numNodes + node.parentNode.position;
		}
		if (sisters > 2) {
			for (let i = 0; i < child_arr.length; i++) {
				if (child_arr[i] === node){
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
			let svg = d3.select("svg");
			// here you are running selectAll on an empty set!
			svg.selectAll("rect")
				.data([127, 61, 256])
				.enter().append("rect")
				.attr("x", 0)
				.attr("y", (d, i) => i * 60 + 50)
				.attr("width", d => d)
				.attr("height", 20)
				.style("fill", "steelblue");
	}
	
}


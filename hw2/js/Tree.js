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
		
	for (let i = 0; i < this.list.length; i++) {
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
		let numNodes = 0
		for (let i = 0; i < child_arr.length; i++) {
			if (child_arr[i] !== node){
				let grandchild = child_arr[i].children.length;
				numNodes = numNodes + grandchild;
			}
		}
		position = numNodes;
		return this.assignPosition(node.parentNode, position);
	}
}


	//else if (child_arr[position].children.length === 0) {
	//		return this.assignPosition(node.parentNode, position+1);
	//}
	//else {
	//	let newpos = child_arr[position].children.length;
	//	return this.assignPosition(node.parentNode, newpos);
	//}	

    /**
     * Function that renders the tree
     */
    renderTree() {
		let svg = d3.select('#list-container');
		
		let circles = svg.selectAll('circle')
			.data(this.list);
		
		circles.attr("fill","wheat");
	}
	
}


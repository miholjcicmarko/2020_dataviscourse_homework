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
		
	for (let i = 1; i < this.list.length; i++) {
		let parent = this.list[i].parentName
		
		for (let k = 0; k < this.list.length; k++) {
			if (parent === this.list[k].name) {
				this.assignLevel(this.list[i],0);
				this.assignPosition(this.list[i],0);
			}
			else if (parent === "root") {
				this.assignLevel(this.list[i],0);
				this.assignPosition(this.list[i],0);
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
	if (node.parentNode === null) {
		node.position = position;
		return;
	}

	child_arr = node.parentNode.children;

	if (child_arr[position] === node) {
		node.position = node.level + position;
	}
	else {
		return this.assignPosition(node, position+1); 		
	}

	}
	
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


/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {
	list = [];

	for (let i = 0; i < json.length; i++){
		let newNode = new Node(json[i][0], json[i][1]);
		newNode.parentNode(json[i])
		list.push(newNode);
		
	this.list = list;

	this.root = null;
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {
        // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()
		
	for (let i = 0; i < this.list.length; i++) {
		let parent = this.list[i].parentName
		
		for (let k = 0; k < this.list.length; k++) {
			if (parent === "root") {
				this.root = list[i];
				list[i].assignLevel(list[i],0);
				list[i].assignPosition(list[i],0);
			}
			else if (parent === this.list[k]) {	
				list[i].assignLevel(list[i],0);
				list[i].assignPosition(list[i],0);
			}
			else {
				continue;
			}
		}
	}
	}
    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {
	if (node.parentNode === null) {
		node.level = level;
	}
	else {
		assignLevel(node.parentNode, level+1);
	}
	}

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
	if (node.parentNode === null) {
		position = position;
	}

	child_arr = node.parentNode.children;

	if (child_arr[position] === node) {
		node.position = node.level + position;
	}
	else {
		return assignPosition(node, position+1); 		
	}

	}
	
    /**
     * Function that renders the tree
     */
    renderTree() {
		let svg = d3.select("style");
		
		let circles = svg.selectAll('circle')
			.data(this.list);
		
		circles.attr("fill","wheat");
	}
	
}

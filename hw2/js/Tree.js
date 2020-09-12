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
				if (this.list[i].parentName === this.list[k].name) {
					this.list[i].level = this.assignLevel(this.list[i],0);
					this.list[i].position = this.assignPosition(this.list[i],0);
				}	
			}
		}

		console.log(this.list);
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
		return 0;
	}

    /**
     * Function that renders the tree
     */
    renderTree() {

    }

}

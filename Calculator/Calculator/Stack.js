class Node {
    constructor(next,value) {
        this.next = next;
        this.value = value;
    }
}

class Stack {

    constructor() {
        this.stack = null;
    }

    push(value) {
        let head = this.stack;
        let newNode = new Node(null,value);
        if(head == null ){
            head = newNode;
        } else {
            newNode.next = head;
            head = newNode;
        }
    }

    empty() {
        return this.stack == null ;
    }

    pop() {
        let head = this.stack;
        if(head == null) 
            return "Empty stack!";
        this.stack = head.next;
        return head.value;
    }

    peek() {
        if(this.stack == null) 
            return "Empty stack!";
        return this.stack.value;
    }
}

module.exports = Stack;
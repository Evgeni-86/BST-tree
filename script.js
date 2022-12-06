/**********ВИЗУАЛИЗАЦИЯ ДЕРЕВА**********************************/
const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
  }
/**************************************************************/
/**********СОЗДАНИЕ ДЕРЕВА БИНАРНОГО***********************/
class Node { //конструктор узла
    constructor(data) {
        this.data = data
        this.left = null
        this.right = null
    }
}

class Tree { //конструктор бинарного дерева
    constructor(arr, start, end) {
        this.arr = arr
        this.root = this.buildTree(this.arr, start, end)
    }

    buildTree(arr, start, end) { //сроим рекурсией дерево
        if (end < start) {return null} // выход из рекурсии если 
        const pivotIndex = Math.floor((start + end) / 2)
        const root = new Node(arr[pivotIndex])
            root.left = this.buildTree(arr, start, pivotIndex -1)//строим левую ногу рекурсией
            root.right = this.buildTree(arr, pivotIndex + 1, end)//строим правую ногу рекурсией
        return root
    }

    insert(elem, root = this.root) { //вставка (элемента) рекурсия
            if (root == null) {return root = new Node(elem)}//если пусто то создаем узел           
            if (elem > root.data) {root.right = this.insert(elem, root.right)}//проход правая нога
            else { root.left = this.insert(elem, root.left) }// проход левая нога
            return root  
    }


    delete(elem, root = this.root) { //удаление элемента
    
        if (root == null) { //если коень пуст
            return root 
        }
        if (elem > root.data) { //если элемент больше текущего корня
            root.right = this.delete(elem, root.right) //ищем для удаления в правой ноге
            return root                
        }
        if (elem < root.data) {
            root.left = this.delete(elem, root.left)
            return root
        }

        if (elem == root.data && root.left == null && root.right == null) {//если узел без потомков
                root = null //то просто обнуляем его
                return root
        }

        if (elem == root.data && root.left == null) {// если у узла только правый потомок
            root = root.right //то потомка делаем родителем
        }

        if (elem == root.data && root.right == null) {
            root = root.left
        }

        if (elem == root.data && root.left && root.right) {//если у узла два потомка
            let minNodeR = minNodeRight(root.left) //ищем минимальный узел в левой ноге
            root.data = minNodeR.data //меняем значение удаляемого узла на значение минимального узла 
            root.left = this.delete(minNodeR.data, root.left)//и удаляем минимальный узел
        }

        return root
    }    

    find(elem, root = this.root) {
        if(root == null) {return false}
        if(root.data == elem) {return root}
        if(elem > root.data) {return this.find(elem, root.right)}
        else if(elem < root.data) {return this.find(elem, root.left)}
        return root
    }

    levelOrder(stack = [this.root], callback) {//поиск в ширину
        let rezult = []
        while (stack.length) {
            let el = stack.shift()
            console.log(el)
            rezult.push(el)
            if (callback) {callback(el)}
            if (el.left != null) {stack.push(el.left)}
            if (el.right != null) {stack.push(el.right)}
            continue
        }
        return console.log(rezult)
    }

    preOrder(node = this.root) {
        if(node == null) {return}
        console.log(node.data)
        if (node.left != null) {this.preOrder(node.left)}
        if (node.right != null) {this.preOrder(node.right)}
        return
    }

    height(value, node = [this.find(value)], counter = -1) {//высота узла
        if(node[node.length - 1].data) {
            node.forEach(element => {
                if (element.data) {
                    let cur_index = node.indexOf(element)
                    if(element.left != null ) {node.push(element.left)}
                    if(element.right != null) {node.push(element.right)}
                    node.splice(cur_index, 1, element.data)
                }
            })
        return this.height(value, node, counter + 1)
        }
        else {return counter}
    }

    isBalanced(stack = [this.root]) { //Проверка на баланс
        let balance = true
        while (stack.length && balance == true) {//пока есть элементы в очереди
            let first = 1
            let second = 1
            let el = stack.shift()// берем первый элемент из очереди и проверим высоту ветвей

            if(el.left != null) { first += this.height(el.left.data, [el.left])
                stack.push(el.left)
            } else {first = 0} //если нет левой ветви то 0

            if(el.right != null) { second += this.height(el.right.data, [el.right])
                stack.push(el.right)
            } else {second = 0} //если нет правой ветви то 0
            console.log(el.data)
            console.log([first, second])
            if (first-second== -1 || first-second==1 || first-second==0) {balance = true; console.log(balance)}
            else {balance = false; console.log(balance)}

            continue
        }
        return balance
    }

    reBalanced(arr = [this.root]) {//балансировка дерева
        if(arr[arr.length - 1].data) {
            arr.forEach(element => {
                if (element.data) {
                    let cur_index = arr.indexOf(element)
                    if(element.left != null ) {arr.push(element.left)}
                    if(element.right != null) {arr.push(element.right)}
                    arr.splice(cur_index, 1, element.data)
                }
            })
        return this.reBalanced(arr)
        }
        else {
            let new_arr = MergeSort(arr)
            this.root = this.buildTree(new_arr, 0, new_arr.length - 1)
        }
    }

}

/**************************************************************/
function minNodeRight(root) {//поиск минимального узла рекурсия
    let minNode = root
    if (root.left == null) {return minNode}//если у родителя нет левой ноги то он минимальный
    else if (root.left.data < root.data)//иначе сравниваем, если меньше то потомока 
    {                                       //делаем родителем и снова проверяем
        minNodeRight(root.left)
    }
    return minNode
}

/**********СОРТИРОВКА МАССИВА****************************************/
function MergeSort(array) {
    let arrUp = []
    let arrDown = []
    if (array.length <= 1) {return array}
    let pivotIndex = Math.floor((array.length - 1) / 2)
    let pivotElem = array[pivotIndex]
    for (let i = 0; i < array.length; i++) {
        if (i == pivotIndex) {continue}
        let cur = array[i]
        if (cur > pivotElem) {arrUp.push(cur)}
        if (cur < pivotElem) {arrDown.push(cur)}    
    }
    return [...MergeSort(arrDown), pivotElem, ...MergeSort(arrUp)]
} 
/*******************************************************************/

// const arr = [1,2,3,4,6,7,8,9,10,11,13,14,15,16]
const arr = [1,9,7,3,12,62,4,9,20,87,24,10,5,23]

const art_sort = MergeSort(arr)
let tree = new Tree(art_sort, 0, art_sort.length-1)

prettyPrint(tree.root)
// tree.insert(5)
// tree.insert(12)
tree.insert(13)
// tree.delete(24)
// tree.delete(62)
// tree.delete(20)
prettyPrint(tree.root)
// console.log(tree.find(24))
// tree.levelOrder()
// tree.preOrder()
// console.log(tree.height(23))
// console.log(tree.isBalanced())
tree.reBalanced()
prettyPrint(tree.root)

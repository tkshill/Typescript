/* ---------------------------- INTRODUCTION --------------------------

Solving Domino problems with graph theory

Problem: Write a function `canChain` to determine whether a set of dominoes (an array of tuples) 
can be chained.

e.g. The dominoes (1, 2), (1, 3), (2, 3) can be chained together as (1, 2) (2, 3) (3, 1)
So canChain([[1, 2], [1, 3], [2, 3]]) should return true.

Conversely the dominoes (1, 2), (1, 3), (4, 4) cannot be chained because there is no domino
that can connect to (4, 4).
So canChain([[1, 2], [1, 3], [4, 4]])

Some extra rules:
- empty arrays should return true
- the ends of the domino set should also match (making a perfect loop)

Solution:

We can model our set of dominoes as a graph where each domino represents two nodes (one for 
each number on the domino) and the edge/line/arrow that connects them.

When two dominoes have the same number, that means at least one of their nodes overlap 
and they can be chained.

Thus we can rephrase the problem of "Can the dominoes chain?" to
"Do these nodes all connect?" and "Can we get from any node to every other node and back to 
the start."

It turns out, in graph theory, this type of configuration already has a name: A Euler Graph. 

A Euler graph has a Euler cycle, which is exactly what we just described; a Euler cycle is a 
path from one node on a graph that visits every other node and returns to the original graph 
WITHOUT having to backtrack.

So all we need to do to prove if our dominoes can chain is to prove that the graph those dominoes
represent has a Euler cycle.

And THAT it turns out, also has a formal definition.

"A Connected graph has an Euler cycle if and only if every vertex has even degree".

So our solution now has two parts:
- check if every vertex (number) in our set of dominoes has an even degree 
(appears as a multiple of two).

- check if the dominoes can be converted to a Connected graph

------------------------- DOMAIN -----------------------------------------
*/

type NodeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type Domino = [NodeNumber, NodeNumber];

type EdgeSet = Domino[]; // A representation of the set of edges in a graph

type AdjacencyMatrix = MatrixValue[][]; // Representation of a graph as a matrix of filled/unfilled cells

type AdjacencyList = number[][]; // Representation as a list of connected nodes

type MatrixValue = "Filled" | "Empty";

type NodeStatus = "Visited" | "Not Visited";

type EulerCondition = (_: EdgeSet) => boolean; // Functions that test our Euler's theory

// -------------------------- HELPER FUNCTIONS --------------------------

const id = (x: any) => x; // yes, this returns itself.

// simplifies an edgeset down to its unique nodes by converting to and from a set
const getNodes = (dominoes: EdgeSet): NodeNumber[] => [
  ...new Set(dominoes.flatMap(id))
];

// ------------------------- CONVERSION FUNCTIONS -------------------

const toMatrix = (dominoes: EdgeSet) => {
  const nodes = getNodes(dominoes);
  const nodeToIndex = (digit: NodeNumber) =>
    nodes.findIndex((node) => node === digit);

  // initial graph of all false values
  const initMatrix: AdjacencyMatrix = Array.from(Array(nodes.length), () =>
    [...new Array(nodes.length)].map((_) => "Empty")
  );

  const addToMatrix = (graph: AdjacencyMatrix, domino: Domino) => {
    const [x, y] = domino;
    graph[nodeToIndex(x)]![nodeToIndex(y)] = "Filled";
    graph[nodeToIndex(y)]![nodeToIndex(x)] = "Filled";

    return graph;
  };

  return dominoes.reduce(addToMatrix, initMatrix);
};

const toAdjacencyList = (graph: AdjacencyMatrix): AdjacencyList =>
  graph.map(
    (row) =>
      row
        .map((val, index): [number, MatrixValue] => [index, val]) // add indexes
        .filter(([_, val]) => val === "Empty") // filter unfilled cells
        .map(([index, _]) => index) // keep indexes
  );

/* --------------------- IMPLEMENTATION ---------------------------------

Our depthfirstsearch (dfs) function checks to see what nodes can be visited from other nodes.
It updates the visited array every time it gets to a new node.
If a graph is connected, dfs should visit every node.

*/
type DFS = (...args: [AdjacencyList, NodeStatus[], number]) => void;
const depthFirstSearch: DFS = (graph, statuses, node) => {
  statuses[node] = "Visited";

  graph[node]!.filter((adjacent) => statuses[adjacent] === "Not Visited") // get unvisited nodes
    .forEach((unvisitedNode) =>
      depthFirstSearch(graph, statuses, unvisitedNode)
    );
};

// determine if dominoes represent connected graph
const isConnected: EulerCondition = (dominoes) => {
  const nodes = getNodes(dominoes);
  const statuses: NodeStatus[] = [...new Array(nodes.length)].map(
    (_) => "Not Visited"
  );
  const graph = toAdjacencyList(toMatrix(dominoes));

  // time to spelunk
  depthFirstSearch(graph, statuses, 0);

  return statuses.every((x) => x === "Visited");
};

// check if every number in the dominoes has an even number of representations
const allEvenDegree: EulerCondition = (dominoes) => {
  const isEven = (n: number) => n % 2 === 0;

  // creates a map of nodes and the amount of times they appear
  const addToMap = (m: Map<NodeNumber, number>, node: NodeNumber) =>
    m.has(node) ? m.set(node, m.get(node)! + 1) : m.set(node, 1);

  const nodeCounts: number[] = [
    ...dominoes
      .flatMap(id) // concat + flatten
      .reduce(addToMap, new Map()) // fold into a map
      .values()
  ]; // back to array

  return nodeCounts.every(isEven);
};

// PUTTING IT ALL TOGETHER
export const canChain: EulerCondition = (dominoes) =>
  dominoes.length === 0 || (allEvenDegree(dominoes) && isConnected(dominoes));

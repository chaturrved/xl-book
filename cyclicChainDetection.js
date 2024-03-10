//Storage for graph representation
let graphComponentMatCollection = [];
let graphComponentMatrix = [];
//
// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     row.push([]);
//   }
//   graphComponentMatrix.push(row);
// }
//
function isGraphCyclic(graphComponentMat) {
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }

    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        let response = dfsCycleDetection(
          graphComponentMat,
          i,
          j,
          visited,
          dfsVisited,
        );
        if (response) return [i, j];
      }
    }
  }

  return null;
}

function dfsCycleDetection(graphComponentMat, row, col, visited, dfsVisited) {
  visited[row][col] = true;
  dfsVisited[row][col] = true;

  for (
    let children = 0;
    children < graphComponentMat[row][col].length;
    children++
  ) {
    let [nrid, ncid] = graphComponentMat[row][col][children];
    if (!visited[nrid][ncid]) {
      let res = dfsCycleDetection(
        graphComponentMat,
        nrid,
        ncid,
        visited,
        dfsVisited,
      );

      if (res) return true;
    } else if (dfsVisited[nrid][ncid]) {
      return true;
    }
  }
  dfsVisited[row][col] = false;
}

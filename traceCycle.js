async function tracePath(graphComponentMat, cycleNode) {
  let [srcr, srcc] = cycleNode;
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

  let response = await uiTracingCycle(
    graphComponentMat,
    srcr,
    srcc,
    visited,
    dfsVisited,
  );
  if (response) return Promise.resolve(true);
  return Promise.resolve(false);
}

async function uiTracingCycle(
  graphComponentMat,
  row,
  col,
  visited,
  dfsVisited,
) {
  visited[row][col] = true;
  dfsVisited[row][col] = true;

  let cell = document.querySelector(`.cell[rid="${row}"][cid="${col}"]`);
  cell.style.backgroundColor = "lightblue";
  await wait();
  for (
    let children = 0;
    children < graphComponentMat[row][col].length;
    children++
  ) {
    let [nrid, ncid] = graphComponentMat[row][col][children];
    if (!visited[nrid][ncid]) {
      let res = await uiTracingCycle(
        graphComponentMat,
        nrid,
        ncid,
        visited,
        dfsVisited,
      );

      if (res) {
        cell.style.backgroundColor = "transparent";
        await wait();
        return Promise.resolve(true);
      }
    } else if (dfsVisited[nrid][ncid]) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${nrid}"][cid="${ncid}"]`,
      );
      cyclicCell.style.backgroundColor = "lightsalmon";
      await wait();
      cyclicCell.style.backgroundColor = "transparent";
      await wait();
      cell.style.backgroundColor = "transparent";

      return Promise.resolve(true);
    }
  }
  dfsVisited[row][col] = false;
  return Promise.resolve(false);
}

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [cell, cellProps] = activeCell(address);
      let enteredData = cell.innerText;

      if (enteredData == cellProps.value) {
        return;
      }

      //Modification of data and ui
      cellProps.value = cell.innerText;

      removeRelationship(cellProps, address);
      updateChildren(address);
      cellProps.formula = "";
      //remove formula from formular bar
      //formulaBar.value = "";

      //scroll to top
      cell.scrollTop = 0;
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", async (e) => {
  const formula = formulaBar.value;
  if (e.key == "Enter" && formula) {
    //remove relationship
    let [rid, cid] = decodeCellFromAddress(addressBar.value);
    let cellProps = sheetDB[rid][cid];
    let parentsList = cellProps.formula.split(" ");
    let currentParentsList = formula.split(" ");
    parentsList.forEach((parent) => {
      let code = parent.charCodeAt(0);
      if (code >= 65 && code <= 90 && !currentParentsList.includes(parent)) {
        removeRelationship(parent, addressBar.value);
      }
    });
    addChildToGraphComponent(formula, addressBar.value);
    let cycleNode = isGraphCyclic(graphComponentMatrix);
    if (cycleNode) {
      let response = confirm(
        "Your dependency chain is cyclic. Which is not allowed! Do you want to trace the path?",
      );
      while (response === true) {
        await tracePath(graphComponentMatrix, cycleNode);
        response = confirm("Do you want to trace cyclic path again?");
      }
      removeChildFromGraphComponent(formula);
      return;
    }
    //evaluate current formula
    let evaluatedValue = evaluateFormula(formula);
    establishRelationship(addressBar.value, formula);
    setCellValueAndFormula(evaluatedValue, formula, addressBar.value);
    updateChildren(addressBar.value);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeCellFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [prid, pcid] = decodeCellFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula) {
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiVal = encodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 80) {
      let [prid, pcid] = decodeCellFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChildren(parentAddress) {
  let [prid, pcid] = decodeCellFromAddress(parentAddress);
  let parentCellProps = sheetDB[prid][pcid];
  let children = parentCellProps.children;
  children.forEach((child) => {
    let [crid, ccid] = decodeCellFromAddress(child);
    let childCellProps = sheetDB[crid][ccid];
    let evaluatedValue = evaluateFormula(childCellProps.formula);
    setCellValueAndFormula(evaluatedValue, childCellProps.formula, child);
    updateChildren(child);
  });
}

function evaluateFormula(formula) {
  let decodedFormula = formula.split(" "); // Decode formula for easy parsing
  for (let i = 0; i < decodedFormula.length; i++) {
    let asciiVal = decodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      // Check for a valid address to evaluate
      let [rid, cid] = decodeCellFromAddress(decodedFormula[i]);
      let cellProp = sheetDB[rid][cid];
      decodedFormula[i] = cellProp.value;
    }
  }
  //console.log(sheetDB);
  formula = decodedFormula.join(" ");
  return eval(formula);
}

function setCellValueAndFormula(value, formula, address) {
  let [rid, cid] = decodeCellFromAddress(address);
  let cell = grid.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProps = sheetDB[rid][cid];
  cellProps.value = value;
  cellProps.formula = formula;
  cell.innerText = value;
}

function establishRelationship(childAddress, formula) {
  let decodedFormula = formula.split(" ");
  for (let i = 0; i < decodedFormula.length; i++) {
    let asciiVal = decodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      // If valid parent -> add child(active) cell in parent
      let parentAddress = decodedFormula[i];
      let [rid, cid] = decodeCellFromAddress(parentAddress);
      let parentProp = sheetDB[rid][cid];
      parentProp.children.push(childAddress);
    }
  }
}

function removeRelationship(cellProp, activeAddress) {
  let formula = cellProp.formula;
  let decodedFormula = formula.split(" ");
  for (let i = 0; i < decodedFormula.length; i++) {
    let asciiVal = decodedFormula[i].charCodeAt(0);
    if (asciiVal >= 65 && asciiVal <= 90) {
      let [rid, cid] = decodeCellFromAddress(decodedFormula[i]);
      let parentCellProp = sheetDB[rid][cid];
      let removeIdx = parentCellProp.children.indexOf(activeAddress); // Get index of child from parent to remove child
      parentCellProp.children.splice(removeIdx, 1); // Remove child in parent
    }
  }
}

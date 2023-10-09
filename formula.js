for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [cell, cellProps] = activeCell(address);
      //Modification of data and ui
      cellProps.value = cell.innerText;

      //remove formula from formular bar
      formulaBar.value = "";

      //scroll to top
      cell.scrollTop = 0;
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", (e) => {
  const formula = formulaBar.value;
  if (e.key == "Enter" && formula) {
    //remove relationship
    let [cell, cellProps] = activeCell(addressBar.value);
    let parentsList = cellProps.formula.split(" ");
    let currentParentsList = formula.split(" ");
    parentsList.forEach((parent) => {
      let code = parent.charCodeAt(0);
      if (code >= 65 && code <= 90 && !currentParentsList.includes(parent)) {
        removeRelationship(parent, addressBar.value);
      }
    });

    //evaluate current formula
    let evaluatedValue = evaluateFormula(formula);
    setCellValueAndFormula(evaluatedValue, formula, addressBar.value);
  }
});

function updateChildren(parentAddress) {
  let [parentCell, parentCellProps] = activeCell(parentAddress);
  let children = parentCellProps.children;
  children.forEach((child) => {
    let [childCell, childCellProps] = activeCell(child);
    let evaluatedValue = evaluateFormula(childCellProps.formula);
    setCellValueAndFormula(evaluatedValue, childCellProps.formula, child);
    updateChildren(child);
  });
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let code = encodedFormula[i].charCodeAt(0);
    if (code >= 65 && code <= 90) {
      let [cell, cellProps] = activeCell(encodedFormula[i]);
      establishRelationship(encodedFormula[i]); //maintain relations to update values on change
      encodedFormula[i] = cellProps.value;
    }
  }
  //console.log(sheetDB);
  formula = encodedFormula.join(" ");
  return eval(formula);
}

function setCellValueAndFormula(value, formula, address) {
  let [cell, cellProps] = activeCell(address);
  cellProps.value = value;
  cellProps.formula = formula;
  cell.innerText = value;
}

function establishRelationship(parent) {
  let p = parent.split("");
  let column = p[0].charCodeAt(0) - 65;

  if (!sheetDB[p[1] - 1][column].children.includes(addressBar.value)) {
    sheetDB[p[1] - 1][column].children.push(addressBar.value);
  }
}

function removeRelationship(parent, child) {
  let p = parent.split("");
  let column = p[0].charCodeAt(0) - 65;

  let index = sheetDB[p[1] - 1][column].children.indexOf(child);
  sheetDB[p[1] - 1][column].children.splice(index, 1);
}

//storage
let sheetDB = [];

for (let i = 0; i < rows; i++) {
  let sheetRow = [];
  for (let j = 0; j < cols; j++) {
    let cell = {
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: "14",
      fontColor: "#000000",
      BGcolor: "transparent",
    };
    sheetRow.push(cell);
  }
  sheetDB.push(sheetRow);
}

//color variables for UI
let activeColor = "#d1d8e0";
let inactiveColor = "#ecf0f1";

//selectors for the cell props
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".bg-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

//for cell content display
let cellContent = document.querySelector(".cell-content");

//attaching event listeners for cell-property triggers
//these will also trigger two-way binding
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.bold = !cellProps.bold;
  cell.style.fontWeight = cellProps.bold ? "bold" : "normal";
  bold.style.backgroundColor = cellProps.bold ? activeColor : inactiveColor;
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.italic = !cellProps.italic;
  cell.style.fontStyle = cellProps.italic ? "italic" : "normal";
  italic.style.backgroundColor = cellProps.italic ? activeColor : inactiveColor;
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.fontSize = fontSize.value;
  cell.style.fontSize = cellProps.fontSize + "px";
  fontSize.value = cellProps.fontSize;
});

fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProps.fontFamily;
  fontFamily.value = cellProps.fontFamily;
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.underline = !cellProps.underline;
  cell.style.textDecoration = cellProps.underline ? "underline" : "none";
  underline.style.backgroundColor = cellProps.underline
    ? activeColor
    : inactiveColor;
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.fontColor = fontColor.value;
  cell.style.color = cellProps.fontColor;
  fontColor.value = cellProps.fontColor;
});

BGcolor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.BGcolor = BGcolor.value;
  cell.style.backgroundColor = cellProps.BGcolor;
  BGcolor.value = cellProps.BGcolor;
});

alignment.forEach((align) => {
  align.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProps] = activeCell(address);

    let alignValue = e.target.classList[0];
    cellProps.alignment = alignValue;
    cell.style.textAlign = cellProps.alignment;
    changeAlignmentUI(alignValue);
  });
});

function changeAlignmentUI(alignValue) {
  switch (alignValue) {
    case "left":
      leftAlign.style.backgroundColor = activeColor;
      centerAlign.style.backgroundColor = inactiveColor;
      rightAlign.style.backgroundColor = inactiveColor;
      break;
    case "center":
      leftAlign.style.backgroundColor = inactiveColor;
      centerAlign.style.backgroundColor = activeColor;
      rightAlign.style.backgroundColor = inactiveColor;
      break;
    case "right":
      leftAlign.style.backgroundColor = inactiveColor;
      centerAlign.style.backgroundColor = inactiveColor;
      rightAlign.style.backgroundColor = activeColor;
      break;
  }
}

let allCells = document.querySelectorAll(".cell");
allCells.forEach((cell) => {
  addPropertyReflectionListener(cell);
});

function addPropertyReflectionListener(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProps] = activeCell(address);

    //apply properties to cells
    cell.style.fontWeight = cellProps.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProps.italic ? "italic" : "normal";
    cell.style.fontSize = cellProps.fontSize + "px";
    cell.style.fontFamily = cellProps.fontFamily;
    cell.style.textDecoration = cellProps.underline ? "underline" : "none";
    cell.style.color = cellProps.fontColor;
    cell.style.backgroundColor = cellProps.BGcolor;
    cell.style.textAlign = cellProps.alignment;

    //two-way binding
    bold.style.backgroundColor = cellProps.bold ? activeColor : inactiveColor;
    italic.style.backgroundColor = cellProps.italic
      ? activeColor
      : inactiveColor;
    underline.style.backgroundColor = cellProps.underline
      ? activeColor
      : inactiveColor;
    fontSize.value = cellProps.fontSize;
    fontFamily.value = cellProps.fontFamily;
    fontColor.value = cellProps.fontColor;
    BGcolor.value = cellProps.BGcolor;
    changeAlignmentUI(cellProps.alignment);
    cellContent.value = cell.innerText;
  });
}

function activeCell(address) {
  let [rid, cid] = decodeCellFromAddress(address);
  //get cell and storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProps = sheetDB[rid][cid];
  return [cell, cellProps];
}

function decodeCellFromAddress(address) {
  let rid = Number(address.slice(1) - 1); // -1 for converting cell representation to index representation
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}

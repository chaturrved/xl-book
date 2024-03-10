let rows = 100;
let cols = 26;

let addressBar = document.querySelector(".address-bar");

let addressColCont = document.querySelector(".address-col-cont");

//update cell through content bar
addressBar.addEventListener("keydown", (e) => {
  let address = addressBar.value;
  let [cell, cellProps] = activeCell(address);
  //Modification of data and ui
  cellProps.value = addressBar.value;
});

for (let i = 0; i < rows; i++) {
  let addressCell = document.createElement("div");
  addressCell.setAttribute("class", "address-col");
  addressCell.innerText = i + 1;
  addressColCont.appendChild(addressCell);
}

let addressRowCont = document.querySelector(".address-row-cont");
for (let i = 0; i < cols; i++) {
  let addressCell = document.createElement("div");
  addressCell.setAttribute("class", "address-row");
  addressCell.innerText = String.fromCharCode(65 + i);
  addressRowCont.appendChild(addressCell);
}

let grid = document.querySelector(".cells-cont");
for (let i = 0; i < rows; i++) {
  let row = document.createElement("div");
  row.setAttribute("class", "row-cont");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contentEditable", "true");
    cell.setAttribute("spellcheck", "false");

    // Attributes for cell and storage identification
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);

    row.appendChild(cell);
    addListenerForAddressBarDisplay(cell, i + 1, String.fromCharCode(65 + j));
  }
  grid.appendChild(row);
}

function addListenerForAddressBarDisplay(cell, rowId, colId) {
  cell.addEventListener("click", (e) => {
    addressBar.value = `${colId}${rowId}`;
  });
}

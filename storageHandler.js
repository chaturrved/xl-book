let addSheetBtn = document.querySelector(".sheet-add-icon");
let sheetFolderCont = document.querySelector(".sheet-folder-cont");
addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.setAttribute("class", "sheet-folder");
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);
  sheet.innerHTML = `<div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>`;
  sheetFolderCont.appendChild(sheet);

  createSheetDB();
  handleSheetActiveness(sheet);
  createGraphComponentMatrix();
  handleSheetRemoval(sheet);
  sheet.click();
});

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // Right click
    if (e.button !== 2) return;

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length === 1) {
      alert("You need to have atleast one sheet!!");
      return;
    }

    let response = confirm(
      "Your sheet will be removed permanently, Are you sure?",
    );
    if (response === false) return;

    let sheetIdx = Number(sheet.getAttribute("id"));
    // DB
    sheetDBCollection.splice(sheetIdx, 1);
    graphComponentMatCollection.splice(sheetIdx, 1);
    // UI
    handleSheetUIRemoval(sheet);

    // By default DB to sheet 1 (active)
    sheetDB = sheetDBCollection[0];
    graphComponentMatrix = graphComponentMatCollection[0];
    handleSheetToggle();
  });
}

function handleSheetUIRemoval(sheet) {
  sheet.remove();
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
    allSheetFolders[i].style.backgroundColor = "transparent";
  }

  allSheetFolders[0].style.backgroundColor = "#ced6e0";
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let id = Number(sheet.getAttribute("id"));
    handleSheetDB(id);
    handleSheetToggle();
    handleSheetUI(sheet);
  });
}

function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "transparent";
  }
  sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetDB(sheetId) {
  sheetDB = sheetDBCollection[sheetId];
  graphComponentMatrix = graphComponentMatCollection[sheetId];
}

function handleSheetToggle() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }
  //default dom click on first cell on application launch
  let firstCell = document.querySelector(".cell");
  firstCell.click();
}

function createSheetDB() {
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
        BGcolor: "#ecf0f1",
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cell);
    }
    sheetDB.push(sheetRow);
  }

  sheetDBCollection.push(sheetDB);
}

function createGraphComponentMatrix() {
  let graphComponentMatrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push([]);
    }
    graphComponentMatrix.push(row);
  }
  graphComponentMatCollection.push(graphComponentMatrix);
}

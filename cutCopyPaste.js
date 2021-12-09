let ctrlKey = false;
document.addEventListener("keydown",(e)=>{
    ctrlKey = e.ctrlKey;
});
document.addEventListener("keyup",(e)=>{
    ctrlKey = e.ctrlKey;
});

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let rangeStorage = [];

function handleSelectedCells(cell){
    cell.addEventListener("click",(e)=>{
        // select cells range work
        if(!ctrlKey) return;

        if(rangeStorage.length >= 2){
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid,cid]);

    });
}

function defaultSelectedCellsUI(){
    for(let i=0;i<rangeStorage.length;i++){
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid #dfe4ea";
    }
}

let copyData = [];

copyBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for(let i=strow;i<=endrow;i++){
        let copyRow = [];
        for(let j=stcol;j<=endcol;j++){
            let cellProp = JSON.parse(JSON.stringify(sheetDB[i][j]));
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

cutBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length < 2) return;
    copyData = [];
    let strow = rangeStorage[0][0];
    let stcol = rangeStorage[0][1];
    let endrow = rangeStorage[1][0];
    let endcol = rangeStorage[1][1];
    for(let i=strow;i<=endrow;i++){
        let copyRow = [];
        for(let j=stcol;j<=endcol;j++){
            let cellPropCopy = JSON.parse(JSON.stringify(sheetDB[i][j]));
            let cellProp = sheetDB[i][j];

            copyRow.push(cellPropCopy);
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = "14";
            cellProp.fontFamily = "monospace";
            cellProp.BGColor = "#000000";
            cellProp.alignment = "left";
            cellProp.fontColor = "#000000";

            cell.click();

        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
});

pasteBtn.addEventListener("click",(e)=>{
    // Paste Cells Data work
    if(rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0]-rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1]-rangeStorage[1][1]);

    let address = addressBar.value;
    let [stRow,stCol] = decodeRIDCIDFromAddress(address);

    for(let i=stRow,r=0;i<=stRow+rowDiff;i++,r++){
        for(let j=stCol,c=0;j<=stCol+colDiff;j++,c++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell) continue;

            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];

            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.BGColor = data.BGColor;
            cellProp.alignment = data.alignment;
            cellProp.fontColor = data.fontColor;

            // UI
            cell.click();
        }
    }
});
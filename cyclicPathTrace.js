
function colorPromise() {
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            resolve();
        },1000);
    });
}

async function isGraphCyclicTracePath(graphComponentMatrix,cycleResonse) {
    // Dependenvy -> visited, dfsVisited (2D Array)
    let visited = [];
    let dfsVisited = [];

    let [srcr,srcc] = cycleResonse;

    for(let i=0;i<rows;i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    let response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited);
    if(response === true) return Promise.resolve(true);

    return Promise.resolve(false);;
}

// Coloring Cells for Tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcr, srcc, visited, dfsVisited){
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);

    cell.style.backgroundColor = "lightblue";
    await colorPromise();

    for(let children = 0;children < graphComponentMatrix[srcr][srcc].length;children++){
        let [crid,ccid] = graphComponentMatrix[srcr][srcc][children];
        if(visited[crid][ccid] === false){
            let response = await dfsCycleDetectionTracePath(graphComponentMatrix,crid,ccid,visited,dfsVisited);
            if(response === true){
                cell.style.backgroundColor = "transparent";
                await colorPromise();
                return Promise.resolve(true);
            }
        }
        else if(dfsVisited[crid][ccid] === true){
            let cyclicCell = document.querySelector(`.cell[rid="${crid}"][cid="${ccid}"]`);
            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();

            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();

            cell.style.backgroundColor = "transparent";
            await colorPromise();
            
            return Promise.resolve(true);
        }
    }

    dfsVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}
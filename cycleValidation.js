// Storage
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for(let i=0;i<rows;i++){
//     let row = [];
//     for(let j=0;j<cols;j++){
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }

// True -> Cycle
function isGraphCyclic(graphComponentMatrix) {
    // Dependenvy -> visited, dfsVisited (2D Array)
    let visited = [];
    let dfsVisited = [];

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

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(visited[i][j] === false){
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response === true){
                    return [i,j];
                }
            }
        }
    }
    return null;
}

function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited){
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for(let children = 0;children < graphComponentMatrix[srcr][srcc].length;children++){
        let [crid,ccid] = graphComponentMatrix[srcr][srcc][children];
        if(visited[crid][ccid] === false){
            let response = dfsCycleDetection(graphComponentMatrix,crid,ccid,visited,dfsVisited);
            if(response === true){
                return true;
            }
        }
        else if(dfsVisited[crid][ccid] === true){
            return true;
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}
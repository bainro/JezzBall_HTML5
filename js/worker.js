
function flood (col, row) {
    if (    
        col >= 0 && row >= 0 && col < 27 && row < 18
        && !(dead_cells.includes(col + '_' + row))
        && !(need_marked.includes(col + '_' + row))
    ) {
        need_marked.push(col + '_' + row);

        //recursive calls passing each adjacent cell
        flood(col + 1, row);
        flood(col - 1, row);
        flood(col, row - 1);
        flood(col, row + 1);
    }
    return;
}

/*
function flood(col, row) {

    var queue = [];
    queue.push([col, row]);
    for (var i = 0; i < queue.length; i++) {
        var w = [];
        w[0] = queue[i][0];
        w[1] = queue[i][1];
        var e = [];
        e[0] = queue[i][0];
        e[1] = queue[i][1];

        while (w[0] - 1 >= 0 && !(need_marked.includes((w[0] - 1) + '_' + w[1])) && !(dead_cells.includes((w[0] - 1) + '_' + w[1]))) {
            w[0] = w[0] - 1;
        }
        while (e[0] + 1 < 27 && !(need_marked.includes((e[0] + 1) + '_' + e[1])) && !(dead_cells.includes((e[0] + 1) + '_' + e[1]))) {
            e[0] = e[0] + 1;
        }
        //calc nodes between e and w
        for (var j = w[0]; j <= e[0]; j++) {
            //console.log('marked one as true');
            need_marked.push(j + '_' + w[1]);
            if (!(need_marked.includes(j + '_' + (w[1] - 1))) && (w[1] - 1) >= 0 && !(dead_cells.includes(j + '_' + (w[1] - 1)))) {
                queue.push([j, w[1] - 1]);
            }
            if (!(need_marked.includes(j + '_' + (w[1] + 1))) && (w[1] + 1) < 18 && !(dead_cells.includes(j + '_' + (w[1] + 1)))) {
                queue.push([j, w[1] + 1]);
            }
        }
    }
    return;
}
*/

onmessage = function (e) {

    need_marked = [];
    dead_cells = e.data[0];
    //console.log('not broken yet');
    flood(e.data[1], e.data[2]);
    //console.log(need_marked);
    postMessage(need_marked);
}
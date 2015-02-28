var cells = [];

export function addCell(cell) {
  cells.push(cell);
}

export function searchAllCells() {
  for (var i=0; i<cells.length; i++) {
    cells[i].cellClicked();
  }
}

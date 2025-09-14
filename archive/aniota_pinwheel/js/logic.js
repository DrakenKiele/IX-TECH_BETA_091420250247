
class SelectionManager {
  constructor() {
    this.selected = [];
  }
  select(square) {
    if (!this.selected.includes(square)) {
      this.selected.push(square);
    }
  }
  deselect(square) {
    this.selected = this.selected.filter((s) => s !== square);
  }
  clear() {
    // Remove selected class from all currently selected elements
    this.selected.forEach(square => {
      if (square && square.classList) {
        square.classList.remove('selected');
      }
    });
    this.selected = [];
  }
  getSelected() {
    return this.selected;
  }
  setSelected(squares) {
    this.selected = Array.isArray(squares) ? squares : [];
  }
}

export const selectionManager = new SelectionManager();

export function initializeMultiSelect(selectedSquaresRef = null) {
  const squares = document.querySelectorAll(".snapgrid-square");
  let selectedSquares = selectionManager.getSelected();
  squares.forEach((square) => {
    square.addEventListener("click", () => {
      // Only allow selection if isSelectable is true
      const shapeId = square.id;
      // Find the shape object in window._aniotaAllShapes or window._aniotaShapesArray
      let shape = null;
      if (window._aniotaAllShapes) {
        shape = window._aniotaAllShapes.find((s) => s.id === shapeId);
      } else if (window._aniotaShapesArray) {
        shape = window._aniotaShapesArray.find((s) => s.id === shapeId);
      }
      if (!shape || shape.isSelectable === false) {
        // Not selectable, do nothing
        return;
      }
      if (selectedSquares.includes(square)) {
        selectionManager.deselect(square);
        square.classList.remove('selected');
      } else {
        selectionManager.select(square);
        square.classList.add('selected');
      }
      selectedSquares = selectionManager.getSelected();
      if (
        selectedSquaresRef &&
        typeof selectedSquaresRef === "object" &&
        "value" in selectedSquaresRef
      ) {
        selectedSquaresRef.value = selectedSquares;
      }
    });
  });
}

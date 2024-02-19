import { useState } from 'react';
import { CellCoordinates } from "../types";

export const useCellHighlighting = () => {
  const [cellClasses, setCellClasses] = useState<Array<{ rowIndex: number; colIndex: number; classes: string[] }>>([]);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates | null>(null);

  const setHighlightedRange = (rowIndex: number, colIndex1: number, colIndex2: number): void => {
    const startColIndex = Math.min(colIndex1, colIndex2);
    const endColIndex = Math.max(colIndex1, colIndex2);

    console.log(startColIndex + " " + endColIndex);
    const newCellClasses = [...cellClasses];

    for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
      const cellEntryIndex = newCellClasses.findIndex(entry => entry.rowIndex === rowIndex && entry.colIndex === colIndex);

      if (cellEntryIndex !== -1) {
        newCellClasses[cellEntryIndex].classes = ['is-selected'];
      } else {
        newCellClasses.push({ rowIndex, colIndex, classes: ['is-selected'] });
      }
    }

    setCellClasses(newCellClasses);
  };


  const handleCellHover = (rowIndex: number, colIndex: number, selectedCell:CellCoordinates, secondSelectedCell:CellCoordinates, isAvailable: boolean) => {
    
    if (selectedCell && !secondSelectedCell && isAvailable) {
      setHoveredCell({ rowIndex, colIndex });
    }
  };


  const isCellInRange = (rowIndex: number, colIndex: number,selectedCell:CellCoordinates, secondSelectedCell:CellCoordinates, isAvailable: boolean) => {
    if (!selectedCell || !isAvailable) return false;
    if (rowIndex !== selectedCell.rowIndex) return false;

    const endCell = secondSelectedCell || hoveredCell;
    if (!endCell) return false;

    const startColIndex = Math.min(selectedCell.colIndex, endCell.colIndex);
    const endColIndex = Math.max(selectedCell.colIndex, endCell.colIndex);
    return colIndex >= startColIndex && colIndex <= endColIndex;
  };

  

  return {
    isCellInRange,
    hoveredCell,
    setHighlightedRange,
    handleCellHover,
  };
};

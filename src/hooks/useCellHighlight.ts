import { RefObject, useEffect, useState } from 'react';
import { CellCoordinates } from "../types";

export const useCellHighlighting = (bookingCalendarWrapperRef: RefObject<HTMLDivElement>) => {
  // const [cellHlClasses, setCellHlClasses] = useState<Array<{ rowIndex: number; colIndex: number; classes: string[] }>>([]);
  // const [cellClasses, setCellClasses] = useState<Array<{ rowIndex: number; colIndex: number; classes: string[] }>>([]);
  const [hoveredCell, setHoveredCell] = useState<CellCoordinates | null>(null);


  useEffect(() => {
    
    const handleMouseLeave = () => {
      setHoveredCell(null);
    };

    // Attach the mouseleave listener to just the bookingCalendarWrapper
    const currentWrapper = bookingCalendarWrapperRef.current;
    if (currentWrapper) {
      currentWrapper.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup function to remove both event listeners
    return () => {
      if (currentWrapper) {
        currentWrapper.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);




  const handleCellHover = (rowIndex: number, colIndex: number, selectedCell:CellCoordinates, secondSelectedCell:CellCoordinates, isAvailable: boolean) => {
    
    
    
    if (selectedCell && !secondSelectedCell && isAvailable) {

      // const startCellColIndex = selectedCell.colIndex;
      const startCellRowIndex = selectedCell.rowIndex;
      // Determine the new class based on the direction
      // const newClass = colIndex < startCellColIndex ? 'has-selection-left' : 'has-selection-right';

      // Check for left direction (which should actually check if the hovered cell is to the left of the selected cell)
      //setCellClasses([{ rowIndex: startCellRowIndex, colIndex: startCellColIndex, classes: [newClass] }]);
 
      // Update cellClasses state
      // setCellHlClasses(prevCellClasses => {
      //   // Find the index of the cell in the existing state
      //   const cellIndex = prevCellClasses.findIndex(cell => cell.rowIndex === startCellRowIndex && cell.colIndex === startCellColIndex);

      //   if (cellIndex !== -1) {
      //     // Cell exists, update its classes array if the new class is not already included
      //     const cell = prevCellClasses[cellIndex];
      //     const updatedClasses = cell.classes.includes(newClass) ? cell.classes : [...cell.classes, newClass];
      //     // Create a new array with the updated cell
      //     return [
      //       ...prevCellClasses.slice(0, cellIndex),
      //       { ...cell, classes: updatedClasses },
      //       ...prevCellClasses.slice(cellIndex + 1)
      //     ];
      //   } else {
      //     // Cell doesn't exist, add a new cell entry
      //     return [...prevCellClasses, { rowIndex: startCellRowIndex, colIndex: startCellColIndex, classes: [newClass] }];
      //   }
      // });
      if (rowIndex === startCellRowIndex) {
        setHoveredCell({ rowIndex, colIndex });
      } else {
        setHoveredCell(null);
      }
     

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
    setHoveredCell,

    handleCellHover,
  };
};

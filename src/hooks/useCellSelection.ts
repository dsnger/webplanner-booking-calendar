import { useState, useCallback } from 'react';
import { CellCoordinates } from "../types";

export const useCellSelection = () => {
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(null);
  const [secondSelectedCell, setSecondSelectedCell] = useState<CellCoordinates | null>(null);
  const [cellClasses, setCellClasses] = useState<{ rowIndex: number; colIndex: number; classes: string[] }[]>([]);

  const handleCellSelection = useCallback((rowIndex: number, colIndex: number, areBlockedDaysBetween: boolean) => {
   
      //zweite Auswahl, aber andere Zeile
      if (selectedCell && secondSelectedCell || rowIndex !== selectedCell?.rowIndex) {
        setSelectedCell({ rowIndex, colIndex });
        setSecondSelectedCell(null);
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        console.log('start new')
  
        //gleiche Zeile, anderer Tag
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex) && areBlockedDaysBetween === false) {
        setSecondSelectedCell({ rowIndex, colIndex });
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
        console.log('second')
  
        //gleiche Zeile, gleicher Tag
      } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) && areBlockedDaysBetween === false) {
        //same day twice click
        setSecondSelectedCell({ rowIndex, colIndex });
        console.log('first twice')
  
      } else if ((selectedCell === null && secondSelectedCell === null) || secondSelectedCell !== null) {
        setSelectedCell({ rowIndex, colIndex });
        //avoid double first in different rows
        setCellClasses([{ rowIndex, colIndex, classes: ['is-selected'] }]);
        setSecondSelectedCell(null);
  
        console.log('first')
      }
  
      // setHoveredCell(null);
    
  }, [selectedCell, secondSelectedCell,cellClasses]); 
  

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


  return {
    selectedCell,
    secondSelectedCell,
    cellClasses,
    handleCellSelection,
  };
};

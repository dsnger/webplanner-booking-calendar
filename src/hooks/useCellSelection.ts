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
        // setHighlightedRange(selectedCell.rowIndex, selectedCell.colIndex, colIndex);
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
    
  }, [selectedCell,secondSelectedCell]); 

  return {
    selectedCell,
    secondSelectedCell,
    cellClasses,
    handleCellSelection,
  };
};


  
// const handleCellSelection = useCallback((rowIndex: number, colIndex: number, areBlockedDaysBetween: boolean) => {
//   // Start by updating the selectedCell state
//   setSelectedCell((currentSelectedCell) => {
//     if (!currentSelectedCell || (secondSelectedCell && rowIndex === currentSelectedCell.rowIndex)) {
//       // Case: No cell selected yet or second cell already selected in the same row
//       console.log('first and second');
//       return { rowIndex, colIndex };
//     } else if (currentSelectedCell && rowIndex === currentSelectedCell.rowIndex && colIndex !== currentSelectedCell.colIndex && !areBlockedDaysBetween) {
//       // Case: Same row, different day, and no blocked days in between
//       console.log('second');
//       return currentSelectedCell; // Keep the first selected cell
//     } else if (currentSelectedCell && rowIndex === currentSelectedCell.rowIndex && colIndex === currentSelectedCell.colIndex && !areBlockedDaysBetween) {
//       // Case: Same row, same day clicked twice, and no blocked days in between
//       console.log('first twice');
//       return currentSelectedCell; // Keep the selected cell as is
//     } else {
//       // Case: No selection or second selection in a different row
//       console.log('first');
//       return { rowIndex, colIndex };
//     }
//   });

//   // Then, update the secondSelectedCell state based on the new selectedCell state
//   setSecondSelectedCell((currentSecondSelectedCell) => {
//     if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex !== selectedCell.colIndex) && !areBlockedDaysBetween) {
//       return { rowIndex, colIndex };
//     } else if (selectedCell && (rowIndex === selectedCell.rowIndex) && (colIndex === selectedCell.colIndex) && !areBlockedDaysBetween) {
//       return { rowIndex, colIndex }; // Same day clicked twice
//     } else {
//       return null; // Reset or keep second selection as null in other cases
//     }
//   });

//   // Lastly, update cellClasses conditionally
//   setCellClasses((currentCellClasses) => {
//     if (selectedCell && (rowIndex === selectedCell.rowIndex) && !areBlockedDaysBetween) {
//       // For same row selections, update classes; reset in other cases
//       const updatedCellClasses = currentCellClasses.filter(c => c.rowIndex !== rowIndex); // Remove current row's classes
//       if (colIndex !== selectedCell.colIndex) {
//         updatedCellClasses.push({ rowIndex, colIndex, classes: ['is-selected'] }); // Add new selection
//       }
//       return updatedCellClasses;
//     } else {
//       return []; // Reset cell classes in other cases
//     }
//   });

// }, [selectedCell, secondSelectedCell]);


//   return {
//     selectedCell,
//     secondSelectedCell,
//     cellClasses,
//     handleCellSelection,
//   };
// };

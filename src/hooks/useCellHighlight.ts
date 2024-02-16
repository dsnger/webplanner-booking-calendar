// import { useState, useCallback } from 'react';
// import { CellCoordinates } from "../types";

// export const useCellHighlighting = () => {
//   const [cellClasses, setCellClasses] = useState<Array<{ rowIndex: number; colIndex: number; classes: string[] }>>([]);
//   const [hoveredCell, setHoveredCell] = useState<CellCoordinates | null>(null);

//   const setHighlightedRange = useCallback((startRowIndex: number, startColIndex: number, endColIndex: number) => {
//     // Implementation of your existing setHighlightedRange logic
//   }, []); // Add dependencies if any

//   const handleCellHover = useCallback((rowIndex: number, colIndex: number, isAvailable: boolean) => {
//     // Implementation of your existing handleCellHover logic
//   }, []); // Add dependencies if any

//   return {
//     cellClasses,
//     hoveredCell,
//     setHighlightedRange,
//     handleCellHover,
//   };
// };

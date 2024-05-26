import { useState, useCallback, useEffect, RefObject, useRef } from 'react';
import { CellCoordinates, DayStatus } from '../types';
import { formatDate } from '../utils/dateUtils';
import { useBookingObjects } from '../hooks/useBookingObjects';
import { endOfDay, isBefore } from 'date-fns';

export const useCellSelection = (
  bookingCalendarWrapperRef: RefObject<HTMLDivElement>,
  daysWithStatus: DayStatus[][]
) => {
  const [selectedDayStart, setSelectedDayStart] = useState<Date | null>(null);
  const [selectedDayEnd, setSelectedDayEnd] = useState<Date | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | null>(
    null
  );
  const [secondSelectedCell, setSecondSelectedCell] =
    useState<CellCoordinates | null>(null);
  const [cellClasses, setCellClasses] = useState<
    { rowIndex: number; cellIndex: number; classes: string[] }[]
  >([]);
  // const [hoveredCell, setHoveredCell] = useState<CellCoordinates | null>(null);

  const { bookingObjects } = useBookingObjects();

  // Use useRef to keep a reference to the opened window
  const openedWindowRef = useRef<Window | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        bookingCalendarWrapperRef.current &&
        !bookingCalendarWrapperRef.current.contains(event.target as Node)
      ) {
        setSelectedCell(null);
        setSecondSelectedCell(null);
        setSelectedDayStart(null);
        setSelectedDayEnd(null);
        setCellClasses([]);
        // setHoveredCell(null);
      }
    };

    // Attach the mousedown listener to the whole document
    document.addEventListener('mousedown', handleOutsideClick);

    // Cleanup function to remove both event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleCellSelection = useCallback(
    (clickedDate: Date, rowIndex: number, cellIndex: number) => {
      if (!isSelectable(clickedDate, rowIndex, cellIndex)) {
        return false;
      }

      const clickedDateString = formatDate(clickedDate);

      //selection done or click in a different row
      if (
        (selectedCell && secondSelectedCell) ||
        rowIndex !== selectedCell?.rowIndex
      ) {
        //if first selection is departure return null
        if (
          (isDepartureDay(rowIndex, cellIndex) &&
            hasArrivalDays(rowIndex, cellIndex)) ||
          (hasDepartureDays(rowIndex, cellIndex) &&
            !isArrivalDay(rowIndex, cellIndex))
        )
          return null;

        setSelectedCell({ rowIndex, cellIndex });
        setSecondSelectedCell(null);
        setCellClasses([
          { rowIndex, cellIndex, classes: ['is-selected', 'is-start'] },
        ]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        console.log('start new ' + clickedDateString);

        //Second selection of range: same row, other col
      } else if (
        selectedCell &&
        rowIndex === selectedCell.rowIndex &&
        cellIndex !== selectedCell.cellIndex
      ) {
        if (
          areUnavailableDaysInRange(
            selectedCell.cellIndex,
            cellIndex,
            rowIndex
          ) === true
        ) {
          //if first selection is departure return null
          if (
            (isDepartureDay(rowIndex, cellIndex) &&
              hasArrivalDays(rowIndex, cellIndex)) ||
            (hasDepartureDays(rowIndex, cellIndex) &&
              !isArrivalDay(rowIndex, cellIndex)) ||
            (hasArrivalDays(rowIndex, cellIndex) &&
              !isArrivalDay(rowIndex, cellIndex))
          )
            return null;

          setSelectedCell({ rowIndex, cellIndex });
          setSecondSelectedCell(null);
          setCellClasses([
            { rowIndex, cellIndex, classes: ['is-selected', 'is-start'] },
          ]);
          setSelectedDayStart(clickedDate);
          setSelectedDayEnd(null);
        } else {
          //if second selection is arrival
          if (
            (isArrivalDay(rowIndex, cellIndex) &&
              hasDepartureDays(rowIndex, cellIndex)) ||
            (hasDepartureDays(rowIndex, cellIndex) &&
              !isDepartureDay(rowIndex, cellIndex)) ||
            (hasDepartureDays(rowIndex, cellIndex) &&
              !isDepartureDay(rowIndex, cellIndex))
          )
            return null;

          if (selectedDayStart != null && clickedDate > selectedDayStart) {
            setSecondSelectedCell({ rowIndex, cellIndex });
            setCellClasses([
              { rowIndex, cellIndex, classes: ['is-selected', 'is-end'] },
            ]);
            setSelectedDayEnd(clickedDate);
            setHighlightedRange(
              selectedCell.rowIndex,
              selectedCell.cellIndex,
              cellIndex
            );
          }

          //console.log('second ' + clickedDateString)

          //reverse selection
          if (selectedDayStart != null && clickedDate < selectedDayStart) {
            if (
              (isDepartureDay(rowIndex, cellIndex) &&
                hasArrivalDays(rowIndex, cellIndex)) ||
              (hasDepartureDays(rowIndex, cellIndex) &&
                !isArrivalDay(rowIndex, cellIndex)) ||
              (hasArrivalDays(rowIndex, cellIndex) &&
                !isArrivalDay(rowIndex, cellIndex))
            )
              return null;

            setSecondSelectedCell({ rowIndex, cellIndex });
            // setCellClasses([{ rowIndex, cellIndex, classes: ['is-selected', 'is-start'] }]);
            setHighlightedRange(
              selectedCell.rowIndex,
              selectedCell.cellIndex,
              cellIndex
            );
            setSelectedDayEnd(selectedDayStart);
            setSelectedDayStart(clickedDate);
            sendDateSelection(rowIndex, clickedDate, selectedDayStart);
          } else {
            sendDateSelection(rowIndex, selectedDayStart, clickedDate);
          }
        }

        //gleiche Zeile, gleicher Tag
      } else if (
        selectedCell &&
        rowIndex === selectedCell.rowIndex &&
        cellIndex === selectedCell.cellIndex
      ) {
        if (
          (isArrivalDay(rowIndex, cellIndex) &&
            hasDepartureDays(rowIndex, cellIndex)) ||
          (hasDepartureDays(rowIndex, cellIndex) &&
            !isDepartureDay(rowIndex, cellIndex)) ||
          (hasDepartureDays(rowIndex, cellIndex) &&
            !isDepartureDay(rowIndex, cellIndex))
        )
          return null;

        //same day twice click
        setSecondSelectedCell({ rowIndex, cellIndex });
        setSelectedDayEnd(clickedDate);
        console.log('same twice ' + clickedDateString);
        sendDateSelection(rowIndex, selectedDayEnd, selectedDayStart);

        //first selection
      } else if (
        (selectedCell === null && secondSelectedCell === null) ||
        secondSelectedCell !== null
      ) {
        //if first selection is departure return null

        if (
          (isDepartureDay(rowIndex, cellIndex) &&
            hasArrivalDays(rowIndex, cellIndex)) ||
          (hasDepartureDays(rowIndex, cellIndex) &&
            !isArrivalDay(rowIndex, cellIndex)) ||
          (hasArrivalDays(rowIndex, cellIndex) &&
            !isArrivalDay(rowIndex, cellIndex))
        )
          return null;

        setCellClasses([
          { rowIndex, cellIndex, classes: ['is-selected', 'is-start'] },
        ]);
        setSelectedDayStart(clickedDate);
        setSelectedDayEnd(null);
        console.log('first ' + clickedDateString);
      }
    },
    [selectedCell, secondSelectedCell, cellClasses]
  );

  const sendDateSelection = async (
    objId: number,
    startDay: Date | null,
    endDay: Date | null = null
  ) => {
    //Format your dates as needed
    const startDateString = startDay ? formatDate(startDay) : null;
    const endDateString = endDay != null ? formatDate(endDay) : null;
    const baseUrl = bookingObjects[objId].bookingLink;
    const url = `${baseUrl}&startDate=${startDateString}&endDate=${endDateString}`;

    setTimeout(() => {
      if (openedWindowRef.current && !openedWindowRef.current.closed) {
        // Window is open, so reuse it by loading the new URL
        openedWindowRef.current.location.href = url;
      } else {
        // Window is not open, so open a new one and assign it to openedWindowRef.current
        openedWindowRef.current = window.open(
          url,
          '_blank',
          'width=785,height=720'
        );
      }
      // Optional: Bring the reused window to the front
      openedWindowRef.current?.focus();
    }, 1000);
  };

  const areUnavailableDaysInRange = (
    startcellIndex: number,
    endcellIndex: number,
    rowIndex: number
  ): boolean => {
    const cellIndexStart = Math.min(startcellIndex, endcellIndex);
    const cellIndexEnd = Math.max(startcellIndex, endcellIndex);

    for (
      let cellIndex = cellIndexStart;
      cellIndex <= cellIndexEnd;
      cellIndex++
    ) {
      // Check if the day exists and has a status of 'unavailable'
      const day = daysWithStatus[rowIndex]?.[cellIndex];
      if (day && day.isUnavailable === true) {
        console.log(
          'Unavailable day found at row:',
          rowIndex,
          'col:',
          cellIndex
        );
        return true; // Found an unavailable day, return true
      }
    }
    return false;
  };

  const isSelectable = (
    clickedDate: Date,
    rowIndex: number,
    cellIndex: number
  ) => {
    // console.log(rowIndex + ' ' + cellIndex)
    //if is in past
    if (isBefore(endOfDay(clickedDate), new Date())) return false;

    //is unavailable
    const day = daysWithStatus[rowIndex]?.[cellIndex];
    if (day && day.isUnavailable === true) {
      return false;
    }

    if (
      day &&
      day.isDisabled === true &&
      day.isArrival === false &&
      day.isDeparture === false
    ) {
      return false;
    }

    return true;
  };

  const isArrivalDay = (rowIndex: number, cellIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[cellIndex];
    if (day && day.isArrival === true) {
      return true;
    }
    return false;
  };

  const isDepartureDay = (rowIndex: number, cellIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[cellIndex];
    if (day && day.isDeparture === true) {
      return true;
    }
    return false;
  };

  const hasDepartureDays = (rowIndex: number, cellIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[cellIndex];
    if (day && day.hasDepartureDays === true) {
      return true;
    }
    return false;
  };

  const hasArrivalDays = (rowIndex: number, cellIndex: number) => {
    const day = daysWithStatus[rowIndex]?.[cellIndex];
    if (day && day.hasArrivalDays === true) {
      return true;
    }
    return false;
  };

  const setHighlightedRange = (
    rowIndex: number,
    cellIndex1: number,
    cellIndex2: number
  ): void => {
    const startcellIndex = Math.min(cellIndex1, cellIndex2);
    const endcellIndex = Math.max(cellIndex1, cellIndex2);

    console.log(startcellIndex + ' ' + endcellIndex);
    const newCellClasses = [...cellClasses];

    for (
      let cellIndex = startcellIndex;
      cellIndex <= endcellIndex;
      cellIndex++
    ) {
      const cellEntryIndex = newCellClasses.findIndex(
        (entry) => entry.rowIndex === rowIndex && entry.cellIndex === cellIndex
      );

      // Determine the classes based on the position
      let classesToAdd = ['is-selected'];
      if (cellIndex === startcellIndex) {
        classesToAdd.push('is-start');
      }
      if (cellIndex === endcellIndex) {
        classesToAdd.push('is-end');
      }

      if (cellEntryIndex !== -1) {
        // If the cell entry exists, update its classes
        newCellClasses[cellEntryIndex].classes = classesToAdd;
      } else {
        // If the cell entry doesn't exist, create a new one with the appropriate classes
        newCellClasses.push({ rowIndex, cellIndex, classes: classesToAdd });
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

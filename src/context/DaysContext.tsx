import React, { createContext, useMemo } from 'react';
import { generateCalendarDays, preCalculateDaysStatusFlags } from "../utils/dateUtils";
import { useSettings } from "@/hooks/useSettings";
import { DayStatus } from "@/types";

const DaysContext = createContext<{ days: Date[], daysWithStatus: DayStatus[][] }>({ days: [], daysWithStatus: [] });

export const DaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { calendarSettings } = useSettings();

  const days = useMemo(() => {
    if (!calendarSettings.length || !calendarSettings[0].calendarRange) return [];
    return generateCalendarDays(calendarSettings[0].calendarRange);
  }, [calendarSettings]);

  const daysWithStatus = useMemo(() => {
    if (!days.length) return [];
    return preCalculateDaysStatusFlags(calendarSettings[0]?.bookingObjects, days);
  }, [days, calendarSettings]);

  return (
    <DaysContext.Provider value={{ days, daysWithStatus }}>
      {children}
    </DaysContext.Provider>
  );
};

export default DaysContext;
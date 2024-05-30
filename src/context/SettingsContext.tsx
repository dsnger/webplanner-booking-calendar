import React, { createContext, useEffect, ReactNode } from 'react';
import { BookingCalendarSettings, CellSettings, ColorSettings } from '../types';
import { useFetchCalendarSettings } from '../hooks/useFetchCalendarSettings';
import { Progress } from '../components/ui/progress';

const updateCSSColorVars = (colorSettings: ColorSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--day-booked', colorSettings.booked);
  root.style.setProperty('--day-available', colorSettings.available);
  root.style.setProperty('--day-unavailable', colorSettings.notAvailable);
  root.style.setProperty('--day-onrequest', colorSettings.onRequest);
  root.style.setProperty('--day-closed', colorSettings.closed);
};

const updateCSSCellVars = (cellSettings: CellSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--cell-width', cellSettings.cellWidth ?? '32px');
  root.style.setProperty('--cell-height', cellSettings.cellHeight ?? '32px');
  root.style.setProperty('--cell-gap', cellSettings.cellGap ?? '1px');
};

interface SettingsContextProps {
  calendarSettings: BookingCalendarSettings[];
}

interface SettingsProviderProps {
  children: ReactNode;
  fewoOwnID: number;
  lang: string;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children, fewoOwnID, lang }) => {
  const { isLoading, progress, error, calendarSettings } = useFetchCalendarSettings(fewoOwnID, lang);

  useEffect(() => {
    if (calendarSettings.length > 0) {
      const settings = calendarSettings[0];

      if (settings.colorSettings) {
        updateCSSColorVars(settings.colorSettings);
      }

      if (settings.cellSettings) {
        updateCSSCellVars(settings.cellSettings);
      }

    }

  }, [calendarSettings]);


  if (isLoading) {
    return (
      <div className="w-[60%] mx-auto mt-10">
        <Progress value={progress} max={100} />
        <p className="mt-1">Kalenderdaten werden geladen...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(calendarSettings)
  if (!calendarSettings || !calendarSettings[0]?.calendarRange) {
    return <div>No calendar settings available.</div>;
  }


  return (
    <SettingsContext.Provider value={{ calendarSettings }}>
      {isLoading ? (
        <div className="w-[60%] mx-auto mt-10">
          <Progress value={progress} max={100} />
          <p className="mt-1">Kalenderdaten werden geladen...</p>
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        children
      )}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;

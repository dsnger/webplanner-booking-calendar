import React, { createContext, useEffect, ReactNode } from 'react';
import { BookingCalendarSettings, CSSVarsSettings } from '../types';
import { useFetchCalendarSettings } from '../hooks/useFetchCalendarSettings';
import { Progress } from '../components/ui/progress';

const updateGlobalStyles = (CSSVarsSettings: CSSVarsSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--day-booked', CSSVarsSettings.booked);
  root.style.setProperty('--day-available', CSSVarsSettings.available);
  root.style.setProperty('--day-unavailable', CSSVarsSettings.notAvailable);
  root.style.setProperty('--day-onrequest', CSSVarsSettings.onRequest);
  root.style.setProperty('--day-closed', CSSVarsSettings.closed);
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
      if (settings.cssVarsSettings) {
        updateGlobalStyles(settings.cssVarsSettings);
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

  if (!calendarSettings.length || !calendarSettings[0]?.calendarRange) {
    return <div>No calendar settings available.</div>;
  }


  return (
    <SettingsContext.Provider value={{ calendarSettings, }}>
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

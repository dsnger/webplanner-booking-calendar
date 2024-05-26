import { useState, useEffect } from 'react';
import { BookingCalendarSettings } from "../types";

export const useFetchCalendarSettings = (fewoOwnID: number, lang: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [calendarSettings, setCalendarSettings] = useState<BookingCalendarSettings[]>([]);

  useEffect(() => {
    let isComponentMounted = true;

    const init = async () => {
      if (!isComponentMounted) return;

      setIsLoading(true);
      setError(null);
      setProgress(30);

      try {
        const apiUrl = `https://www.webplanner.de/tools/belegungsplanerapi.php?fewoOwnID=${fewoOwnID}&lang=${lang}&anfrage=3`;
        const response = await fetch(apiUrl);
        setProgress(60);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!isComponentMounted) return;  // Ensure data is only set if component is still mounted
        setCalendarSettings(Array.isArray(data) ? data : [data]);
        setProgress(80);

        setProgress(100);
        setTimeout(() => {
          if (isComponentMounted) setIsLoading(false);
        }, 500);

      } catch (error) {
        console.error("Failed to fetch calendar settings:", error);
        if (isComponentMounted) {
          setError("Failed to fetch calendar settings");
          setIsLoading(false);
          setProgress(100);
        }
      }
    };

    init();

    return () => {
      isComponentMounted = false;
    };

  }, [fewoOwnID, lang]);

  return { isLoading, progress, error, calendarSettings };
};

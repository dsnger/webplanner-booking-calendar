import poweredByLogoUrl from '../img/powered-by-logo.png';

const Legend = () => {
  return (
    <div className="mt-2 flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between">
      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-y-2 gap-x-2 sm:gap-x-4">
        {/* Belegt */}
        <div className="flex items-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3  mr-1 sm:mr-2" style={{ backgroundColor: 'var(--day-booked)' }}></div>
          <span className="text-2xs sm:text-xs">Belegt</span>
        </div>

        {/* Frei */}
        <div className="flex items-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3  mr-1 sm:mr-2" style={{ backgroundColor: 'var(--day-available)' }}></div>
          <span className="text-2xs sm:text-xs">Frei</span>
        </div>

         {/* nicht verfügbar */}
         <div className="flex items-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3  mr-1 sm:mr-2" style={{ backgroundColor: 'var(--day-unavailable)' }}></div>
          <span className="text-2xs sm:text-xs">Nicht verfügbar</span>
        </div>

        {/* Auf Anfrage */}
        <div className="flex items-center" >
          <div className="w-2 h-2 sm:w-3 sm:h-3  mr-1 sm:mr-2" style={{ backgroundColor: 'var(--day-onrequest)' }}></div>
          <span className="text-2xs sm:text-xs">Auf Anfrage</span>
        </div>

        {/* Geschlossen */}
        <div className="flex items-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3  mr-1 sm:mr-2" style={{ backgroundColor: 'var(--day-closed)' }}></div>
          <span className="text-2xs sm:text-xs">Geschlossen</span>
        </div>

      </div>

      {/* Powered by */}
      <div className="flex items-center w-full sm:w-auto">
        <img src={poweredByLogoUrl} alt="Logo" width={160} height={15} className="object-contain mt-4 m-auto sm:mt-0 sm:mr-0 sm:ml-auto" />
      </div>
    </div>
  );
}



export default Legend;
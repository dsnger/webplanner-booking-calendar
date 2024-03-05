import poweredByLogoUrl from '../img/powered-by-logo.png';
import { ColorSettings } from "../types";

const Legend = ({ colorSettings }: { colorSettings: ColorSettings }) => {
  return (
    <div className="mt-4 flex flex-wrap sm:flex-nowrap items-center sm:justify-between">
      <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-2">
        {/* Belegt */}
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: colorSettings.booked }}></div>
          <span className="text-xs">Belegt</span>
        </div>

        {/* Frei */}
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: colorSettings.available }}></div>
          <span className="text-xs">Frei</span>
        </div>

         {/* nicht verfügbar */}
         <div className="flex items-center mr-4">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: colorSettings.notAvailable }}></div>
          <span className="text-xs">Nicht verfügbar</span>
        </div>

        {/* Auf Anfrage */}
        <div className="flex items-center mr-4" >
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: colorSettings.onRequest }}></div>
          <span className="text-xs">Auf Anfrage</span>
        </div>

        {/* Geschlossen */}
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: colorSettings.closed }}></div>
          <span className="text-xs">Geschlossen</span>
        </div>

      </div>

      {/* Powered by */}
      <img src={poweredByLogoUrl} alt="Logo" width={160} height={15} className="object-contain mt-4 m-auto" /> {/* Adjust size as needed */}
    </div>
  );
}



export default Legend;
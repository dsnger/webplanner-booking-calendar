import poweredByLogoUrl from '../img/powered-by-logo.png';

const Legend = () => {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="flex justify-center items-center">
        {/* Belegt */}
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-red-500 mr-2"></div>
          <span className="text-xs">Belegt</span>
        </div>

        {/* Frei */}
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-green-500 mr-2"></div>
          <span className="text-xs">Frei</span>
        </div>

        {/* Auf Anfrage */}
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
          <span className="text-xs">Auf Anfrage</span>
        </div>

        {/* Geschlossen */}
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 mr-2"></div>
          <span className="text-xs">Geschlossen</span>
        </div>

      </div>

      {/* Powered by */}
      <img src={poweredByLogoUrl} alt="Logo" width={160} height={15} className="object-contain" /> {/* Adjust size as needed */}
    </div>
  );
}

export default Legend;
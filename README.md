# Booking Calendar


Done:
-- sdasd


Todo:
- Calendar start option (today|date)
- Calendar end option (today|date)
- Calendar Date Range (years | year | months)
- Color Settings
- Legend Settings (Unavailable States)
- Submitting Selection
- Localization

##Vermutlich brauchts noch ein eigenes Objekt für freie Tage, bzw alle Tage:

- Tage können 'disabled' sein. Unabhängig von Ihrer Farbe sind diese dann blasser und nicht klickbar.
- Tage können als Anreisetag gekennzeichnet sein (eigene Klasse, die dann einfach nen Rahmen um den Tag setzt). Dies ist nur eine optische Kennzeichnung, die Funktion kommt über disabled.
- Neu, da ja jetzt das Nacheinander-Klicken von Anfangsdatum und Enddatum kommt: Tage können Anreisetag aber ggf kein Abreisetag sein. Da brauchts 2 Disabled-Zustände.
Und der Modus Nacheinander-Klicken oder Einmal-klick und direkt Formular öffnen muss im Script setzbar sein. Manche Kunden bieten Party-Locations oä an, die man nur einen Tag bucht.
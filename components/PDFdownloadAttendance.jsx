import React from 'react';
import { jsPDF } from "jspdf";

const PDFDownload = ({ players, attendance, columns, currentMonth, hatóságiÁr, kopásDíj, fogyasztás, teamName }) => {
    // Ékezetek eltávolítása a csapat nevéből
    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const generatePDF = async () => {
        // Lekérjük az adatokat az API-ból
        const response = await fetch(`/api/attendance?team=${teamName}&month=${currentMonth}`);
        const attendanceData = await response.json();

        // Ellenőrizd, hogy az adatokat sikeresen lekértük-e
        if (!attendanceData || !attendanceData.attendance) {
            console.error("Nincs elérhető jelenléti adat!");
            return;
        }

        // Fektetett tájolás beállítása
        const doc = new jsPDF('landscape');

        // Margók beállítása
        const margin = 20; // Margó minden irányban
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const tableStartY = margin + 30; // Táblázat kezdete
        let yPosition = tableStartY;

        // Hónap nevének meghatározása
        const months = [
            "Január", "Február", "Március", "Április", "Május", "Június",
            "Július", "Augusztus", "Szeptember", "Október", "November", "December"
        ];
        const monthName = months[currentMonth];

        // Csapat neve ékezet nélkül
        const teamNameWithoutAccents = removeAccents(teamName);

        // Csapat neve a dokumentum tetején
        doc.setFontSize(16);
        doc.text(`${teamNameWithoutAccents} csapat dokumentuma ${monthName} hónapra!`, margin, margin);

        // Hatósági ár, kopás költség és fogyasztás egy sorban
        doc.setFontSize(10);
        const text = `Hatósági ár: ${hatóságiÁr} Ft | Kopási költség: ${kopásDíj} Ft/km | Fogyasztás: ${fogyasztás} L/100km`;
        doc.text(text, margin, margin + 10);

        // Táblázat fejléce
        const drawHeader = () => {
            doc.setFontSize(10);
            doc.text("Név", margin, yPosition);
            doc.text("Megtett km", margin + 50, yPosition);
            doc.text("Vonat", margin + 70, yPosition);
            doc.text("Autó", margin + 110, yPosition);
            doc.text("Nem jelent meg", margin + 150, yPosition);
            doc.text("Megjelent (egyéb mód)", margin + 190, yPosition);
            doc.text("Fizetett összeg", margin + 230, yPosition);
            yPosition += 10; 
        };

        // Fejléc első oldalon
        drawHeader();

        // Játékosok adatainak megjelenítése
        Object.keys(attendanceData.attendance).forEach((playerKey) => {
            const player = players.find(p => `${p.last_name}-${p.first_name}` === playerKey);
            if (!player) return;  // Ha nincs játékos, akkor lépünk a következőre

            // Ellenőrizzük, hogy ne lépjük túl a maximális oldalt
            if (yPosition > pageHeight - margin) {
                doc.addPage('landscape'); // Új oldal hozzáadása
                yPosition = margin; // Reset Y pozíció
                doc.setFontSize(16);
                doc.text(`${teamNameWithoutAccents} csapat dokumentuma ${monthName} hónapra!`, margin, yPosition);
                doc.setFontSize(10);
                doc.text(text, margin, yPosition + 10);
                yPosition += 30; // Fejléc után tér
                drawHeader(); // Fejléc újrarajzolása
            }

            // Játékos adatainak kiírása
            doc.setFontSize(10);
            doc.text(`${player.last_name} ${player.first_name}`, margin, yPosition);
            const megtettKm = attendanceData.attendance[playerKey]?.["megtett_km"] || 0;

            // Vonatos, autós, nem jelent meg alkalmak száma
            const vonatosAlkalom = Object.keys(attendanceData.attendance[playerKey])
                .filter(date => attendanceData.attendance[playerKey][date] === "vonat").length;

            const autosAlkalom = Object.keys(attendanceData.attendance[playerKey])
                .filter(date => attendanceData.attendance[playerKey][date] === "auto").length;

            const nemJelentMeg = Object.keys(attendanceData.attendance[playerKey])
                .filter(date => attendanceData.attendance[playerKey][date] === "nem_jelent_meg").length;

            const nemJarTamogatas = Object.keys(attendanceData.attendance[playerKey])
                .filter(date => attendanceData.attendance[playerKey][date] === "nem_jar_tamogatas").length;

            // Fizetendő összeg számítása
            const afizetendo = (megtettKm / 100 * fogyasztás * hatóságiÁr) + (megtettKm * kopásDíj);
            const vfizetendo = (megtettKm * 15)
            const totalFizetendo = (afizetendo * autosAlkalom + vfizetendo*vonatosAlkalom).toFixed(2);

            // Ellenőrizzük, hogy a fizetendő nem NaN
            const validFizetendo = isNaN(totalFizetendo) ? "0 Ft" : `${totalFizetendo} Ft`;

            // Megjelenítés a táblázatban
            doc.text(`${megtettKm}`, margin + 50, yPosition);
            doc.text(`${vonatosAlkalom}`, margin + 70, yPosition);
            doc.text(`${autosAlkalom}`, margin + 110, yPosition);
            doc.text(`${nemJelentMeg}`, margin + 150, yPosition);
            doc.text(`${nemJarTamogatas}`, margin + 190, yPosition);
            doc.text(validFizetendo, margin + 230, yPosition);

            yPosition += 10; // Következő sor
        });

        // PDF mentése dinamikus névvel
        const fileName = `${teamNameWithoutAccents}_${monthName}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="text-center mt-4">
            <button onClick={generatePDF} className="hover:bg-accent rounded p-5">
                Kimutatás letöltése
            </button>
        </div>
    );
};

export default PDFDownload;

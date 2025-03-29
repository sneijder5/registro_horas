export function classifyAttendances(concepts, attendanceIn, attendanceOut) {
    console.log(concepts, attendanceIn, attendanceOut);
    return;
    // 🔹 Asegurar que attendanceIn y attendanceOut sean cadenas
    if (typeof attendanceIn !== "string" || typeof attendanceOut !== "string") {
        throw new Error("attendanceIn and attendanceOut must be strings.");
    }

    // 🔹 Reemplazar espacio por "T" y asegurarse de que tenga segundos
    attendanceIn = attendanceIn.replace(" ", "T") + ":00";
    attendanceOut = attendanceOut.replace(" ", "T") + ":00";

    // 🔹 Convertir a timestamp
    attendanceIn = new Date(attendanceIn).getTime();
    attendanceOut = new Date(attendanceOut).getTime();

    // 🔹 Verificar si las fechas son válidas
    if (isNaN(attendanceIn) || isNaN(attendanceOut)) {
        throw new Error("Invalid attendanceIn or attendanceOut value.");
    }

    if (attendanceOut <= attendanceIn) {
        attendanceOut += 24 * 60 * 60 * 1000; // Sumar un día en milisegundos
    }

    const orderedConcepts = ["HO", "HED", "HEN"];
    let result = Object.fromEntries(orderedConcepts.map(key => [key, 0]));

    let conceptMap = {};
    concepts.forEach(concept => {
        if (concept.start && concept.end) {
            conceptMap[concept.id] = concept;
        }
    });

    orderedConcepts.forEach(id => {
        if (!conceptMap[id]) return;

        let concept = conceptMap[id];

        let today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

        let conceptStart = new Date(`${today}T${concept.start}:00`).getTime();
        let conceptEnd = new Date(`${today}T${concept.end}:00`).getTime();

        if (isNaN(conceptStart) || isNaN(conceptEnd)) {
            console.error(`Invalid concept time: ${concept.start} - ${concept.end}`);
            return;
        }

        if (conceptEnd < conceptStart) {
            conceptEnd += 24 * 60 * 60 * 1000;
        }

        if (id === "HEN") {
            let henStart1 = conceptStart;
            let henEnd1 = new Date(`${today}T23:59:59`).getTime();

            let effectiveStart1 = Math.max(attendanceIn, henStart1);
            let effectiveEnd1 = Math.min(attendanceOut, henEnd1);

            if (effectiveStart1 < effectiveEnd1) {
                let hours = (effectiveEnd1 - effectiveStart1) / (60 * 60 * 1000);
                result[id] += Math.round(hours * 10) / 10;
            }

            let nextDay = new Date(today);
            nextDay.setDate(nextDay.getDate() + 1);
            let nextDayStr = nextDay.toISOString().split("T")[0];

            let henStart2 = new Date(`${nextDayStr}T00:00:00`).getTime();
            let henEnd2 = new Date(`${nextDayStr}T${concept.end}:00`).getTime();

            let effectiveStart2 = Math.max(attendanceIn, henStart2);
            let effectiveEnd2 = Math.min(attendanceOut, henEnd2);

            if (effectiveStart2 < effectiveEnd2) {
                let hours = (effectiveEnd2 - effectiveStart2) / (60 * 60 * 1000);
                result[id] += Math.round(hours * 10) / 10;
            }

            return;
        }

        let effectiveStart = Math.max(attendanceIn, conceptStart);
        let effectiveEnd = Math.min(attendanceOut, conceptEnd);

        if (effectiveStart < effectiveEnd) {
            let hours = (effectiveEnd - effectiveStart) / (60 * 60 * 1000);
            result[id] += Math.round(hours * 10) / 10;
        }
    });

    return JSON.stringify(
        Object.fromEntries(Object.entries(result).filter(([_, value]) => value > 0)),
        null,
        2
    );
}

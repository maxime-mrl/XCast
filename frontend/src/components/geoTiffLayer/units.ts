export const windUnits = {
    defaultUnit: "m/s",
    colorScale: {
        colors: [ "#ffffff", "#55ff55", "#ff5555" ],
        levels: [ 0, 5, 15 ]
    } as { colors: string[], levels: number[] },
    units: {
        "m/s": (base:number) => base,
        "km/h": (base:number) => base * 3.6,
        "mph": (base:number) => base * 3.6,
        "noeuds": (base:number) => base * 1.943844
    }
}
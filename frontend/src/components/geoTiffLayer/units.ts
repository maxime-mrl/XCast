export const windUnits = {
    defaultUnit: "m/s",
    colorScale: [
        [ "#ffffff", "#55ff55", "#ff5555" ],
        [ 0, 5, 15 ]
    ] as [ string[], number[] ],
    units: {
        "m/s": (base:number) => base,
        "km/h": (base:number) => base * 3.6,
        "mph": (base:number) => base * 3.6,
        "noeuds": (base:number) => base * 1.943844
    }
}
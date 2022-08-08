export function c(...classes: any[]): string {
    let output = "";
    for (const cls of classes) {
        if (cls) {
            if (typeof cls === "string") {
                output += " " + cls;
            } else if (typeof cls === "object") {
                output += " " + co(cls);
            }
        }
    }
    return output.trim();
}

export function co(classObject: { [key: string]: boolean }): string {
    return Object.keys(classObject)
        .filter((key) => classObject[key])
        .join(" ");
}

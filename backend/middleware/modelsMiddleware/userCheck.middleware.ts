import { User } from "@models/users.model";
import bcrypt from "bcryptjs";

const minPasslength = 6;

// Not really a middleware, will be called by controllers when needed
// check if user data are valid before saving them to db (if incrorect throw an error)
export const checkUser = async (user: Partial<User>) => {
    /* -------------------------- check password length ------------------------- */
    if (user.password) {
        if (user.password.length < minPasslength) throw { // done before the db validation because hash change length
            message: `Ton mot de passe devrait faire au moins ${minPasslength} charactères.`,
            status: 400
        };
        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    /* ------------------------- check username validity ------------------------ */
    // when updating every data aren't required so check before its existence
    if (user.username && !/^[-_a-z0-9]+$/i.test(user.username)) throw { // don't check length because arleady handled by model - this way is easier to change
        message: `Merci d'entrer un nom d'utilisateur valide (lettres, chiffres et -).`,
        status: 400
    };
    /* --------------------------- check mail validity -------------------------- */
    if (user.mail && !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(user.mail)) throw { // regex from ihateregex.io
        message: `Merci d'entrer un mail valide.`,
        status: 400
    };
    return user as Partial<User>;
};

export const checkAndParseSettings = (rawSettings: Partial<User["settings"]>) => {
    const settings = {...rawSettings}
    // const settings = JSON.parse(rawSettings);
    /* ------------------------ check forecast settings ------------------------ */
    if (settings.forecastSettings) {
        const { model, selected, level, maxHeight, position } = settings.forecastSettings;
        if (
            (model && typeof model !== "string") ||
            (selected && typeof selected !== "string") ||
            (level && typeof level !== "number") ||
            (maxHeight && typeof maxHeight !== "number") ||
            (position && typeof position !== "object")
        ) throw {
            message: "données invalides.",
            status: 400
        };
    }
    /* --------------------------- check units settings ------------------------- */
    if (settings.units) {
        settings.units = new Map(Object.entries(settings.units));
        settings.units.forEach((value:{ selected:string }) => {
            if (value && typeof value.selected !== "string") throw {
                message: "données invalides.",
                status: 400
            };
        });
    }
    return settings as Partial<User["settings"]>;
}

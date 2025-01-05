import { User } from "@models/users.model";
import { Query } from "mongoose";
import bcrypt from "bcryptjs";

const minPasslength = 6;


// dosen't work as is
// don't know why before in js I was just using this but this dosen't seems to work here
export default async (next:() => void, options: User) => {
    console.log(options);
    const user = (options && "_update" in options ? options._update : this) as Partial<User>; // get the user infos to check them (when updating it will be this._update else this)
    const that = this as any as Query<User,User> // don't think this is how it should be used but hey typescript is happy
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
    if (user.username && !/^[-a-z0-9]+$/i.test(user.username)) throw { // don't check length because arleady handled by model - this way is easier to change
        message: `Merci d'entrer un nom d'utilisateur valide (lettres, chiffres et -).`,
        status: 400
    };
    /* --------------------------- check mail validity -------------------------- */
    if (user.mail && !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/.test(user.mail)) throw { // regex from ihateregex.io
        message: `Merci d'entrer un mail valide.`,
        status: 400
    };
    /* ----------------- everythings is good => save user to db ----------------- */
    next();
};

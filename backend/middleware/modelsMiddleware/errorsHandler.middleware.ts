export default (err: any, _doc: unknown, next: () => void) => {
  // detect and handle specific errors thrown by models
  // having some sort of model middleware is the best (and sometimes only) way to get some good looking error messages from the model
  if (!err) return next(); // if no error life is good
  // else we need to handle it
  if (err.code === 11000) {
    // unique key duplicate
    err = new Error(`Ce ${Object.keys(err.keyPattern)} est déjà utilisé!`);
    err.status = 200;
  }
  if (err.errors && err.errors[Object.keys(err.errors)[0]]) {
    const error = err.errors[Object.keys(err.errors)[0]];
    if (error.kind === "minlength") {
      // input too short
      err = new Error(
        `Ton ${error.path} ${error.value} est trop court! il doit faire au moins ${error.properties.minlength} charactères.`
      );
      err.status = 400;
    }
    if (error.kind === "maxlength") {
      // input too big
      err = new Error(
        `Your ${error.path} ${error.value} est trop long! il ne doit pas faire plus que ${error.properties.maxlength} charactères.`
      );
      err.status = 400;
    }
    if (error.kind === "string") {
      // invalid input format
      err = new Error(`Ton ${error.path} n'est pas valide.`);
      err.status = 400;
    }
    if (/objectid/i.test(error.kind)) {
      // invalid ObjectID
      err = new Error(`Identifiants invalide, ${error.value}.`);
      err.status = 400;
    }
  }
  // others errors thrown as is
  throw err;
};

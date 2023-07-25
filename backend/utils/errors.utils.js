// errors signup \\

exports.signUpErrors = (err) => {
  let errors = { lastname: "", firstname: "",email: "", password: "", };
  if (err.message.includes("lastname")) errors.lastname = "veuillez vérifié vos données ,si le probleme persiste contactez un administrateur socialnetwork";

  if (err.message.includes("firstname"))
    errors.firstname = "veuillez vérifié vos données ,si le probleme persiste contactez un administrateur socialnetwork ";

  if (err.message.includes("email")) errors.email = "veuillez vérifié vos données ,si le probleme persiste contactez un administrateur socialnetwork";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractéres au minimum";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("bagde"))
    errors.badge = "veuillez vérifié vos données ,si le probleme persiste contactez un administrateur socialnetwork ";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "veuillez vérifié vos données ,si le probleme persiste contactez un administrateur socialnetwork";

  return errors;
};


// errors signin \\


exports.signInErrors = (err) => { 
  let errors =   "accée refusé, vérifié votre mail ou mot de passe, si le probleme persiste contactez un administrateur socialnetwork ";


  return errors;
};

// errors multer \\

exports.multerErrors = (err) => {
  let errors = { maxsize: "", format: "" };

  if (err.message.includes("large")) errors.maxsize = "l'image est trop grande";

  if (err.message.includes("format"))
    errors.format = "il n'y a que les formats .png, .jpg and .jpeg autorisé";

  return errors;
};

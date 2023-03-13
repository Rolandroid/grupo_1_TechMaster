const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      // Si el usuario está autenticado, continuar con la siguiente función del middleware
      return next();
    }
  
    // Si el usuario no está autenticado, redireccionarlo a la página de inicio de sesión o mostrar un mensaje de error
    res.redirect('/login');
  };
  
  module.exports = isAuthenticated;
  
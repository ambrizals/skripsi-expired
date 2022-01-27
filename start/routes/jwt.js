const Route = use("Route");
const Env = use("Env");

// JWT Routes
Route.group(function () {
  Route.post("/", "AuthController.generate")
    .as("jwt.generate")
    .validator("Auth/Generate");
  Route.get("/", "AuthController.check").as("jwt.check");
  Route.put('update', 'AuthController.updateProfile').as('jwt.update').middleware('jwt');
  Route.put('password', 'AuthController.changePassword').as('jwt.changePassword').middleware('jwt');
  Route.post('forgot', 'AuthController.forgotPassword').as('jwt.forgotPassword');
  Route.get('current', 'AuthController.getProfile').as('jwt.getProfile').middleware('jwt');
}).prefix("api/auth");

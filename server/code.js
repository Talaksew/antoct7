

// const corsOptions = {
//   origin: "*", // Allow all origins
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));






// // Middleware to check authentication
// const isAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// };

//const hasRole = (role) => (req, res, next) => {
  //if (req.isAuthenticated() && req.user.role === role) {
  //  return next();
 // }
 // res.status(403).send('Access denied');
//};
app.get('/',isAuthenticated, (req, res) => {
    res.render('login',{title: "Home"});
    });
  
  // Protected route example
  //app.get('/protected', isAuthenticated, (req, res) => {
    //res.send('This is a protected route.');
  //});
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // Ganti dengan kunci rahasia yang kuat

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token){
    console.log(token)
    return res.redirect('/login');
    
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    
    if (err){
      console.log(err)
      return res.redirect('/login');
    } 
    req.user = user;
    next();
  });
};

module.exports = {authenticateToken};

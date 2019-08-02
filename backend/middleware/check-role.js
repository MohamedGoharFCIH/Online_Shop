const jwt = require("jsonwebtoken");

exports.checkAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    if(decodedToken.role == 0){
        res.status(401).json({ message: "permission denided!" });
    }
    else{
        req.userData = { email: decodedToken.email, userId: decodedToken.id, role: decodedToken.role };
        next();
    }
    
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};


exports.checkUser = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      if(decodedToken.role == 1){
          res.status(401).json({ message: "permission denided!" });
      }
      else{
          req.userData = { email: decodedToken.email, userId: decodedToken.id, role: decodedToken.role };
          next();
      }
      
    } catch (error) {
      res.status(401).json({ message: "You are not authenticated!" });
    }
  };
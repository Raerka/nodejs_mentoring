import jwt from 'jsonwebtoken';

/**
 * @description
 * Middleware for checking token in request.
 *
 * @param {Request} req
 * @param {http.ServerResponse} res
 * @param {Function} next
 */
export const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'secretKey', (err) => {
      if (err) {
        res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        next();
      }
    });
  } else {
    res.status(403). send({success: false, message: 'No token provided'});
  }
};

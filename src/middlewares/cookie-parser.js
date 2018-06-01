/**
 * @description
 * Middleware for cookie parsing in request.
 * Parse Cookie header and populate `req.parsedCookies`
 * with an object keyed and value by the cookie data.
 *
 * @param {Request} req
 * @param {http.ServerResponse} res
 * @param {Function} next
 */
export const cookieParser = (req, res, next) => {
  if (!req.headers.cookie) {
    req.parsedCookies = {};
    return next();
  }
  const cookies = req.headers.cookie.split('; ');
  const cookiesObj = Object.create(null);
  for (let cookie of cookies) {
    let temp = cookie.split('=');
    cookiesObj[temp[0]] = temp[1];
  }
  req.parsedCookies = cookiesObj;
  next();
};

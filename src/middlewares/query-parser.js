/**
 * @description
 * Create middleware for query parsing.
 * a. Parsed query should be added to request stream object as parsedQuery field.
 *
 * @param req
 * @param res
 * @param next
 */


/**
 * @description
 * Middleware for query parsing in request.
 * Parse query string and populate `req.parsedQuery`
 * with an object keyed and value by the query data.
 *
 * @param {Request} req
 * @param {http.ServerResponse} res
 * @param {Function} next
 */
export const queryParser = (req, res, next) => {
  const queryParams = req.url.split('?')[1];
  if (!queryParams) {
    req.parsedQuery = 'Have no any queryParams, sorry';
    return next();
  }
  const queryParamsObj = Object.create(null);
  const params = queryParams.split('&');
  for (let param of params) {
    let temp = param.split('=');
    queryParamsObj[temp[0]] = temp[1];
  }
  req.parsedQuery = queryParamsObj;
  next();
};

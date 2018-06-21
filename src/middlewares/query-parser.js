import url from 'url';

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
  req.parsedQuery = url.parse(req.url, true).query;
  next();
};

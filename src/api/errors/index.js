import ApiError from './ApiError';

/*
* Make sure to add new Error classes to swagger file!
* See definitions/Error.
*/

export class MissingResource extends ApiError {}
export class UnknownError extends ApiError {}

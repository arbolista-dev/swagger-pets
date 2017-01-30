import _ from 'lodash';

export default class ApiError {

  constructor(message, data) {
    this.message = message;
    this.data = data;
  }

  get type() {
    return _.snakeCase(this.constructor.name);
  }

  get json() {
    return {
      type: this.type,
      message: this.message,
      data: this.data
    };
  }

}

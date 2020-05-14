'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response, session }) {
      if (error.name === 'TooManyRequests') { // Too Many Attempts
          session.flash({message: 'Too Many Requests. Please, slow down!', type: 'danger'});
          await session.commit();
          response.redirect('back');
          return;
      }
      if (error.name === 'InvalidTokenException') {
          session.flash({ message: 'A problem occurred! May be your token is invalid or expired!', type:'danger' });
          await session.commit();
          response.redirect('/');
          return;
      }

      return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler

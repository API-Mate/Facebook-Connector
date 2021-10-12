'use strict'

var FB = require('fb');

module.exports = async (event, context) => {
  //async function run() {
  try {
    let req = event.body;

    //let req = JSON.parse(event.body);
    let result = await Send(req)
    let statuscode = 200;
    if (result.status != "success") {
      statuscode = 500;
      result.message = JSON.stringify(result.message);
    }
    console.log(result);

    return context
      .status(statuscode)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed(result)
  } catch (err) {
    console.log(err);
    return context
      .status(500)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed({ status: 'atcerror', message: err.toString() })
  }
}
async function Send(req) {
  return new Promise(resolve => {
    FB.setAccessToken(req.credential.access_token);
    FB.api((req.credential.username + '/feed'), 'post', { message: req.message }, function (res) {
      if (!res || res.error)
        resolve({ status: 'serror', message: (!res ? 'error occurred' : JSON.stringify(res.error)) });
      else
        resolve({ status: 'success', message: 'You successfully published this : ' + req.message + ' | Post Id: ' + res.id });
    });
  });
}
const path = require('path');
const fs = require('fs');
const Server = require('hapi').Server;
const Joi = require('joi');
const tmp = require('tmp');
const Elm = require('node-elm-compiler');

const server = new Server();
server.connection({ port: process.env.PORT || 1337, routes: { cors: true } });

const removeRuntime = (source) => {
    var re = /\n(var _user\$project\$Main[\s\S]*)\nvar Elm =/;
    var matches = source.match(re);
    return (matches !== null) ? matches[1] : "error: user code not found";
};

server.route({
  path: '/compile',
  method: 'POST',
  config: {
    validate: {
      payload: {
        source: Joi.string().regex(/^module Main/).required(),
        runtime: Joi.bool().required(),
      },
    },
  },
  handler(request, reply) {
    tmp.dir(function (error, tmpPath, cleanup) {
      if (error) reply(error);
      const elmPath = path.join(tmpPath, 'Main.elm');
      fs.writeFile(elmPath, request.payload.source, (error) => {
        if (error) reply(error);
        Elm
          .compileToString(elmPath, { yes: true })
          .then((source) => {
            if (request.payload.runtime) {
              reply(source);
            } else {
              reply(removeRuntime(source.toString()));
            }
          })
          .catch((error) => {
            reply(error);
          })
          .then(() => cleanup());
      });
    });
  },
});

server.start(() => {
  console.log('started');
});

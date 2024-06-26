const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/notes(.*)/, methods: ['GET', 'OPTIONS', 'POST', 'DELETE'] },
            { url: /\/api\/v1\/projects(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/tasks(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/users(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authJwt;

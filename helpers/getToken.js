const getToken = (req) => {
    const { authorization } = req.headers;
    const token = authorization.substring(7);

    return token;
}

module.exports = getToken;

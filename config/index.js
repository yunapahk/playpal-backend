// const jwt = require('jsonwebtoken');

// module.exports = {
//     authCheck: async function (req, res, next) {
//         if(req.cookies.token) {
//             const payload = jwt.verify(req.cookies.token, process.env.SECRET);
//             req.payload = payload;
//             next();
//         } else {
//             res.status(400).json({ error: "You are not authorized" });
//         }
//     }
// };

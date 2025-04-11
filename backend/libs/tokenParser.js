const mongoose = require("mongoose");
const Session = require("../models/session");
const User = require("../models/user");
module.exports = function () {
    return function (req, res, next) {
        if (
            req.method == "OPTIONS" || req.url.indexOf("/public/") > -1 || (req.url.indexOf("/api/auth") > -1 && req.url.indexOf("/api/auth/signout") < 0)) {
            next();
        } else {
            if (!req.headers["x-access-token"]) {
                return res.status(400).json({ message: "Token is not available" });
            } else {
                var accessToken = req.headers["x-access-token"];

                Session.findOne({
                    token: accessToken,
                    isDeleted: false
                }).select("token user expiresAt")
                    .populate([
                        {
                            path: "user",
                            select: "type name isActive",
                        }
                    ]).exec().then(function (token) {
                        if (!token) {
                            return res.status(400).json({ message: "Token is invalid" });
                        } else {
                            var now = new Date();
                            var sevenDays = 7 * 24 * 3600 * 1000;

                            if (token && token.user) {
                                if (token.expiresAt.getTime() > now.getTime()) {
                                    Session.findByIdAndUpdate(token.id, {
                                        $set: {
                                            expiresAt: new Date(now.getTime() + sevenDays),
                                            lastActive: now
                                        }
                                    }).exec().then(function (err) {
                                        if (err) {
                                            err.status = 500;
                                            next();
                                        } else {
                                            req.user = token.user;
                                            next();
                                        }
                                    });
                                } else {
                                    //when token is expiry
                                    Session.findByIdAndUpdate(token.id, {
                                        $set: {
                                            isDeleted: true
                                        }
                                    }).exec().then(() => {
                                        User.findByIdAndUpdate(token.user, {
                                            $set: {
                                                isLogin: false
                                            }
                                        }).exec().then(() => {
                                            return res.status(300).json({ res });
                                        });
                                    });
                                }
                            } else {
                                return res.status(400).json({ message: "Token is expired" });
                            }
                        }
                    });
            }
        }
    };
};

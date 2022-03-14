"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.NitricAdapter = exports.defaultUrls = void 0;
var utils_1 = __importStar(require("./utils"));
exports.defaultUrls = {
    users: "/apis/auth/users",
    accounts: "/apis/auth/accounts",
    sessions: "/apis/auth/sessions",
    verificationTokens: "/apis/auth/verification_tokens"
};
function NitricAdapter(options) {
    var _this = this;
    var _a = (options || {}).urls, urls = _a === void 0 ? exports.defaultUrls : _a;
    return {
        createUser: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])(urls.users, {
                                body: JSON.stringify((0, utils_1.stripUndefined)(data)),
                                method: "POST"
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "?id=").concat(id))];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, null];
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByEmail: function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "?email=").concat(email))];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, null];
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        getUserByAccount: function (_a) {
            var provider = _a.provider, providerAccountId = _a.providerAccountId;
            return __awaiter(this, void 0, void 0, function () {
                var account, user;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.accounts, "?provider=").concat(provider, "&provider_account_id=").concat(providerAccountId))];
                        case 1:
                            account = _b.sent();
                            if (!account)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "?id=").concat(account.userId))];
                        case 2:
                            user = _b.sent();
                            if (!user)
                                return [2 /*return*/, null];
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        updateUser: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "/").concat(data.id), {
                                method: "PATCH",
                                body: JSON.stringify((0, utils_1.stripUndefined)(data))
                            })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, user];
                    }
                });
            });
        },
        deleteUser: function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "/").concat(id), { method: "DELETE" })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        linkAccount: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, utils_1["default"])(urls.accounts, {
                            body: JSON.stringify((0, utils_1.stripUndefined)(data)),
                            method: "POST"
                        })];
                    case 1:
                        account = _a.sent();
                        return [2 /*return*/, account];
                }
            });
        }); },
        unlinkAccount: function (provider_providerAccountId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])(urls.accounts, {
                                method: "DELETE",
                                body: JSON.stringify(provider_providerAccountId)
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        getSessionAndUser: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                var session, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.sessions, "/").concat(sessionToken))];
                        case 1:
                            session = _a.sent();
                            if (!session)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.users, "?id=").concat(session.userId))];
                        case 2:
                            user = _a.sent();
                            if (!user)
                                return [2 /*return*/, null];
                            return [2 /*return*/, {
                                    user: user,
                                    session: __assign(__assign({}, session), { expires: new Date(session.expires) })
                                }];
                    }
                });
            });
        },
        createSession: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])(urls.sessions, {
                                method: "POST",
                                body: JSON.stringify((0, utils_1.stripUndefined)(data))
                            })];
                        case 1:
                            session = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, session), { expires: new Date(session.expires) })];
                    }
                });
            });
        },
        updateSession: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedSession;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.sessions, "/").concat(data.id), {
                                method: "PATCH",
                                body: JSON.stringify((0, utils_1.stripUndefined)(data))
                            })];
                        case 1:
                            updatedSession = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, updatedSession), { expires: new Date(updatedSession.expires) })];
                    }
                });
            });
        },
        deleteSession: function (sessionToken) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.sessions, "/").concat(sessionToken), {
                                method: "DELETE"
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        createVerificationToken: function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])(urls.verificationTokens, {
                                method: "POST",
                                body: JSON.stringify((0, utils_1.stripUndefined)(data))
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        useVerificationToken: function (_a) {
            var identifier = _a.identifier, token = _a.token;
            return __awaiter(this, void 0, void 0, function () {
                var verificationToken;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, utils_1["default"])("".concat(urls.verificationTokens, "?identifier=").concat(identifier, "&token=").concat(token))];
                        case 1:
                            verificationToken = _b.sent();
                            if (!verificationToken)
                                return [2 /*return*/, null];
                            return [2 /*return*/, verificationToken];
                    }
                });
            });
        }
    };
}
exports.NitricAdapter = NitricAdapter;

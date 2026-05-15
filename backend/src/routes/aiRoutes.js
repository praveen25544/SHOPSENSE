"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
// No auth required — guest users can also get recommendations
router.post('/recommendations', aiController_1.getRecommendations);
router.post('/search', aiController_1.aiSearch);
exports.default = router;

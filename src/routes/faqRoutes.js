const express = require("express");
const router = express.Router();
const FAQ = require("../models/FAQ");
const authMiddleware = require("../middleware/authMiddleware");

// GET all FAQs
router.get("/", async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new FAQ
router.post("/", authMiddleware, async (req, res) => {
    try {
        const faq = new FAQ(req.body);
        const savedFAQ = await faq.save();
        res.status(201).json(savedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update FAQ
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.json(updatedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE FAQ
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);

        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        res.json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
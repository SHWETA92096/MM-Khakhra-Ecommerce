const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");


// ==========================================
// CREATE CONTACT MESSAGE
// ==========================================

router.post("/", async (req, res) => {

    try {

        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            message: "Message sent successfully",
            contact
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// GET ALL CONTACT MESSAGES
// ADMIN
// ==========================================

router.get("/", async (req, res) => {

    try {

        const messages = await Contact.find()
            .sort({ createdAt: -1 });

        res.status(200).json(messages);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// UPDATE MESSAGE STATUS
// ==========================================

router.put("/:id/status", async (req, res) => {

    try {

        const { status } = req.body;

        const contact =
            await Contact.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            );

        if (!contact) {

            return res.status(404).json({
                message: "Message not found"
            });

        }

        res.status(200).json({
            message: "Status updated successfully",
            contact
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;
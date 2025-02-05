const express = require("express");
const { validationResult, checkSchema } = require("express-validator");
const utils = require("../utils");
const User = require("../models/user");
const router = express.Router();

router.put(
	"/",
	checkSchema({
		"*": {
			isString: {
				errorMessage: "field should be a string",
			},
		},
		firstName: {},
		lastName: {},
		email: {
			notEmpty: {
				errorMessage: "email should not be empty",
			},
			isEmail: {
				errorMessage: "email should be proper or valid value",
			},
		},
		address: {
			notEmpty: {
				errorMessage: "address should not be empty",
			},
		},
	}),
	(req, res, next) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.json(
				utils.createResponseObject("product create fail", result.array(), {})
			);
		}

		return User.findOneAndUpdate({ email: req.body.email }, req.body, {
			new: true,
		})
			.then((insertedDoc) => {
				res.status(201);
				return res.json(
					utils.createResponseObject(
						"user updated successfully",
						null,
						insertedDoc
					)
				);
			})
			.catch((error) => next(error));
	}
);

module.exports = router;

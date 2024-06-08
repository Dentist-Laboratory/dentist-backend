const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/api.error");

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    try {
      const document = new Model(req.body);
      await document.save();
      res.status(201).json({ message: "created successfully", document });
    } catch (error) {
      console.error("Error occurred while creating:", error);
      res.status(500).json({
        error: "Error occurred while creating",
        details: error.message,
      });
    }
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    try {
      const filter = { _id: req.params.id }; // Modify this filter based on your requirements
      const document = await Model.findOneAndDelete(filter);
      if (!document)
        return next(
          new ApiError(
            `The document for this id ${req.params.id} was not found`,
            404
          )
        );
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      return next(
        new ApiError(`Error occurred while deleting: ${error.message}`, 500)
      );
    }
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document)
      return next(
        new ApiError(
          `the Document  for this id ${req.params.id} not found `,
          404
        )
      );
    res
      .status(201)
      .json({ message: "Document  updated successfully", document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document)
      return next(
        new ApiError(
          `the Document  for this id ${req.params.id} not found `,
          404
        )
      );
    res.status(200).json(document);
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.find().select(
      "title image description price body answer link"
    );
    if (!document) next(new ApiError(`Error Happend `, 404));
    if (document.length === 0) {
      res.status(200).json({ message: "There Is NO Data To Retrive" });
    } else {
      res.status(200).json({
        message: "Documents retrieved successfully",
        length: document.length,
        document,
      });
    }
  });

exports.deleteAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.deleteMany({}, { new: true });
    if (!document) return next(new ApiError(`Error Happend `, 404));
    res.status(200).json({ message: " deleted successfully", document });
  });

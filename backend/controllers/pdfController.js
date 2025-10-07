const Recipe = require('../models/Recipe');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.exportRecipeToPdf = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'username');

    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    const doc = new PDFDocument();
    const filename = `recipe-${recipe._id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);

    doc.fontSize(25).text(recipe.title, { align: 'center' });
    doc.fontSize(12).text(`By: ${recipe.user.username}`, { align: 'center' });
    doc.moveDown();

    if (recipe.image) {
      // You might need to fetch the image from the URL and embed it
      // For simplicity, we'll just add the URL for now.
      doc.fontSize(10).text(`Image: ${recipe.image}`);
      doc.moveDown();
    }

    doc.fontSize(15).text('Description:');
    doc.fontSize(12).text(recipe.description);
    doc.moveDown();

    doc.fontSize(15).text('Category:');
    doc.fontSize(12).text(recipe.category);
    doc.moveDown();

    doc.fontSize(15).text('Ingredients:');
    recipe.ingredients.forEach((ingredient) => {
      doc.fontSize(12).text(`- ${ingredient}`);
    });
    doc.moveDown();

    doc.fontSize(15).text('Steps:');
    recipe.steps.forEach((step, index) => {
      doc.fontSize(12).text(`${index + 1}. ${step}`);
    });
    doc.moveDown();

    doc.fontSize(10).text(`Average Rating: ${recipe.averageRating.toFixed(1)} (${recipe.numReviews} reviews)`);
    doc.end();

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

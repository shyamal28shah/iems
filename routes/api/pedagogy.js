const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Pedagogy = require('../../models/Pedagogy');
const Subject = require('../../models/Subject');

// @router POST api/pedagogy
// @desc Add new pedagogy
// @access public
router.post(
  '/',
  [
    check('subject', 'Id of subject is required').notEmpty(),
    check('components', 'Components are required').isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { subject, components } = req.body;
    try {
      let subjectOb = await Subject.findById(subject);
      if (!subjectOb) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid subject. No subject found' }] });
      }

      let pedagogy = await Pedagogy.findOne({ subject: subject });
      if (pedagogy) {
        pedagogy.components = components;
      } else {
        pedagogy = new Pedagogy({
          subject,
          components,
        });
      }
      await pedagogy.save();
      res.json({ msg: 'Pedagogy added.', pedagogy });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error.');
    }
  }
);

// @router GET api/pedagogy/?id&?subjectId
// @desc Get pedagogy
// @access public

router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      if (req.query.id != 24) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Id. No record found' }] });
      }
      let pedagogy = await Pedagogy.findById(req.query.id);
      if (!pedagogy) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Record with this id does not exist.' }] });
      }
      return res.json(pedagogy);
    } else if (req.query.subjectId) {
      let pedagogy = await Pedagogy.findOne({
        subject: req.query.subjectId,
      });
      if (!pedagogy)
        return res.status(400).json({
          errors: [{ msg: 'Pedagogy for this subject does not exists.' }],
        });
      return res.json(pedagogy);
    } else if (Object.keys(req.query).length == 0) {
      let pedagogies = await Pedagogy.find({}).populate('subject');
      return res.json(pedagogies);
    } else {
      res.status(400).send('Bad request');
    }
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server Error.');
  }
});

module.exports = router;

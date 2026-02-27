const express = require("express");
const multer = require("multer");
const Target = require("../models/Target");
const compileTargets = require("../utils/compileTargets");

const router = express.Router();

/* =========================
   MULTER STORAGE
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image"))
      cb(null, "uploads/images");
    else
      cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   SAFE INDEX REORDER FUNCTION
========================= */
async function reorderIndexes() {

  // 🔥 ALWAYS sort by createdAt ASC
  const targets = await Target.find().sort({ createdAt: 1 });

  for (let i = 0; i < targets.length; i++) {
    targets[i].index = i;
    await targets[i].save();
  }

  console.log("Indexes reordered correctly");
}

/* =========================
   UPLOAD ROUTE
========================= */
router.post(
  "/upload",
  upload.fields([
    { name: "image" },
    { name: "video" },
  ]),
  async (req, res) => {
    try {
      const target = new Target({
        name: req.body.name,
        imagePath: req.files.image[0].path,
        videoPath: req.files.video[0].path,
        index: 0,
        companyName: req.body.companyName,  // 🔥 NEW
        companyUrl: req.body.companyUrl,// temporary
        createdAt: new Date(),
      });

      await target.save();

      // 🔥 Reorder indexes safely
      await reorderIndexes();

      // 🔥 Recompile targets
      await compileTargets();

      res.json({ message: "Uploaded + reordered + compiled", target });

    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
);

/* =========================
   DELETE ROUTE (IMPORTANT)
========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Target.findByIdAndDelete(req.params.id);

    // 🔥 Reorder after delete
    await reorderIndexes();

    // 🔥 Recompile again
    await compileTargets();

    res.json({ message: "Deleted + reordered + compiled" });

  } catch (err) {
    res.status(500).json(err);
  }
});

/* =========================
   GET ALL TARGETS
========================= */
router.get("/", async (req, res) => {
  const targets = await Target.find().sort({ index: 1 });
  res.json(targets);
});

module.exports = router;
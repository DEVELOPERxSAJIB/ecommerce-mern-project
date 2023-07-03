const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
  try {

    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    res.json({ message: "user photo deleted" });

  } catch (error) {
    console.log(err, "can't delete user photo");
  }
};


module.exports = deleteImage
// get all users
const getAllUsers = (req, res) => {
  const users = [
    {
      id: 1,
      name: "Md SaJib Shikder",
      skill: "MERN Stack",
    },
    {
      id: 2,
      name: "RaJib Hasan",
      skill: "IOS Developer",
    },
    {
      id: 3,
      name: "Tanha Mohan",
      skill: "PHP Developer",
    },
  ];

  res.json(users);
};

// module exports
module.exports = { getAllUsers };

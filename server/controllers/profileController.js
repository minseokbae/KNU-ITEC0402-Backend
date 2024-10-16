const getProfile = (req, res) => {
    res.json({
      message: 'This is a protected profile route',
      user: req.user
    });
  };
  
  module.exports = { getProfile };
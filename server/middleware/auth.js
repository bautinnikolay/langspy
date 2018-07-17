let checkAuth = (req, res, next) => {
  if(req.session.suzie) {
    next()
  } else {
    res.status(403).send()
  }
}

module.exports = {checkAuth}

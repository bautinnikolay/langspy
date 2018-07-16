let checkAuth = (req, res, next) => {
  if(req.session.suize) {
    next()
  } else {
    res.status(403).send()
  }
}

module.exports = {checkAuth}

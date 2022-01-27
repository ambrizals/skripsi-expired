const Env = use('Env');

const create = (req, limit) => ({
  page: parseInt(req.page) || 1,
  limit: parseInt(limit) || parseInt(Env.get('PAGINATION')) || 100,
});

module.exports = { create };

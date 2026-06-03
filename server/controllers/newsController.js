const News = require('../models/News');
const { auditLog } = require('../middleware/auditLog');

const getNews = async (req, res, next) => {
  try {
    const { category, search, page, limit } = req.query;
    const result = await News.list({
      category,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createNews = async (req, res, next) => {
  try {
    const { title, content, category, image_url } = req.body;
    const article = await News.create({
      title,
      content,
      category,
      image_url,
      author_id: req.user.id
    });

    await auditLog({
      action: 'news_created',
      resource: 'news',
      resource_id: article.id,
      actor_id: req.user.id,
      ip: req.ip,
      metadata: { title }
    });

    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await News.remove(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    await auditLog({
      action: 'news_deleted',
      resource: 'news',
      resource_id: id,
      actor_id: req.user.id,
      ip: req.ip,
      metadata: { title: article.title }
    });

    res.json({ message: 'Article deleted successfully.', article });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNews, createNews, deleteNews };

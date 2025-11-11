//backend/index.js
const express = require('express')
const cors = require('cors')
const { createTodo, updateTodo, partialUpdateTodo } = require("./types")
const { todo } = require("./db");
const { tr } = require('zod/v4/locales');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.get('/health', (_req, res) => res.status(200).json({ ok: true}));


app.post("/todo", async (req, res) => {
    try {
    const parsed = createTodo.safeParse(req.body);
    if (!parsed.success) {
      return res.status(411).json({ error: parsed.error });
    }

    const doc = await todo.create({
      title: parsed.data.title,
      description: parsed.data.description ?? '',
      completed: false,
    });

    // Return the created document (frontend normalizes _id -> id)
    return res.status(201).json(doc);
  } catch (err) {
    console.error('POST /todo error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * GET /todos
 * Supports optional query params:
 *  - search: string (matches title/description)
 *  - status: 'all' | 'completed' | 'incomplete'
 *  - page: number (default 1)
 *  - pageSize: number (default 50, max 200)
 */
app.get("/todos", async (req, res) => {
    try {
    const {
      search = '',
      status = 'all',
      page = '1',
      pageSize = '50',
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const sizeNum = Math.min(Math.max(parseInt(pageSize, 10) || 50, 1), 200);

    const q = {};
    if (status === 'completed') q.completed = true;
    if (status === 'incomplete') q.completed = false;

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i');
      q.$or = [{ title: regex }, { description: regex }];
    }

    const cursor = todo
      .find(q)
      .sort({ createdAt: -1, _id: -1 })
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum);


    // const items = await cursor.exec();
    // const total = await todo.countDocuments(q);

    const [items, total] = await Promise.all([
      cursor.exec(),
      todo.countDocuments(q),
    ]);

    return res.status(200).json({
      items,
      total,
      page: pageNum,
      pageSize: sizeNum,
      hasMore: pageNum * sizeNum < total,
    });
  } catch (err) {
    console.error('GET /todos error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /todos/:id
 * Fetch a single todo by id.
 */
app.get("/todos/:id", async(req, res) => {
    try {
        const doc = await todo.findById(req.params.id);
        if(!doc) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.status(200).json(doc);
    } catch(err) {
        console.error('GET /todos/:id error:', err);
    return res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * PUT /completed
 * Legacy endpoint you already use.
 * UPGRADED: accepts { id, completed: boolean } to set either true or false.
 * Returns the updated document.
 */
app.put("/completed", async (req, res) => {
      try {
    const parsed = updateTodo.safeParse(req.body);
    if (!parsed.success) {
      return res.status(411).json({ error: parsed.error });
    }

    const { id, completed = true } = parsed.data;

    const updated = await todo.findByIdAndUpdate(
      id,
      { $set: { completed: !!completed } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Todo not found' });

    return res.json({ msg: 'Todo completion updated', todo: updated });
  } catch (err) {
    console.error('PUT /completed error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

});


/**
 * PATCH /todos/:id
 * Partial update (title, description, completed)
 * Frontend will use this for Edit + Toggle in the new flow.
 */
app.patch('/todos/:id', async (req, res) => {
    try {
    const parsed = partialUpdateTodo.safeParse({ id: req.params.id, ...req.body });
    if(!parsed.success) res.status(411).json({ error: parsed.error });

    const { id, ...dataToUpdate} = parsed.data;

    const updated = await todo.findByIdAndUpdate(
      req.params.id,
      { $set: dataToUpdate },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Todo not found' });

    return res.json(updated);

    } catch(err) {
        console.error('PATCH /todos/:id error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.delete('/todos/:id', async (req, res) => {
    try {
        const deleted = await todo.findByIdAndDelete(req.params.id);
        if(!deleted) {
            return res.status(404).json({ error: "Todo not found" });
        }
        return res.status(200).json({ msg: "Todo deleted" });
    } catch(err) {
        console.error('DELETE /todos/:id error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
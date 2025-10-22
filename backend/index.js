const express = require('express')
const cors = require('cors')
const { createTodo, updateTodo } = require("./types")
const { todo } = require("./db")

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.post("/todo", async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload)
    if(!parsedPayload.success) {
        return res.status(411).json({ error: parsedPayload.error })
    }

    await todo.create({
        title: createPayload.title,
        description: createPayload.description,
        completed: false
    })

    res.status(201).json({ message: "Todo created successfully" });
})

app.get("/todos", async (req, res) => {
    const todos = await todo.find();
    res.status(200).json(todos);
})

app.put("/completed", async (req, res) => {
    const updatedPayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatedPayload)
    if(!parsedPayload.success) {
        return res.status(411).json({ error: parsedPayload.error })
    }

   try {
        const updated = await todo.findByIdAndUpdate(
            updatedPayload.id,
            { $set: { completed: true } },
            { new: true } // return the updated document
        );

        if (!updated) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ msg: "Todo marked as completed", todo: updated });
    } catch (err) {
        console.error("DB update error:", err);
        res.status(500).json({ error: "Internal server error" });
    }

})

app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
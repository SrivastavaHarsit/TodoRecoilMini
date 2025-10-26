const zod = require("zod");

const createTodo = zod.object({
    title: zod.string().min(1),
    description: zod.string().optional()
})

const updateTodo = zod.object({
    id: zod.string()
})

const partialUpdateTodo = zod.object({
    id: zod.string(),
    title: zod.string().min(1).optional(),
    description: zod.string().optional(),
    completed: zod.boolean().optional(),
})

module.exports = {
    createTodo,
    updateTodo
}
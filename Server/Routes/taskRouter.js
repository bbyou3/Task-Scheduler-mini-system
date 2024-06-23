import express from 'express';
import con from "../utils/db.js";
const router = express.Router();


const markTaskCompleted = (taskId, callback) => {
    const sql = "UPDATE tasks SET status = 'completed' WHERE id = ?";
    con.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error("Error marking task as completed:", err);
            return callback(err, null);
        }
        return callback(null, result);
    });
};



router.put('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;

    markTaskCompleted(taskId, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to mark task as completed!" });
        }
        return res.status(200).json({ success: true, message: "Task marked as completed successfully!" });
    });
});

router.post('/addtask', (req, res) => {
    const { title, content, subject_code, instructor_name, due_date, status } = req.body;
  
    if (!title || !due_date) {
        return res.status(400).json({ success: false, message: "Title and due date are required." });
    }

    const sql = "INSERT INTO tasks (title, content, subject_code, instructor_name, due_date, status) VALUES (?, ?, ?, ?, ?, ?)";
    con.query(sql, [title, content, subject_code, instructor_name, due_date, status], (err, result) => {
        if (err) {
            console.error("Error adding task:", err);
            return res.status(500).json({ success: false, message: "An error occurred while adding the task." });
        }
        return res.status(201).json({ success: true, message: "Task added successfully." });
    });
});


router.get('/tasks', (req, res) => {
    const sql = "SELECT * FROM tasks";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ success: false, message: "An error occurred while fetching tasks." });
        }
        return res.status(200).json({ success: true, tasks: result });
    });
});

router.get('/completedTasks', (req, res) => {
    const sql = "SELECT * FROM tasks WHERE status = 'completed'";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching completed tasks:", err);
            return res.status(500).json({ success: false, message: "An error occurred while fetching completed tasks." });
        }
        return res.status(200).json({ success: true, tasks: result });
    });
});

const markTaskArchived = (taskId, callback) => {
    const sql = "UPDATE tasks SET archived = true WHERE id = ?";
    con.query(sql, [taskId], (err, result) => {
        if (err) {
            console.error("Error marking task as archived:", err);
            return callback(err, null);
        }
        if (result.affectedRows === 0) {
            return callback({ message: "Task not found" }, null);
        }
        return callback(null, result);
    });
};


router.put('/tasks/:taskId/archive', (req, res) => {
    const taskId = req.params.taskId;

    markTaskArchived(taskId, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to archive task!" });
        }
        return res.status(200).json({ success: true, message: "Task archived successfully!" });
    });
});

router.get('/archiveTasks', (req, res) => {
    const sql = "SELECT * FROM tasks WHERE archived = true";

    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching archived tasks:", err);
            return res.status(500).json({ success: false, message: "An error occurred while fetching archived tasks." });
        }
        return res.status(200).json({ success: true, tasks: result });
    });
});


router.put('/tasks/:taskId/move-to-trash', (req, res) => {
    const taskId = req.params.taskId;

    
    const sqlSelect = 'SELECT * FROM tasks WHERE id = ?';
    con.query(sqlSelect, [taskId], (err, result) => {
        if (err) {
            console.error("Error fetching task:", err);
            return res.status(500).json({ success: false, message: "Failed to move task to trash." });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        const task = result[0];

       
        const sqlInsert = 'INSERT INTO trash (id, title, content, subject_code, instructor_name, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        con.query(sqlInsert, [task.id, task.title, task.content, task.subject_code, task.instructor_name, task.due_date, task.status], (err, result) => {
            if (err) {
                console.error("Error moving task to trash:", err);
                return res.status(500).json({ success: false, message: "Failed to move task to trash." });
            }

          
            const sqlDelete = 'DELETE FROM tasks WHERE id = ?';
            con.query(sqlDelete, [taskId], (err, result) => {
                if (err) {
                    console.error("Error deleting task:", err);
                    return res.status(500).json({ success: false, message: "Failed to move task to trash." });
                }

                return res.status(200).json({ success: true, message: "Task moved to trash successfully." });
            });
        });
    });
});

router.get('/trashedTasks', (req, res) => {
    const query = 'SELECT * FROM trash';
    con.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching trashed tasks:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch trashed tasks." });
        }

        res.status(200).json({ success: true, tasks: result });
    });
});
router.put('/tasks/:taskId/restore', (req, res) => {
    const taskId = req.params.taskId;

    
    const sqlSelect = 'SELECT * FROM trash WHERE id = ?';
    con.query(sqlSelect, [taskId], (err, result) => {
        if (err) {
            console.error("Error fetching task from trash:", err);
            return res.status(500).json({ success: false, message: "Failed to restore task" });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Task not found in trash" });
        }

        const task = result[0];

      
        const sqlInsert = 'INSERT INTO tasks (id, title, content, subject_code, instructor_name, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        con.query(sqlInsert, [task.id, task.title, task.content, task.subject_code, task.instructor_name, task.due_date, task.status], (err, result) => {
            if (err) {
                console.error("Error restoring task:", err);
                return res.status(500).json({ success: false, message: "Failed to restore task" });
            }

        
            const sqlDelete = 'DELETE FROM trash WHERE id = ?';
            con.query(sqlDelete, [taskId], (err, result) => {
                if (err) {
                    console.error("Error deleting task from trash:", err);
                    return res.status(500).json({ success: false, message: "Failed to restore task" });
                }

                const sqlUpdate = 'UPDATE tasks SET restored = 1 WHERE id = ?';
                con.query(sqlUpdate, [taskId], (err, result) => {
                    if (err) {
                        console.error("Error restoring task:", err);
                        return res.status(500).json({ success: false, message: "Failed to restore task" });
                    }
                    res.status(200).json({ success: true, message: "Task restored successfully" });
                });
            });
        });
    });
});



router.get('/restoredTasks', (req, res) => {
   
    const query = 'SELECT * FROM tasks WHERE restored = 1';

    // Execute the query
    con.query(query, (err, result) => {
        if (err) {
            console.error("Error fetching restored tasks:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch restored tasks." });
        }

        
        res.status(200).json({ success: true, tasks: result });
    });
});


router.delete('/trash/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    
    // Validate taskId
    if (!taskId || isNaN(taskId)) {
        return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const sqlDelete = 'DELETE FROM trash WHERE id = ?';
    con.query(sqlDelete, [taskId], (err, result) => {
        if (err) {
            console.error("Error deleting task from trash:", err);
            return res.status(500).json({ success: false, message: "Failed to delete task from trash" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Task not found in trash" });
        }
        return res.status(200).json({ success: true, message: "Task deleted from trash successfully" });
    });
});

router.put('/tasks/:taskId/edit', (req, res) => {
    const taskId = req.params.taskId;
    const { title, content, subject_code, instructor_name, due_date } = req.body;

   
    if (!title || !due_date) {
        return res.status(400).json({ success: false, message: "Title and due date are required." });
    }

   
    const sql = "UPDATE tasks SET title = ?, content = ?, subject_code = ?, instructor_name = ?, due_date = ? WHERE id = ?";
    con.query(sql, [title, content, subject_code, instructor_name, due_date, taskId], (err, result) => {
        if (err) {
            console.error("Error updating task details:", err);
            return res.status(500).json({ success: false, message: "An error occurred while updating task details." });
        }
        return res.status(200).json({ success: true, message: "Task details updated successfully." });
    });
});

router.put('/tasks/:taskId/edit', (req, res) => {
    const taskId = req.params.taskId;
    const { title, content, subject_code, instructor_name, due_date } = req.body;


    if (!title || !due_date) {
        return res.status(400).json({ success: false, message: "Title and due date are required." });
    }

   
    const sql = "UPDATE tasks SET title = ?, content = ?, subject_code = ?, instructor_name = ?, due_date = ? WHERE id = ?";
    con.query(sql, [title, content, subject_code, instructor_name, due_date, taskId], (err, result) => {
        if (err) {
            console.error("Error updating task details:", err);
            return res.status(500).json({ success: false, message: "An error occurred while updating task details." });
        }
        return res.status(200).json({ success: true, message: "Task details updated successfully." });
    });
});

export { router as taskRouter };

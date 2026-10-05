import { useEffect, useMemo, useState } from "react";
import { Check, Circle, ListTodo, Plus, Search, Trash2 } from "lucide-react";

const starterTasks = [
  { id: 1, title: "Learn React fundamentals", completed: true },
  { id: 2, title: "Build a reusable component", completed: false },
  { id: 3, title: "Practice JavaScript", completed: false }
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("taskflow-tasks");
      return saved ? JSON.parse(saved) : starterTasks;
    } catch {
      return starterTasks;
    }
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const title = input.trim();
    if (!title) return;

    setTasks((current) => [
      { id: Date.now(), title, completed: false },
      ...current
    ]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks((current) => current.filter((task) => !task.completed));
  };

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);

      const matchesSearch = task.title
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, query]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <main className="app-shell">
      <section className="card">
        <header className="hero">
          <div className="brand">
            <div className="brand-icon"><ListTodo size={24} /></div>
            <div>
              <p className="eyebrow">REACT PROJECT</p>
              <h1>TaskFlow</h1>
            </div>
          </div>
          <p className="subtitle">A simple task manager built with React.</p>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
          />
          <button type="submit"><Plus size={19} /> Add task</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="Task filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <label className="search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search tasks"
            />
          </label>
        </div>

        <div className="stats">
          <span><strong>{activeCount}</strong> active</span>
          <span><strong>{completedCount}</strong> completed</span>
          <span><strong>{tasks.length}</strong> total</span>
        </div>

        <section className="task-list" aria-live="polite">
          {visibleTasks.length === 0 ? (
            <div className="empty">
              <ListTodo size={32} />
              <h2>No tasks found</h2>
              <p>Try adding a task or changing your filter.</p>
            </div>
          ) : (
            visibleTasks.map((task) => (
              <article className={task.completed ? "task completed" : "task"} key={task.id}>
                <button
                  className="check-button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Mark task active" : "Mark task complete"}
                  type="button"
                >
                  {task.completed ? <Check size={18} /> : <Circle size={19} />}
                </button>

                <span className="task-title">{task.title}</span>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                  type="button"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))
          )}
        </section>

        <footer>
          <span>Tasks are saved automatically in your browser.</span>
          <button onClick={clearCompleted} type="button">Clear completed</button>
        </footer>
      </section>
    </main>
  );
}

export default App;
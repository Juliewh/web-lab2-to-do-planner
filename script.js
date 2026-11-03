"use strict";

const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "./styles.css";
document.head.append(stylesheet);

function createElement(tagName, { className, textContent, attributes = {}, children = [] } = {}) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) {
      continue;
    }

    element.setAttribute(name, value === true ? "" : String(value));
  }

  element.append(...children);
  return element;
}

const title = document.createElement("title");
title.textContent = "Мой список задач";
document.head.append(title);

const pageHeader = createElement("header", {
  className: "site-header",
  children: [
    createElement("div", {
      className: "page-shell site-header__inner",
      children: [
        createElement("p", {
          className: "app-eyebrow",
          textContent: "ПЛАНИРУЙТЕ СПОКОЙНО"
        }),
        createElement("h1", {
          className: "app-title",
          textContent: "Мой список задач"
        }),
        createElement("p", {
          className: "app-description",
          textContent: "Соберите важные дела в одном месте и двигайтесь к цели шаг за шагом."
        })
      ]
    })
  ]
});

const taskTitleInput = createElement("input", {
  attributes: {
    id: "task-title",
    name: "title",
    type: "text",
    placeholder: "Например, подготовить отчёт",
    maxlength: 120,
    autocomplete: "off",
    required: true
  }
});

const taskDateInput = createElement("input", {
  attributes: {
    id: "task-date",
    name: "date",
    type: "date",
    required: true
  }
});

const taskForm = createElement("form", {
  className: "task-form",
  attributes: { id: "task-form" },
  children: [
    createElement("label", {
      className: "form-field",
      children: [
        createElement("span", {
          className: "form-field__label",
          textContent: "Название задачи"
        }),
        taskTitleInput
      ]
    }),
    createElement("label", {
      className: "form-field",
      children: [
        createElement("span", {
          className: "form-field__label",
          textContent: "Срок выполнения"
        }),
        taskDateInput
      ]
    }),
    createElement("button", {
      className: "button button--primary",
      textContent: "Добавить задачу",
      attributes: { type: "submit" }
    })
  ]
});

const composer = createElement("section", {
  className: "panel composer",
  attributes: { "aria-labelledby": "composer-title" },
  children: [
    createElement("div", {
      className: "section-heading",
      children: [
        createElement("p", {
          className: "section-heading__eyebrow",
          textContent: "НОВОЕ ДЕЛО"
        }),
        createElement("h2", {
          className: "section-heading__title",
          textContent: "Добавить задачу",
          attributes: { id: "composer-title" }
        })
      ]
    }),
    taskForm
  ]
});

const searchInput = createElement("input", {
  attributes: {
    id: "task-search",
    name: "search",
    type: "search",
    placeholder: "Найти задачу",
    autocomplete: "off",
    "aria-label": "Поиск задач по названию"
  }
});

const statusFilter = createElement("select", {
  attributes: {
    id: "status-filter",
    name: "status",
    "aria-label": "Фильтр задач по статусу"
  },
  children: [
    createElement("option", { textContent: "Все задачи", attributes: { value: "all" } }),
    createElement("option", { textContent: "Активные", attributes: { value: "active" } }),
    createElement("option", { textContent: "Выполненные", attributes: { value: "completed" } })
  ]
});

const dateSort = createElement("select", {
  attributes: {
    id: "date-sort",
    name: "sort",
    "aria-label": "Сортировка задач по дате"
  },
  children: [
    createElement("option", { textContent: "Сначала ближайшие", attributes: { value: "ascending" } }),
    createElement("option", { textContent: "Сначала поздние", attributes: { value: "descending" } })
  ]
});

const taskList = createElement("ul", {
  className: "task-list",
  attributes: {
    id: "task-list",
    "aria-label": "Список задач"
  }
});

const taskBoard = createElement("section", {
  className: "panel task-board",
  attributes: { "aria-labelledby": "task-board-title" },
  children: [
    createElement("div", {
      className: "task-board__header",
      children: [
        createElement("div", {
          children: [
            createElement("p", {
              className: "section-heading__eyebrow",
              textContent: "ВАШ ПЛАН"
            }),
            createElement("h2", {
              className: "section-heading__title",
              textContent: "Список задач",
              attributes: { id: "task-board-title" }
            })
          ]
        }),
        createElement("span", {
          className: "task-count",
          textContent: "0 задач",
          attributes: { id: "task-count", "aria-live": "polite" }
        })
      ]
    }),
    createElement("div", {
      className: "task-toolbar",
      children: [
        createElement("label", {
          className: "visually-hidden",
          textContent: "Поиск задач",
          attributes: { for: "task-search" }
        }),
        searchInput,
        statusFilter,
        dateSort
      ]
    }),
    createElement("p", {
      className: "empty-state",
      textContent: "Пока задач нет. Добавьте первую задачу выше.",
      attributes: { id: "empty-state", "aria-live": "polite" }
    }),
    taskList
  ]
});

const main = createElement("main", {
  className: "page-shell page-main",
  children: [composer, taskBoard]
});

const app = createElement("div", {
  className: "app",
  children: [pageHeader, main]
});

document.body.append(app);

const STORAGE_KEY = "todo-planner-tasks";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(savedTasks)) {
      return [];
    }

    return savedTasks
      .filter((task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.date === "string"
      )
      .map((task) => ({
        id: task.id,
        title: task.title,
        date: task.date,
        completed: Boolean(task.completed)
      }));
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    console.warn("Не удалось сохранить задачи в localStorage.");
  }
}

let editingTaskId = null;
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");

function createTaskEditor(task) {
  const titleInput = createElement("input", {
    attributes: {
      type: "text",
      value: task.title,
      maxlength: 120,
      required: true,
      "aria-label": "Название задачи"
    }
  });

  const dateInput = createElement("input", {
    attributes: {
      type: "date",
      value: task.date,
      required: true,
      "aria-label": "Срок выполнения"
    }
  });

  const saveButton = createElement("button", {
    className: "task-editor__button task-editor__button--save",
    textContent: "Сохранить",
    attributes: { type: "submit" }
  });

  const cancelButton = createElement("button", {
    className: "task-editor__button task-editor__button--cancel",
    textContent: "Отмена",
    attributes: { type: "button" }
  });

  const editor = createElement("form", {
    className: "task-editor",
    children: [
      createElement("label", {
        className: "form-field",
        children: [
          createElement("span", {
            className: "form-field__label",
            textContent: "Название задачи"
          }),
          titleInput
        ]
      }),
      createElement("label", {
        className: "form-field",
        children: [
          createElement("span", {
            className: "form-field__label",
            textContent: "Срок выполнения"
          }),
          dateInput
        ]
      }),
      createElement("div", {
        className: "task-editor__actions",
        children: [saveButton, cancelButton]
      })
    ]
  });

  editor.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const date = dateInput.value;

    if (!title || !date) {
      return;
    }

    task.title = title;
    task.date = date;
    saveTasks();
    editingTaskId = null;
    renderTasks();
  });

  cancelButton.addEventListener("click", () => {
    editingTaskId = null;
    renderTasks();
  });

  return editor;
}

function renderTasks() {
  taskList.replaceChildren();

  for (const task of tasks) {
    if (editingTaskId === task.id) {
      taskList.append(
        createElement("li", {
          className: "task-item task-item--editing",
          children: [createTaskEditor(task)]
        })
      );

      continue;
    }

    const checkbox = createElement("input", {
      className: "task-item__checkbox",
      attributes: {
        type: "checkbox",
        checked: task.completed,
        "aria-label": task.completed
          ? `Вернуть в активные: ${task.title}`
          : `Отметить выполненной: ${task.title}`
      }
    });

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const editButton = createElement("button", {
      className: "task-item__edit",
      textContent: "Изменить",
      attributes: {
        type: "button",
        "aria-label": `Изменить задачу: ${task.title}`
      }
    });

    editButton.addEventListener("click", () => {
      editingTaskId = task.id;
      renderTasks();
    });

    const deleteButton = createElement("button", {
      className: "task-item__delete",
      textContent: "Удалить",
      attributes: {
        type: "button",
        "aria-label": `Удалить задачу: ${task.title}`
      }
    });

    deleteButton.addEventListener("click", () => {
      const taskIndex = tasks.findIndex((item) => item.id === task.id);

      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
      }
    });

    const taskDate = createElement("time", {
      className: "task-item__date",
      textContent: new Date(`${task.date}T00:00:00`).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      attributes: { datetime: task.date }
    });

    const taskItem = createElement("li", {
      className: task.completed
        ? "task-item task-item--completed"
        : "task-item",
      children: [
        createElement("div", {
          className: "task-item__main",
          children: [
            checkbox,
            createElement("span", {
              className: "task-item__title",
              textContent: task.title
            })
          ]
        }),
        createElement("div", {
          className: "task-item__actions",
          children: [taskDate, editButton, deleteButton]
        })
      ]
    });

    taskList.append(taskItem);
  }

  emptyState.hidden = tasks.length > 0;
  taskCount.textContent = `Задач: ${tasks.length}`;
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const date = taskDateInput.value;

  if (!title || !date) {
    return;
  }

  tasks.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    date,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskTitleInput.focus();
});

renderTasks();
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

module.exports = message => [
  {
    name: "uf-title",
    type: "text",
    label: "Title",
    value: message,
    element: {
      type: "plain_text_input",
      placeholder: {
        type: "plain_text",
        text: "Short, descriptive title"
      }
    }
  },
  {
    name: "uf-desc",
    type: "textarea",
    label: "Description",
    element: {
      type: "plain_text_input",
      multiline: true,
      placeholder: {
        type: "plain_text",
        text: "When ____, I want to ____, so I can ____"
      }
    }
  },
  {
    name: "uf-feed",
    type: "select",
    label: "Feed",
    options: [
      {
        label: "🐛Bugs",
        value: "bug"
      },
      {
        label: "✨Feature Requests",
        value: "feature"
      }
    ]
  }
];

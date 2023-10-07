module.exports = {
  rules: {
    "allow-text-in-custom-component": {
      create: function(context) {
        return {
          JSXElement: function(node) {
            if (node.openingElement.name.name === "Button") {
              const hasTextChild = node.children.some(
                (child) =>
                  child.type === "JSXText" && child.value.trim().length > 0,
              );

              if (!hasTextChild) {
                context.report({
                  node: node,
                  message: "Use a valid text child within YourCustomComponent.",
                });
              }
            }
          },
        };
      },
    },
  },
};

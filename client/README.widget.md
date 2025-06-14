# Beauty Advisor Chat Widget

This widget allows you to easily add the Beauty Advisor chatbot to any website. The widget appears as a chat bubble in the corner of your website that users can click to interact with the AI beauty advisor.

## Quick Start

Add the following script tags to your HTML file, just before the closing `</body>` tag:

```html
<!-- Required dependencies -->
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>

<!-- Beauty Advisor Widget -->
<script 
  src="https://your-cdn-url/beauty-advisor-widget.js"
  data-api-url="https://beauty-chatbot-ai-p1fp.onrender.com"
  data-primary-color="#FF69B4"
  data-position="bottom-right"
  data-welcome-message="Hello! 👋 I'm your beauty advisor. How can I help you today?"
  data-widget-title="Beauty Advisor"
  data-company-logo="https://your-company-logo.png">
</script>
```

## Configuration

You can customize the widget by adding the following data attributes to the script tag:

| Attribute | Description | Default |
|-----------|-------------|---------|
| data-api-url | The URL of your Beauty Advisor API | https://beauty-chatbot-ai-p1fp.onrender.com |
| data-primary-color | The main color of the widget | #FF69B4 |
| data-position | Widget position (bottom-right or bottom-left) | bottom-right |
| data-welcome-message | Initial message shown to users | Hello! 👋 I'm your beauty advisor. How can I help you today? |
| data-widget-title | Title shown in the chat header | Beauty Advisor |
| data-company-logo | URL of your company logo | - |

## Styling

The widget is designed to work with any website's styling. It uses a z-index of 999999 to ensure it appears above other elements, and its styles are scoped to avoid conflicts with your website's CSS.

## Browser Support

The widget supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To build the widget:

1. Install dependencies:
```bash
npm install
```

2. Build the widget:
```bash
npm run build:widget
```

The built widget will be available in the `dist` directory as `beauty-advisor-widget.js`.

## Support

For support or feature requests, please contact our team or open an issue in the repository. 
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yml'));

const swaggerOptions = {
  swaggerOptions: {
    url: '/dev/docs/openapi.yml'
  }
};

exports.serveOpenApiSpec = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/x-yaml',
    },
    body: YAML.stringify(swaggerDocument),
  };
};

exports.serveSwaggerUi = async (event) => {
  const setup = swaggerUi.setup(swaggerDocument, swaggerOptions);
  const html = swaggerUi.generateHTML(swaggerDocument, swaggerOptions);

  const swaggerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>API de Productos - Documentación</title>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.min.css" >
      <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/favicon-16x16.png" sizes="16x16" />
      <style>
        html
        {
          box-sizing: border-box;
          overflow: -moz-scrollbars-vertical;
          overflow-y: scroll;
        }
        *,
        *:before,
        *:after
        {
          box-sizing: inherit;
        }
        body
        {
          margin:0;
          background: #fafafa;
        }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.min.js"> </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-standalone-preset.min.js"> </script>
      <script>
        window.onload = function() {
          // Begin Swagger UI call
          const ui = SwaggerUIBundle({
            url: "${event.requestContext.path.replace('/docs-ui', '/docs')}", // Apunta a la ruta donde se sirve openapi.yml
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
          window.ui = ui;
        };
      </script>
    </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: swaggerHtml,
  };
};

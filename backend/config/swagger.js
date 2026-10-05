const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MediLens API",
      version: "1.0.0",
      description: "AI-Assisted Medical Report Understanding API — Technical Backend Documentation & Interactive Testing Interface"
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token to authorize protected API requests."
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "6aa6450a561dc9fcdf392d31" },
            userId: { type: "integer", example: 101 },
            username: { type: "string", example: "medilensuser" },
            email: { type: "string", example: "medilens.test@gmail.com" },
            phoneNumber: { type: "string", example: "9876543210" }
          }
        },
        Parameter: {
          type: "object",
          properties: {
            name: { type: "string", example: "Hemoglobin" },
            value: { type: "string", example: "11.4" },
            unit: { type: "string", example: "g/dL" },
            referenceRange: { type: "string", example: "12.0 - 16.0" },
            status: { type: "string", enum: ["Normal", "Above", "Below", "Unknown"], example: "Below" },
            explanation: { type: "string", example: "Hemoglobin level is slightly below standard baseline reference range. Educational observation only. Not intended as medical diagnosis or treatment advice." }
          }
        },
        Report: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6aa6450b561dc9fcdf392d34" },
            reportId: { type: "integer", example: 1 },
            user: { type: "string", example: "6aa6450a561dc9fcdf392d31" },
            reportName: { type: "string", example: "Blood Test Report" },
            fileName: { type: "string", example: "1789281546743-sample_lab_report.pdf" },
            reportDate: { type: "string", example: "2026-09-13" },
            parameters: {
              type: "array",
              items: { $ref: "#/components/schemas/Parameter" }
            },
            aiSummary: { type: "string", example: "PDF analysis identified parameter variations: Hemoglobin (Below). Educational observation only. Not intended as medical diagnosis or treatment advice." },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Error explanation message" }
          }
        }
      }
    }
  },
  failOnErrors: true,
  apis: ["./routes/*.js", "./server.js"]
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Serve raw OpenAPI JSON at /api-docs/swagger.json
  app.get("/api-docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(swaggerSpec);
  });

  // Serve Swagger UI at /api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;

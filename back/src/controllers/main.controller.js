const fs = require('fs');
const path = require('path');
const { User } = require('../models');

/**
 * GET /status
 * Endpoint para verificar que el servidor está corriendo
 */
const getStatus = (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Servidor corriendo correctamente',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    dbInfo: 'Conectado a PostgreSQL vía Sequelize',
  });
};

/**
 * GET /api/info
 * Información general de la API
 */
const getApiInfo = (req, res) => {
  res.json({
    version: '1.0.0',
    description: 'API RESTful para sistema de Blog (Integración Módulos 6, 7 y 8)',
    endpoints: [
      { path: '/api/auth/login', methods: ['POST'] },
      { path: '/api/users', methods: ['GET', 'POST'] },
      { path: '/api/users/:id', methods: ['GET', 'PUT', 'DELETE'] },
      { path: '/api/profile', methods: ['GET', 'PUT'] },
      { path: '/api/posts', methods: ['GET', 'POST'] },
      { path: '/api/posts/:id', methods: ['GET', 'PUT', 'DELETE'] },
      { path: '/api/categories', methods: ['GET', 'POST'] },
      { path: '/api/categories/:id', methods: ['GET', 'PUT', 'DELETE'] },
    ],
  });
};

module.exports = {
  getStatus,
  getApiInfo,
};

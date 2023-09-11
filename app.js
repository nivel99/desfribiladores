const express = require("express");
const jwt = require("jsonwebtoken");
const mysql = require('mysql');
const bodyParser = require("body-parser"); // Importar body-parser
const bcrypt = require('bcrypt'); // Importa bcrypt

const app = express();
app.use(bodyParser.json()); // Usar body-parser para analizar el cuerpo de la solicitud como JSON

//CONEXION A LA BASE DE DATOS /////////////////////////
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",//eternidad2680
  database: "desfrilibradores"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get("/api", (req, res) => {
    res.json({
        mensaje: "Nodejs and JWT"
    })
});

////////////////////USUARIO////////////////////////////////////////////////
///// LOGIN //////////////////////////
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Realiza una consulta a la base de datos para obtener el usuario
  connection.query(
    "SELECT id, username, email, password, resetPasswordToken, confirmationToken, confirmed, blocked, role FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err || results.length === 0) {
        res.sendStatus(403); // Usuario no autorizado
      } else {
        const hashedPassword = results[0].password;

        // Compara la contraseña proporcionada con la contraseña encriptada almacenada en la base de datos
        bcrypt.compare(password, hashedPassword, (compareErr, isMatch) => {
          if (compareErr || !isMatch) {
            res.sendStatus(403); // Contraseña incorrecta o error en la comparación
          } else {
            const user = {
              id: results[0].id,
              username: results[0].username,
              email: results[0].email, // Agregamos el campo email
              // Puedes agregar otros campos aquí si los necesitas
              role: results[0].role
            };

            jwt.sign({ user }, "secretkey", (jwtErr, token) => {
              if (jwtErr) {
                res.sendStatus(500); // Error en la generación del token
              } else {
                res.json({
                  token,
                  user // Incluimos el objeto del usuario en la respuesta
                });
              }
            });
          }
        });
      }
    }
  );
});

// Guardar usuario con contraseña encriptada y tokens aleatorios
app.post("/api/nuevo_usuario", (req, res) => {
  const { username, email, password, Telefono, FechaNacimiento } = req.body;
  
  // Genera tokens aleatorios de 20 caracteres
  const resetPasswordToken = generateRandomToken(20);
  const confirmationToken = generateRandomToken(20);

  // Encripta la contraseña antes de almacenarla en la base de datos
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.sendStatus(500); // Error en el servidor
    } else {
      // Realiza el INSERT INTO en la base de datos con la contraseña encriptada
      connection.query(
        "INSERT INTO usuarios (username, email, password, resetPasswordToken, confirmationToken, Telefono, FechaNacimiento) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [username, email, hashedPassword, resetPasswordToken, confirmationToken, Telefono, FechaNacimiento],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor
          } else {
            res.json({
              mensaje: "Usuario creado exitosamente",
              nuevoUsuarioId: result.insertId
            });
          }
        }
      );
    }
  });
});

// Función para generar tokens aleatorios
function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

////////////////////FIN USUARIO////////////////////////////////////////////////

// Authorization: Bearer <token> 
function verifyToken(req, res, next){
 const bearerHeader = req.headers['authorization'];
 if(typeof bearerHeader !== 'undefined'){
   const bearerToken = bearerHeader.split(" ")[1];
   req.token = bearerToken;
   next();
 }else{
    res.sendStatus(403);
 }
}


////////////////////DEA////////////////////////////////////////////////
//Guardar DEA con el token ////////////////////////////
// Ruta para insertar un nuevo DEA
app.post("/api/nuevo_dea", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const { Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS } = req.body;

      // Realizar el INSERT INTO en la base de datos
      connection.query(
        "INSERT INTO dea_registrados (Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el INSERT
          } else {
            res.json({
              mensaje: "DEA creado exitosamente",
              nuevoUsuarioId: result.insertId
            });
          }
        }
      );
    }
  });
});

//Hacer el update /////////////////////////////
// Ruta para actualizar un DEA existente
app.put("/api/actualizar_dea/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const userId = req.params.id;
      const { Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS } = req.body;

      // Realizar el UPDATE en la base de datos
      connection.query(
        "UPDATE dea_registrados SET Nombre_Completo = ?, Documento_Identificacion = ?, Cantidad = ?, Nombre_Ubicacion = ?, Direccion_Ubicacion = ?, Codigo_Postal = ?, Ciudad_Municipio = ?, Departamento = ?, Tipo_Instalacion = ?, TipoDeclaracion = ?, Tipo_Espacio = ?, Num_Serie = ?, Modelo = ?, Marca = ?, Importador_Distribuidor = ?, Descripcion_Lugar_Ubicacion = ?, GPS = ? WHERE id = ?",
        [Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS, userId],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el UPDATE
          } else {
            res.json({
              mensaje: "DEA actualizado exitosamente",
              filasAfectadas: result.affectedRows
            });
          }
        }
      );
    }
  });
});

// Ruta para consultar todos los DEA
app.get("/api/deas", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      // Realiza una consulta a la base de datos para obtener todos los DEA
      connection.query(
        "SELECT id, Nombre_Completo, Documento_Identificacion, Cantidad, Nombre_Ubicacion, Direccion_Ubicacion, Codigo_Postal, Ciudad_Municipio, Departamento, Tipo_Instalacion, TipoDeclaracion, Tipo_Espacio, Num_Serie, Modelo, Marca, Importador_Distribuidor, Descripcion_Lugar_Ubicacion, GPS FROM dea_registrados",
        (err, results) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar la consulta
          } else {
            res.json(results); // Devuelve la lista de productos en formato JSON
          }
        }
      );
    }
  });
});

////////////////////FIN DEA////////////////////////////////////////////////

////////////////////TIPO DECLARACIÓN////////////////////////////////////////////////
app.post("/api/nuevo_tipo_declaracion", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const { Tipo } = req.body;

      // Realizar el INSERT INTO en la base de datos
      connection.query(
        "INSERT INTO tipo_declaracion (Tipo) VALUES (?)",
        [Tipo],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el INSERT
          } else {
            res.json({
              mensaje: "tipo_declaracion creado exitosamente",
              nuevoUsuarioId: result.insertId
            });
          }
        }
      );
    }
  });
});

// Ruta para actualizar un tipo_declaracion existente
app.put("/api/actualizar_tipo_declaracion/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const userId = req.params.id;
      const { Tipo } = req.body;

      // Realizar el UPDATE en la base de datos
      connection.query(
        "UPDATE tipo_declaracion SET Tipo = ? WHERE id = ?",
        [Tipo, userId],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el UPDATE
          } else {
            res.json({
              mensaje: "tipo_declaracion actualizado exitosamente",
              filasAfectadas: result.affectedRows
            });
          }
        }
      );
    }
  });
}); 

// Ruta para consultar todos los DEA
app.get("/api/tipo_declaracion", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      // Realiza una consulta a la base de datos para obtener todos los DEA
      connection.query(
        "SELECT id, Tipo FROM tipo_declaracion",
        (err, results) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar la consulta
          } else {
            res.json(results); // Devuelve la lista de productos en formato JSON
          }
        }
      );
    }
  });
});
////////////////////FIN TIPO DECLARACIÓN////////////////////////////////////////////////

////////////////////TIPO ESPACIO////////////////////////////////////////////////
app.post("/api/nuevo_tipo_espacio", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const { Tipo } = req.body;

      // Realizar el INSERT INTO en la base de datos
      connection.query(
        "INSERT INTO tipo_espacio (Tipo) VALUES (?)",
        [Tipo],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el INSERT
          } else {
            res.json({
              mensaje: "tipo_espacio creado exitosamente",
              nuevoUsuarioId: result.insertId
            });
          }
        }
      );
    }
  });
});

// Ruta para actualizar un tipo_espacio existente
app.put("/api/actualizar_tipo_espacio/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const userId = req.params.id;
      const { Tipo } = req.body;

      // Realizar el UPDATE en la base de datos
      connection.query(
        "UPDATE tipo_espacio SET Tipo = ? WHERE id = ?",
        [Tipo, userId],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el UPDATE
          } else {
            res.json({
              mensaje: "tipo_espacio actualizado exitosamente",
              filasAfectadas: result.affectedRows
            });
          }
        }
      );
    }
  });
}); 

// Ruta para consultar todos los DEA
app.get("/api/tipo_espacio", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      // Realiza una consulta a la base de datos para obtener todos los DEA
      connection.query(
        "SELECT id, Tipo FROM tipo_espacio",
        (err, results) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar la consulta
          } else {
            res.json(results); // Devuelve la lista de productos en formato JSON
          }
        }
      );
    }
  });
});
////////////////////FIN TIPO ESPACIO////////////////////////////////////////////////

////////////////////TIPO INSTALACION////////////////////////////////////////////////
app.post("/api/nuevo_tipo_instalacion", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const { Tipo } = req.body;

      // Realizar el INSERT INTO en la base de datos
      connection.query(
        "INSERT INTO tipo_instalacion (Tipo) VALUES (?)",
        [Tipo],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el INSERT
          } else {
            res.json({
              mensaje: "tipo_instalacion creado exitosamente",
              nuevoUsuarioId: result.insertId
            });
          }
        }
      );
    }
  });
});

// Ruta para actualizar un tipo_instalacion existente
app.put("/api/actualizar_tipo_instalacion/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      const userId = req.params.id;
      const { Tipo } = req.body;

      // Realizar el UPDATE en la base de datos
      connection.query(
        "UPDATE tipo_instalacion SET Tipo = ? WHERE id = ?",
        [Tipo, userId],
        (err, result) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar el UPDATE
          } else {
            res.json({
              mensaje: "tipo_instalacion actualizado exitosamente",
              filasAfectadas: result.affectedRows
            });
          }
        }
      );
    }
  });
}); 

// Ruta para consultar todos los DEA
app.get("/api/tipo_instalacion", verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (error, authData) => {
    if (error) {
      res.sendStatus(403); // Usuario no autorizado si el token es inválido
    } else {
      // Realiza una consulta a la base de datos para obtener todos los DEA
      connection.query(
        "SELECT id, Tipo FROM tipo_instalacion",
        (err, results) => {
          if (err) {
            res.sendStatus(500); // Error en el servidor al realizar la consulta
          } else {
            res.json(results); // Devuelve la lista de productos en formato JSON
          }
        }
      );
    }
  });
});
////////////////////FIN TIPO ESPACIO////////////////////////////////////////////////

app.listen(3000, function(){
    console.log("Nodejs app running...");
});
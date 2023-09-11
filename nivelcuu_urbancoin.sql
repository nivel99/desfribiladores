-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-09-2023 a las 12:22:47
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nivelcuu_urbancoin`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id` bigint(20) NOT NULL,
  `IDUsuario` bigint(20) NOT NULL,
  `Fecha` date NOT NULL DEFAULT current_timestamp(),
  `TipoActividad` varchar(20) NOT NULL,
  `Detalles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id`, `IDUsuario`, `Fecha`, `TipoActividad`, `Detalles`) VALUES
(1, 1, '2023-09-05', 'Comprar', 'Compra cualquier promocion en nuestro centro comercial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoriasdeproductos`
--

CREATE TABLE `categoriasdeproductos` (
  `id` bigint(20) NOT NULL,
  `NombreDeCategoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `categoriasdeproductos`
--

INSERT INTO `categoriasdeproductos` (`id`, `NombreDeCategoria`) VALUES
(1, 'Helados de chocolate');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ganadores`
--

CREATE TABLE `ganadores` (
  `id` bigint(20) NOT NULL,
  `IDUsuario` bigint(20) NOT NULL,
  `Promocion_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ganadores`
--

INSERT INTO `ganadores` (`id`, `IDUsuario`, `Promocion_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historialdepuntos`
--

CREATE TABLE `historialdepuntos` (
  `id` bigint(20) NOT NULL,
  `IDUsuario` bigint(20) NOT NULL,
  `Fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `PuntosGanados` int(11) NOT NULL,
  `PuntosGastados` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `historialdepuntos`
--

INSERT INTO `historialdepuntos` (`id`, `IDUsuario`, `Fecha`, `PuntosGanados`, `PuntosGastados`) VALUES
(1, 1, '2023-09-05 05:00:00', 50, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plantilla`
--

CREATE TABLE `plantilla` (
  `id` int(11) NOT NULL,
  `HeaderColor` varchar(10) NOT NULL,
  `FooterColor` varchar(10) NOT NULL,
  `AsideColor` varchar(10) NOT NULL,
  `Logo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` varchar(100) NOT NULL,
  `Precio` int(11) NOT NULL,
  `Categoria` int(11) NOT NULL,
  `StockDisponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `Nombre`, `Descripcion`, `Precio`, `Categoria`, `StockDisponible`) VALUES
(1, 'Helado de chocolate', 'Helado grande con chispas de chocolate', 5000, 1, 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `id` bigint(20) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text NOT NULL,
  `Estado` varchar(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `promociones`
--

INSERT INTO `promociones` (`id`, `Nombre`, `Descripcion`, `Estado`) VALUES
(1, 'Camisas blancas', 'Camisa', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recompensas`
--

CREATE TABLE `recompensas` (
  `id` bigint(20) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text NOT NULL,
  `PuntosRequeridos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `recompensas`
--

INSERT INTO `recompensas` (`id`, `Nombre`, `Descripcion`, `PuntosRequeridos`) VALUES
(1, 'Camisa brandeada con logo', 'Camisa con logo', 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones`
--

CREATE TABLE `transacciones` (
  `id` bigint(20) NOT NULL,
  `Fecha` date NOT NULL,
  `Monto` int(11) NOT NULL,
  `IDUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `transacciones`
--

INSERT INTO `transacciones` (`id`, `Fecha`, `Monto`, `IDUsuario`) VALUES
(1, '2023-09-05', 7000, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `resetPasswordToken` varchar(150) NOT NULL,
  `confirmationToken` varchar(150) NOT NULL,
  `confirmed` int(11) NOT NULL,
  `blocked` int(11) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'Cliente',
  `Telefono` varchar(20) NOT NULL,
  `FechaNacimiento` varchar(20) NOT NULL,
  `Fecha_Registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `email`, `password`, `resetPasswordToken`, `confirmationToken`, `confirmed`, `blocked`, `role`, `Telefono`, `FechaNacimiento`, `Fecha_Registro`) VALUES
(1, 'Carlos Alberto Ramirez', 'inteligenciafuturatv@gmail.com', '$2b$10$Sd/8y8z8ZaIJZcdEYhXk5ud6h9AheKUZClNngkUt.rJ0gGUYukpiK', 'EMaBKBQ7RwemjvEDLSJE', 'R6MGlACiGLLqV2PzwyR2', 0, 0, '', '3185772576', '1980-08-26', '2023-09-05 20:43:35'),
(2, 'Josefina Ramirez', 'yunita2061@gmail.com', '$2b$10$gREEJzwoh/zmjdRoG/fX1uw5VSRDihQKOIESVEagBAGmCndqpyJtm', 'Auv5ufimvDKsc1bHBtd3', 'e2nGRgejoFazFBcWQaNA', 0, 0, 'Cliente', '3185772576', '1980-08-26', '2023-09-05 20:43:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `wallets`
--

CREATE TABLE `wallets` (
  `id` bigint(20) NOT NULL,
  `DireccionPublica` varchar(150) NOT NULL,
  `DireccionPrivada` varchar(150) NOT NULL,
  `IDUsuario` bigint(20) NOT NULL,
  `ClavePrincipal` varchar(100) NOT NULL,
  `ClaveSecundaria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoriasdeproductos`
--
ALTER TABLE `categoriasdeproductos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ganadores`
--
ALTER TABLE `ganadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historialdepuntos`
--
ALTER TABLE `historialdepuntos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `plantilla`
--
ALTER TABLE `plantilla`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `recompensas`
--
ALTER TABLE `recompensas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categoriasdeproductos`
--
ALTER TABLE `categoriasdeproductos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ganadores`
--
ALTER TABLE `ganadores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historialdepuntos`
--
ALTER TABLE `historialdepuntos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `plantilla`
--
ALTER TABLE `plantilla`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `recompensas`
--
ALTER TABLE `recompensas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE DATABASE atenciones_por_correo;

USE atenciones_por_correo;

INSERT INTO registros (usuario_inhouse, tipo_id, numero_id, nombre_afiliado, fecha, observacion)
VALUES ('CAMARTIN', 'CC', '123456789', 'Carlos Martín', '2023-10-01', 'Primera observación');

SELECT * FROM registros;


CREATE TABLE `registros` (
  `usuario_inhouse` varchar(50) NOT NULL,
  `tipo_id` varchar(10) NOT NULL,
  `numero_id` varchar(20) NOT NULL,
  `nombre_afiliado` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `observacion` text,
  PRIMARY KEY (`numero_id`)
)
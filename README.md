# ApiProductos-Farmacia

## IMPORTANTE:
- BuscarProducto.js, CrearProducto.js, EliminarProducto.js, ListarProductos.js, ModificarProducto.js, validarToken.js, serverless.yml y la carpeta docs VAN EN UN SOLO LUGAR
- docker-compose.yml VA SOLO A LA MÁQUINA VIRTUAL MV BÚSQUEDA
- index.mjs ES UN LAMBDA SEPARADO, NO OLVIDAR GATILLARLO AL STREAM DE LA TABLA t_productos_${sls:stage}
- Producto-PROYECTO.postman_collection.json ES PARA PROBAR EN POSTMAN.

## PUERTOS INBOUND RULES:
- En el MV del microservicio, para Producto se usaron los puertos para asegurar: 80, 22, 443, 9200. Si falla, agregar 9300.
- En el MV Búsqueda, para asegurar se usó: 80, 22, 443, 9200.
## PASOS:
- Hacer git clone en la VM del microservicio e ingresar a su directorio
- En el directorio, hacer "npm install aws-sdk"
- Finalmente se hace el sls deploy ahí
- Una vez tenido lo de arriba (lo del microservicio) hecho, CREAR LA MV Búsqueda
- Meter el docker-compose.yml ahí.
- Con la MV Búsqueda ya creada, ir a Lambda y crear ActualizarProducto.
- Ahí copiar y pegar lo de index.mjs Y CAMBIAR LA IP EN EL COMENTARIO AL DEL MV Búsqueda.
- EN TU LAPTOP LOCAL, CORRER npm install @elastic/elasticsearch @aws-sdk/util-dynamodb tslib, LO PONES EN UN ZIP Y LO GUARDAS DENTRO DE UN CONTENEDOR S3.
- Con el contenedor creado con el zip de node_modules, en el apartado de código, en Upload from, darle a Amazon S3 Location, y pegar la dirección del zip con las dependencias. DEBERÍA APARECER index.mjs y node_modules.
- Darle a Add Trigger que aparecerá en Function Overview, y enlazarlo a t_productos_${sls:stage}
- Darle a Deploy
- Una vez hecho esto, volver a MV Búsqueda y crear el un volumen con "docker volume create ElasticSearch"
- Hacer docker compose up -d
- Hacer curl -X PUT http://IP-DE-MV-BÚSQUEDA:9200/idx_productos
- Probar añadiendo productos, modificando y eliminando, hacer curl "http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:producto2&pretty" cada vez que hagas un método.
- PARA PROBAR SWAGGER UI, PONER LA URL EN EL BUSCADOR https://1tcf5g4quh.execute-api.us-east-1.amazonaws.com/(dev,test,prod)/docs-ui QUE VA A SALIR CUANDO SE HAGA sls deploy EN CUALQUIER STAGE
## Métodos: Se puede probar en postman en el .postman_collection que está en este github
- POST ListarProductos
- POST CrearProducto
- POST BuscarProducto
- PUT ModificarProducto
- DELETE EliminarProducto
También se añadieron funciones de Usuario para seguir:
- POST CrearUsuario
- POST LoginUsuario

# Curls para MV Búsqueda con Elastic Search
- curl http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:nuevo_id
- curl "http://IP-DE-MV-BÚSQUEDA:9200/idx_productos/_search?q=producto_id:producto2&pretty"

# Fuente:
- https://swagger-io.translate.goog/specification/?_x_tr_sl=en&_x_tr_tl=es&_x_tr_hl=es&_x_tr_pto=tc

# NEXT.JS TESLO STORE

Para correr localmente, se necesita la DATABASE

```
 docker-compose up -d
```

- El -d, significa **detached**

* MongoDB URL Local:

```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno

Renombrar archivo **.env.template.** a **.env.**

## Llenar la Base de Datos con info de Prueba

Llamar a:

```
http://localhost:3000/api/seed
```

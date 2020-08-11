## Login

```
❯ curl -H 'Content-Type: application/json;charset=UTF-8' http://api.abakus.life:8080/login -d '{"credentials": {"username": "alanizmarcel@gmail.com", "password": "1234"}}' | jq .
{
  "_id": "5f2af65d5e24f200dde129eb",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJhZjY1ZDVlMjRmMjAwZGRlMTI5ZWIiLCJ1c2VybmFtZSI6ImFsYW5pem1hcmNlbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjgxZGM5YmRiNTJkMDRkYzIwMDM2ZGJkODMxM2VkMDU1IiwiaWF0IjoxNTk3MTYyMDE4LCJleHAiOjE1OTcxNjIzMTh9.8JoyOSU4e1lnOOBF1RrQ-iETDF7Yc16kFccMWGMZcRw"
}
```


## Login y grabamos el token en una variable

```
~
❯ export TOKEN=`curl -H 'Content-Type: application/json;charset=UTF-8' http://api.abakus.life:8080/login -d '{"credentials": {"username": "alanizmarcel@gmail.com", "password": "qwerty"}}'| jq .token | sed "s/\"//g"`
```


# Api con entidades

## Listar una collection de elementos
```
~
❯ curl -H 'Content-Type: application/json;charset=UTF-8' -H "Authorization: bearer $TOKEN" http://api.abakus.life:8080/api/<tu-entity>/lst -d '{"filters": {"campo": "valor"}}'
```

Los filters pueden no ir es decir en -d '{}'

## Obtener un elemento
```
~
❯ curl -H 'Content-Type: application/json;charset=UTF-8' -H "Authorization: bearer $TOKEN" http://api.abakus.life:8080/api/<tu-entity>/get?_id=5eeba8e26a6423dc0e81df1d
```


## Insertar un nuevo elemento
En la url uno puede usar el entity que quiera, en este caso use persona, pero si no existe lo crea, como una collection.

```
~
❯ curl -H 'Content-Type: application/json;charset=UTF-8' -H "Authorization: bearer $TOKEN" http://api.abakus.life:8080/api/personas/put -d '{"nombre": "Martin", "apellido": "Furst", "dni": "000000000"}'
```


## Actualizar un nuevo elemento
Como se puede ver aca, el update si o si necesita el _id que te devuelve mongo al insertar. Eso lo tenes cuando haces o un `lst` o un `get` o cuando haces el `put` y guardaste el _id en algun lado.

```
~
❯ curl -H 'Content-Type: application/json;charset=UTF-8' -H "Authorization: bearer $TOKEN" http://api.abakus.life:8080/api/persona/upd -d '{"_id":"5eeba8e26a6423dc0e81df1d", "name": "Tincho", "address": "zoilo concha 69"}'
```

## Borrar un elemento
Se pasa el _id por get solamente.
```
~
❯ curl -H 'Content-Type: application/json;charset=UTF-8' -H "Authorization: bearer $TOKEN" http://api.abakus.life:8080/api/persona/del?_id=5eeba8e26a6423dc0e81df1d
```



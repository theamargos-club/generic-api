## signup
```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
  http://199.168.160.184:8080/signup -d \
  '{"signup": {"username": "alanizmarcel@gmail.com", "password": "1234"}}' \
| jq .
```
Response:
```json
{
  "res": "OP_OK",
  "data": {
    "approved": false,
    "password": "81dc9bdb52d04dc20036dbd8313ed055",
    "token": "c4e80b05898bb03468a729a4286f09de",
    "username": "alanizmarcel@gmail.com",
    "_id": "60a5a4d2faa38fdff5f1a183"
  }
}
```

## confirm

```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
  http://199.168.160.184:8080/confirm/c4e80b05898bb03468a729a4286f09de
```
Response:
```json
{"res":"OP_OK","approved":true}
```

## Login

```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
  http://199.168.160.184:8080/login -d \
  '{"credentials": {"username": "alanizmarcel@gmail.com", "password": "1234"}}' \
| jq .
```
Response:
```json
{
  "_id": "5f2af65d5e24f200dde129eb",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjJhZjY1ZDVlMjRmMjAwZGRlMTI5ZWIiLCJ1c2VybmFtZSI6ImFsYW5pem1hcmNlbEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjgxZGM5YmRiNTJkMDRkYzIwMDM2ZGJkODMxM2VkMDU1IiwiaWF0IjoxNTk3MTYyMDE4LCJleHAiOjE1OTcxNjIzMTh9.8JoyOSU4e1lnOOBF1RrQ-iETDF7Yc16kFccMWGMZcRw"
}
```


## Login and token save on environment variable

```bash
export TOKEN=`curl -H 'Content-Type: application/json;charset=UTF-8' \
  http://199.168.160.184:8080/login -d \
  '{"credentials": {"username": "alanizmarcel@gmail.com", "password": "1234"}}' \
  | jq .token | sed "s/\"//g"`
```


# Api con entidades

## List elements from \<your-collection\>
```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
     -H "Authorization: bearer $TOKEN" \
     http://199.168.160.184:8080/api/<your-collection>/lst -d \
     '{"filters": {"field": "value"}}'
```
* **value** can be "string" or /regex/
* filters can be **empty** with `-d '{}'`

## Get an Element from \<your-collection\>
```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
     -H "Authorization: bearer $TOKEN" \
     http://199.168.160.184:8080/api/<your-collection>/get?_id=5eeba8e26a6423dc0e81df1d
```


## Insert an Element in collection \<people\>
You can use in the url any name for your collection, in this case is **people**. If it doesn't exist will be created.

```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
     -H "Authorization: bearer $TOKEN" \
     http://199.168.160.184:8080/api/people/put -d \
     '{"name": "Martin", "lastname": "Furst", "passport": "000000000"}'
```


## Update an element of collection \<people\>
This operation needs _id that you'll get when the object is inserted or queried. _id assigned by mongodb. Others new fields or older but with new values together with _id will produce the update of the element.

```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
     -H "Authorization: bearer $TOKEN" \
     http://199.168.160.184:8080/api/people/upd -d \
     '{"_id":"5eeba8e26a6423dc0e81df1d", "name": "Marce", "address": "another address 123"}'
```

## Delete an element on \<people\> collection
You need to provide the _id of the object to be deleted
```bash
curl -H 'Content-Type: application/json;charset=UTF-8' \
     -H "Authorization: bearer $TOKEN" \
     http://199.168.160.184:8080/api/persona/del?_id=5eeba8e26a6423dc0e81df1d
```



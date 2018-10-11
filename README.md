# cdrop

POST a file to cdrop. Then you can GET it once.
After that, it's deleted.

Makes it easy to share files with relative security.

## POST a file to cdrop.

```sh
curl -F 'f=@README.md' http://localhost:8080
<a href="http://localhost:8080/evi2_DA_v">http://localhost:8080/evi2_DA_v</a>
localhost:8080/evi2_DA_v
```

## GET the file from cdrop.

```sh
curl http://localhost:8080/evi2_DA_v > README-copy.md
# OR
wget -o README-copy.md http://localhost:8080/evi2_DA_v
```

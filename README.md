# cdrop

POST a file to cdrop. Then you can GET it once.
After that, it's deleted.

Makes it easy to share files with relative security.

## POST a file to cdrop.

```sh
curl -F 'f=@README.md' localhost:8080
<a href="//localhost:8080/evi2_DA_v">localhost:8080/evi2_DA_v</a>
localhost:8080/evi2_DA_v
```

## GET the file from cdrop.

```sh
curl localhost:8080/evi2_DA_v > README-copy.md
# OR
wget -o README-copy.md localhost:8080/evi2_DA_v
```

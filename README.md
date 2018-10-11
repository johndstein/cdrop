# cdrop

POST a file to cdrop. Then you can GET it once.
After that, it's deleted.

Makes it easy to share files with relative security.

## POST a file to cdrop.

```sh
curl -F 'f=@README.md' localhost:8080
# or encrypt before sending
gpg -ac < README.md | curl -F f=@- localhost:8080
```

## GET the file from cdrop.

```sh
curl localhost:8080/evi2_DA_v > README.md
# or decrypt after receiving
curl localhost:8080/evi2_DA_v | gpg -d > README.md
```

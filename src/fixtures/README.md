This data was created using
```sh
# run from this directory
# docker run -it --rm -v $(pwd):/opt/fixtures  cartesi/playground:0.1.1 /bin/bash 
# cd /opt/fixtures
mkdir ext2-test
touch ext2-test/test-data
cat "hello world" >> ext2-test/test-data
genext2fs -b 1024 -d ext2-test dapp-test-data.ext2
# to verify
e2ls dapp-test-data.ext2
```

